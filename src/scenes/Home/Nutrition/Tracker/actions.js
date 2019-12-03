// packages
import { actions } from "react-redux-form/native"
import * as Sentry from "sentry-expo"

import { GetDayByIdQuery } from "graphql/query/food/getDayById"
import { NUTRITION_TRACKER_FORM } from "constants"
import {
  detectItemType,
  getServingNutritionFact,
  getServingNutritionFacts,
  MEAL,
  FOOD,
  SOURCE_CACHE_FS,
  SOURCE_FS_FULL,
  SOURCE_KS_SEARCH,
  SOURCE_KS_FOODBANK,
  extractItemId,
  dataToFood
} from "keystone/food"
import { foodByIdQuery as fsFoodByIdQuery } from "graphql/query/fatSecret/byId"
import { genUuid, cals } from "keystone"
import { getMealsByIds } from "graphql/query/food/getMealsByIds"
import { foodByIdQuery as ksFoodByIdQuery } from "graphql/query/keystoneFoodbank/byId"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { saveRecentFood } from "graphql/mutation/food/saveRecent"
import { searchByExternalIds } from "graphql/query/food/searchByExternalId"
import { upsertFood } from "graphql/mutation/food/upsertFood"
import _ from "lodash/fp"

export const quickAdd = (mealIndex, items) => async (dispatch, getState) => {
  // get other food items
  const foodItems = items.filter(i => detectItemType(i) === FOOD)

  const outerSources = [
    SOURCE_CACHE_FS,
    SOURCE_FS_FULL,
    SOURCE_KS_SEARCH,
    SOURCE_KS_FOODBANK
  ]
  const cachedFoodItems = foodItems.filter(f => !outerSources.includes(f.type))

  try {
    // collect all new food items
    const newFood = [...cachedFoodItems]
    // get current food
    const currEntries = _.getOr(
      [],
      `${NUTRITION_TRACKER_FORM}.meals[${mealIndex}].entries`,
      getState()
    )

    const newEntries = newFood.map(mkEntry)
    const updatedMeal = [...currEntries, ...newEntries]

    // update required meal
    dispatch(
      actions.change(`${NUTRITION_TRACKER_FORM}.meals[${mealIndex}].entries`, updatedMeal)
    )
    // save tracker
    dispatch(actions.submit(NUTRITION_TRACKER_FORM))

    return updatedMeal.length
  } catch (e) {}
}

