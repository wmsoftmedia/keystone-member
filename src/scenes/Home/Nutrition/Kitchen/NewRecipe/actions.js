// packages
import _ from "lodash/fp"
import { actions } from "react-redux-form/native"
import * as Sentry from "sentry-expo"
// queries
import { searchByExternalIds } from "graphql/query/food/searchByExternalId"
import { foodByIdQuery as fsFoodByIdQuery } from "graphql/query/fatSecret/byId"
import { foodByIdQuery as ksFoodByIdQuery } from "graphql/query/keystoneFoodbank/byId"
// project components
import { getOr, genUuid } from "keystone"
import {
  dataToFood,
  SOURCE_CACHE_FS,
  SOURCE_FS_FULL,
  SOURCE_KS_SEARCH,
  SOURCE_KS_FOODBANK,
  extractItemId
} from "keystone/food"
import { FORM_NAME } from "./RecipeScreen"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { upsertFood } from "graphql/mutation/food/upsertFood"

export const SET_LOADING = "SET_LOADING"
export const SET_ERROR = "SET_ERROR"
export const RESET = "RESET"

const setLoading = status => ({ type: SET_LOADING, status })
const setError = error => ({ type: SET_ERROR, error })
const reset = { type: RESET }

const addFood = (client, food) => async (dispatch, getState) => {
  // const createPromise = id => client.query(foodByIdQuery(id))
  const foodToMealItem = food => ({
    food,
    serving: food.servings[food.defaultServingIndex],
    id: genUuid()
  })

  // stop UI flow
  dispatch(setLoading(true))

  // get FS food items
  const fsSources = [SOURCE_CACHE_FS, SOURCE_FS_FULL]
  const fsIds = food.filter(f => fsSources.includes(f.type)).map(extractItemId)

  // get keystone elastic search food items
  const ksSources = [SOURCE_KS_SEARCH, SOURCE_KS_FOODBANK]
  const ksIds = food.filter(f => ksSources.includes(f.type)).map(extractItemId)

  const outerSources = [
    SOURCE_CACHE_FS,
    SOURCE_FS_FULL,
    SOURCE_KS_SEARCH,
    SOURCE_KS_FOODBANK
  ]
  const cachedFoodItems = food.filter(f => !outerSources.includes(f.type))

  try {
    // query meals and food simultaneously
    const [fsRes, ksRes] = await Promise.all([
      client.query(searchByExternalIds(fsIds)),
      client.query(searchByExternalIds(ksIds))
    ])
    // transform all found FS items
    const fsDbItems = getOr([], "data.foodByExternalIds.nodes", fsRes).map(dataToFood)
    // transform all found KS items
    const ksDbItems = getOr([], "data.foodByExternalIds.nodes", ksRes).map(dataToFood)

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
      ...newFsItems,
      ...newKsItems
    ]

    // get current food list
    const loadedFood = getOr([], `${FORM_NAME}.ingredients`, getState())
    // update required meal
    dispatch(
      actions.change(`${FORM_NAME}.ingredients`, [
        ...loadedFood,
        ...newFood.map(foodToMealItem)
      ])
    )
  } catch (e) {
    dispatch(setError(_.toString(e)))
    logErrorWithMemberId(memberId => {
      Sentry.captureException(
        new Error(
          `MId:{${memberId}}, Scope:{Nutrition.Kitchen.NewRecipe.actions.addItems}, ${_.toString(
            e
          )}`
        )
      )
    })
  }

  // release UI flow
  dispatch(setLoading(false))
}

const fetchMissedFood = async (missedIds, foodByIdQuery, client, dataSource) => {
  // fetch messed food one by one
  const foodRes = await Promise.all(missedIds.map(id => client.query(foodByIdQuery(id))))
  // transform all found food items
  const items = foodRes.map(item => dataToFood(getOr({}, dataSource, item)))
  // save new food
  const savedItems = await Promise.all(items.map(f => client.mutate(upsertFood(f))))
  // transform all saved items
  const newItems = savedItems.map(item =>
    dataToFood(getOr({}, "data.upsertFood.food", item))
  )

  return newItems
}

export default {
  addFood,
  setLoading,
  setError,
  reset
}