export const addItems = (client, id, items) => async (dispatch, getState) => {
  // stop UI flow
  dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.isLoading`, true))

  // get meals
  const mealIds = items.filter(i => detectItemType(i) === MEAL).map(m => m.id)

  // get other food items
  const foodItems = items.filter(i => detectItemType(i) === FOOD)

  // get FS food items
  const fsSources = [SOURCE_CACHE_FS, SOURCE_FS_FULL]
  const fsIds = foodItems.filter(f => fsSources.includes(f.type)).map(extractItemId)

  // get keystone elastic search food items
  const ksSources = [SOURCE_KS_SEARCH, SOURCE_KS_FOODBANK]
  const ksIds = foodItems.filter(f => ksSources.includes(f.type)).map(extractItemId)

  const outerSources = [
    SOURCE_CACHE_FS,
    SOURCE_FS_FULL,
    SOURCE_KS_SEARCH,
    SOURCE_KS_FOODBANK
  ]
  const cachedFoodItems = foodItems.filter(f => !outerSources.includes(f.type))

  try {
    // query meals and food simultaneously
    const [fsRes, ksRes, mealsRes] = await Promise.all([
      client.query(searchByExternalIds(fsIds)),
      client.query(searchByExternalIds(ksIds)),
      client.query(getMealsByIds(mealIds))
    ])
    // transform all found FS items
    const fsDbItems = _.getOr([], "data.foodByExternalIds.nodes", fsRes).map(dataToFood)
    // transform all found KS items
    const ksDbItems = _.getOr([], "data.foodByExternalIds.nodes", ksRes).map(dataToFood)

    // read the meal in the proper order and convert item food
    const mealItems = _.flatMap(
      m =>
        _.sortBy("orderIndex", m.items.nodes).map(i => ({
          id: genUuid(),
          food: dataToFood(i.food),
          serving: i.serving
        })),
      _.getOr([], "data.memberMealsByIds.nodes", mealsRes)
    )

    // find all FS ids for items in the basket which are not in the keystone food
    const foundFsIds = fsDbItems.map(f => f.externalId).filter(x => !!x)
    const missedFsIds = fsIds.filter(x => !foundFsIds.includes(x))

    // find all keystone foodbank ids for items in the basket which are not in the keystone food
    const foundKsIds = ksDbItems.map(f => f.externalId).filter(x => !!x)
    const missedKsIds = ksIds.filter(x => !foundKsIds.includes(x))

    // fetch all missed FS and keystone food items
    const [newFsItems, newKsItems] = await Promise.all([
      fetchMissedFood(
        missedFsIds,
        fsFoodByIdQuery,
        client,
        "data.currentMember.foodItemById"
      ),
      fetchMissedFood(missedKsIds, ksFoodByIdQuery, client, "data.foodbankFoodById")
    ])

    // collect all new food items
    const newFood = [
      ...cachedFoodItems,
      ...fsDbItems,
      ...ksDbItems,
      ...mealItems,
      ...newFsItems,
      ...newKsItems
    ]
    // get current food
    const curFood = _.getOr(
      [],
      `${NUTRITION_TRACKER_FORM}.meals[${id}].entries`,
      getState()
    )
    // update required meal
    dispatch(
      actions.change(`${NUTRITION_TRACKER_FORM}.meals[${id}].entries`, [
        ...curFood,
        ...newFood.map(mkEntry)
      ])
    )
    // save recent (only selected food items: search, recent, favs, food, recipe; no meal/no day)
    const selectedFoodItems = [
      ...cachedFoodItems,
      ...fsDbItems,
      ...ksDbItems,
      ...newFsItems,
      ...newKsItems
    ]
    const foodIds = selectedFoodItems.map(f => f.id)
    await client.mutate(saveRecentFood(foodIds))

    // save tracker
    dispatch(actions.submit(NUTRITION_TRACKER_FORM))
  } catch (e) {
    dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.error`, _.toString(e)))
    logErrorWithMemberId(memberId => {
      Sentry.captureException(
        new Error(
          `MId:{${memberId}}, Scope:{Nutrition.Tracker.actions.addItems}, ${_.toString(
            e
          )}`
        )
      )
    })
  }
  // release UI flow
  dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.isLoading`, false))
}

const fetchMissedFood = async (missedIds, foodByIdQuery, client, dataSource) => {
  // fetch messed food one by one
  const foodRes = await Promise.all(missedIds.map(id => client.query(foodByIdQuery(id))))
  // transform all found food items
  const items = foodRes.map(item => dataToFood(_.getOr({}, dataSource, item)))
  // save new food
  const savedItems = await Promise.all(items.map(f => client.mutate(upsertFood(f))))
  // transform all saved items
  const newItems = savedItems.map(item =>
    dataToFood(_.getOr({}, "data.upsertFood.food", item))
  )

  return newItems
}

export const createMacrosEntry = (macros, label, origin = null) =>
  Object.freeze({
    macros,
    cals: cals(macros),
    label,
    measure: "g",
    origin
  })

const createFoodEntry = (macros, label) => rest => {
  return {
    ...rest,
    ...createMacrosEntry(macros, label),
    cals: macros.cals || macros.calories
  }
}

const createMyFoodEntry = myFood => {
  const { label, macros } = myFood
  const cals = myFood.calories || myFood.cals //calories from myfoods, cals from the tracker
  const { protein = 0, fat = 0, carbs = 0 } = macros
  const transformedMacros = createMacrosEntry({ protein, fat, carbs }, label)
  const entry = {
    type: "food",
    label,
    cals,
    ...transformedMacros,
    macros: {
      ...macros,
      cals: transformedMacros.cals
    },
    meta: {
      source: "myfood",
      id: myFood.id || _.getOr(-1, "meta.id", myFood)
    },
    servings: [
      {
        description: "serving",
        calories: cals,
        protein,
        fat,
        carbs,
        fibre: null,
        alcohol: null,
        unit: "serving",
        amount: 1
      }
    ],
    amount: 1,
    servingAmount: "1",
    servingUnit: "serving",
    unit: "serving",
    numberOfUnits: 1
  }
  return entry
}

const convertDbToEntry = ({ food, serving }) => ({
  meta: {
    source: food.type,
    id: food.id,
    brand: food.brand,
    externalId: food.externalId
  },
  type: "food",
  label: food.name,

  cals: getServingNutritionFact(serving, food.macros.calories),
  macros: getServingNutritionFacts(serving, food.macros),

  measure: "g",
  unit: serving.unit,

  servingUnit: `${serving.name}`,

  amount: serving.volume,
  servingAmount: `${serving.num}`,
  numberOfUnits: "1",

  servings: food.servings.map(s => ({
    ...getServingNutritionFacts(s, food.macros),
    description: s.name,
    unit: s.unit,
    amount: s.volume,
    servingAmount: s.num
  })),
  provider: food.provider,
  origin: food.origin
})

export const mkEntry = payload => {
  const { macros, label, serving, ...rest } = payload
  // checking if meal item
  if (serving) {
    return convertDbToEntry(payload)
  }
  if (_.isNumber(rest.type)) {
    return convertDbToEntry({
      food: payload,
      serving: payload.servings[payload.defaultServingIndex || 0]
    })
  }
  switch (rest.type) {
    case "food":
      return createFoodEntry(macros, label)(rest)
    case "myfood":
      return createMyFoodEntry(payload)
    default: {
      // TODO: payload in this case should have type==macro
      return {
        ...createMacrosEntry(macros, label, payload.origin),
        meta: { source: "macro" }
      }
    }
  }
}

const handleNutritionDayAdd = (
  client,
  dispatch,
  preHook = () => null,
  postHook = () => null
) => async dayId => {
  // set loading
  dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.isLoading`, true))
  try {
    preHook()
    const dayResp = await client.query(GetDayByIdQuery(dayId))
    const meals = _.getOr([], "data.nutritionDayById.meals.nodes", dayResp).map(meal => ({
      entries: _.getOr([], "items.nodes", meal)
        .map(i => ({ food: dataToFood(i.food), serving: i.serving }))
        .map(mkEntry)
    }))
    dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.meals`, meals))
    dispatch(actions.submit(NUTRITION_TRACKER_FORM))
    postHook()
  } catch (e) {
    logErrorWithMemberId(memberId => {
      Sentry.captureException(
        new Error(`MId:{${memberId}}, Scope:{handleNutritionDayAdd}, ${e}`)
      )
    })
  }
  dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.isLoading`, false))
}

export const segueToDayAdd = handleNutritionDayAdd

export default addItems
