import * as Sentry from "sentry-expo"
import { logErrorWithMemberId } from "hoc/withErrorHandler"

import { getOr, round, numOr } from "keystone"

const nullOrUndefined = value => value === null || value === undefined

/**
ADT for food related entities

type P_Float = { x: Float  | x >= 0}
type Macro = P_Float
type Calories = P_Float
type NutritionFact = { Macro | Calories }
type FoodId = { Int | Uuid }
---
type DataSource = {
  UNKNOWN
  | FS_SEARCH
  | FS_FULL
  | DB_FOOD
  | DB_FOOD_OLD
  | DB_CACHE
  | CACHE_FS
  | CACHE_MACRO
  | CACHE_OLD_MY_FOOD
  | CACHE_DB_FOOD
}
type Provider = { FS | DB }
type ExternalRef = { id: Text, provider: Provider }

type NutritionFacts = {
  calories: Calories,
  carbs: Macro,
  fat: Macro,
  protein: Macro,
  fibre: Macro,
  alcohol: Macro,
  ...
}
** invariant: macrosToCalories(macros) <= macros.calories | macros: NutritionFacts

type Serving = {
  num_of_serves: P_Float,
  serve_volume: P_Float,
  serve_unit: Text,
  serve_name: Text
}

type Food = {
  title: Text,
  brand: Text,
  reference_macro: NutritionFacts,
  available_servings: [Serving],
  ref: ExternalRef,
  source: DataSource
  is_my_food: Bool
}
** invariant: `title` is not empty
** invariant: `available_servings` is not empty

type MealItem = { food: Food, serving: Serving }
** invariant: `food` is not empty
** invariant: `serving` is not empty
** invariant: item.serving ∈ item.food.servings | item: MealItem

type Meal = { title: Text, food: [MealItem] }
** invariant: `title` is not empty
** invariant: `food` is not empty

---

macroToCalories: Text -> P_Float -> Calories
nutritionToCalories: NutritionFacts -> Calories
detectFoodSource: Any -> DataSource
extractItemId: Any -> FoodId
extractFoodListId: Any -> Int -> Text
mergeNutritionFacts: facts1: NutritionFacts -> facts2: NutritionFacts -> result: NutritionFacts
getRefNutritionFact: Serving -> serving_value: NutritionFact -> result: NutritionFact
getRefNutritionFacts: Serving -> serving_value: NutritionFacts -> result: NutritionFacts
getServingNutritionFact: Serving -> reference_value: NutritionFact -> result: NutritionFact
getServingNutritionFacts: Serving -> reference_value: NutritionFacts -> result: NutritionFacts
mealItemNutritionFacts: MealItem -> NutritionFacts
mealNutritionFacts: Meal -> NutritionFacts
dataToMeal: Any -> Meal
dataToFood: Any -> Food

*/

/**
  These types are based on ADT but are not identical due to JsDoc restrictions
  and JS implementation of types

  @typedef {string} UUID
  @typedef {string} MacroKey
  @typedef {number} Calories
  @typedef {number} Macro
  @typedef {number} FoodSource
  @typedef {number} NutritionType
  @typedef {(number|UUID)} NutritionIndex
  @typedef {string} FoodListIndex

  @typedef NutritionFacts
  @type {object}
  @property {Macro} fat - volume of fat in serving
  @property {Macro} carbs - volume of carbs in serving
  @property {Macro} protein - volume of protein in serving
  @property {Macro} fibre - volume of fibre in serving
  @property {Macro} alcohol - volume of alcohol in serving
  @property {Calories} calories - calories in serving
  @property {Micro} saturatedFat - volume of saturated fat in serving (in grams)
  @property {Micro} polyunsaturatedFat - volume of polyunsaturated fat in serving (in grams)
  @property {Micro} monounsaturatedFat - volume of monounsaturated fat in serving (in grams)
  @property {Micro} transFat - volume of trans fat in serving (in grams)
  @property {Micro} cholesterol - volume of cholesterol in serving (in milligrams)
  @property {Micro} sodium - volume of sodium in serving (in milligrams)
  @property {Micro} potassium - volume of potassium in serving (in milligrams)
  @property {Micro} sugar - volume of sugar in serving (in grams)
  @property {Micro} vitaminA - volume of vitamin A in serving (percentage/2000kcal)
  @property {Micro} vitaminC - volume of vitamin C in serving (percentage/2000kcal)
  @property {Micro} calcium - volume of calcium in serving (percentage/2000kcal)
  @property {Micro} iron - volume of iron in serving (percentage/2000kcal)

  @typedef Serving
  @type {object}
  @property {number} num - number of portions
  @property {string} name - name of a serving ("1 gram", "half of bucket")
  @property {number} volume - volume of a serving
  @property {string} unit - unit of a serving ("g" or "ml")

  @typedef Food
  @type {object}
  @property {NutritionFacts} macros - reference macros
  @property {[Serving]} serving - available servings
  @property {string} name
  @property {string} brand
  @property {string} externalId - id of food in some external databases
  @property {string} provider - an origin of original food data
  @property {FoodSource} source - a source of given food
  @property {boolean} isMyFood
  @property {boolean} isGeneric

  @typedef MealItem
  @type {object}
  @property {Serving} serving
  @property {Food} food

  @typedef Meal
  @type {object}
  @property {string} name
  @property {[MealItem]} items

  @typedef NutritionDay
  @type {object}
  @property {string} name
  @property {string} notes
  @property {[Meal]} meals

 */

export const cals = ({ protein = 0, fat = 0, carbs = 0 }) =>
  +protein * 4 + +fat * 9 + +carbs * 4

/**
 * Calculate calories for a specific macro
 *
 * @param {MacroKey} macro a macro key
 * @param {number} value volume of macro
 * @returns {Calories} calories in a given macro volume
 */
export const macroToCalories = (macro, value) => {
  switch (macro) {
    case "fat":
      return numOr(value) * 9
    case "protein":
    case "carbs":
      return numOr(value) * 4
    default:
      return 0
  }
}

/**
 * Calculate calories from macros
 *
 * @param {NutritionFacts} macros a set of macros
 * @returns {Calories} calories in a given macro set
 */
export const nutritionToCalories = macros =>
  macroKeys.reduce((acc, key) => acc + macroToCalories(key, macros[key]), 0)

export const emptyTotals = Object.freeze({
  cals: 0,
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  fibre: 0,
  alcohol: 0,
  saturatedFat: 0,
  polyunsaturatedFat: 0,
  monounsaturatedFat: 0,
  transFat: 0,
  cholesterol: 0,
  sodium: 0,
  potassium: 0,
  sugar: 0,
  vitaminA: 0,
  vitaminC: 0,
  calcium: 0,
  iron: 0
})

export const macroKeys = ["fat", "protein", "carbs"]

export const nutritionFactsKeys = Object.keys(emptyTotals)

export const mealTotals = (meals = []) => {
  const entries = [].concat.apply([], meals.filter(m => m.entries).map(m => m.entries))
  const totals = entries.reduce(
    (acc, { cals, macros }) => ({
      cals: acc.cals + numOr(cals),
      protein: acc.protein + numOr(macros.protein),
      fat: acc.fat + numOr(macros.fat),
      carbs: acc.carbs + numOr(macros.carbs)
    }),
    emptyTotals
  )
  return {
    cals: round(totals.cals),
    protein: round(totals.protein),
    fat: round(totals.fat),
    carbs: round(totals.carbs)
  }
}

export const NO_ID = -1

/**
 * SOURCE_UNKNOWN - source is unknown
 * SOURCE_DB_FOOD - record from`keystone.food` table
 * SOURCE_DB_FOOD_OLD - record from`keystone.member_my_food` table
 * SOURCE_DB_CACHE - record from any keystone table where original food item is serialized into`entry` field(recent, favourites)
 * SOURCE_CACHE_MACRO - serialised set of macro values(1st generation of custom food)
 * SOURCE_CACHE_OLD_MY_FOOD - serialised`keystone.member_my_food` item(2nd generation of custom food)
 * SOURCE_CACHE_DB_FOOD - serialised`keystone.food` record(3rd generation of custom food)
 * SOURCE_CACHE_FS - serialised fatsecret item
 * SOURCE_FS_SEARCH - record from FatSecret search query
 * SOURCE_FS_FULL - record from FatSecret single item query
 */
export const SOURCE_UNKNOWN = 0
// export const SOURCE_FS_SEARCH = 1
export const SOURCE_FS_FULL = 2
export const SOURCE_DB_FOOD = 3
export const SOURCE_DB_FOOD_OLD = 4
export const SOURCE_DB_CACHE = 5
export const SOURCE_CACHE_FS = 6
export const SOURCE_CACHE_MACRO = 7
export const SOURCE_CACHE_OLD_MY_FOOD = 8
export const SOURCE_CACHE_DB_FOOD = 9
export const SOURCE_OLD_FAVS = 10
export const SOURCE_RB = 11
export const SOURCE_FAVS = 12
export const SOURCE_KS_SEARCH = 13
export const SOURCE_KS_FOODBANK = 14

export const FOOD = 1
export const MEAL = 2
export const DAY = 3
export const RECIPE = 4

/**
 * Detect a type of passed item
 *
 * @param {Object} item a converted nutrition object
 * @returns {NutritionType} a type of food
 */
export const detectItemType = item => {
  const keys = Object.keys(item)
  if (keys.includes("items")) return MEAL
  if (keys.includes("meals")) return DAY
  return FOOD
}

/**
 * Detect food source basing on a data form
 *
 * @param {Object} food a food object of any origin
 * @returns {FoodSource} a source code or SOURCE_UNKNOWN if impossible to detect
 */
const detectFoodSource = food => {
  const keys = Object.keys(food)
  if (keys.includes("meta"))
    switch (food.meta.source) {
      case "fatsecret":
      case SOURCE_CACHE_FS:
        return SOURCE_CACHE_FS
      case "macro":
        return SOURCE_CACHE_MACRO
      case SOURCE_CACHE_OLD_MY_FOOD:
      case "myfood":
        return SOURCE_CACHE_OLD_MY_FOOD
      case SOURCE_DB_FOOD:
        return SOURCE_CACHE_DB_FOOD
      default:
        return SOURCE_UNKNOWN
    }
  if (keys.includes("source") && food.source === "keystone_es") return SOURCE_KS_SEARCH
  if (keys.includes("nutritionFacts")) return SOURCE_KS_FOODBANK
  if (keys.includes("favId")) return SOURCE_FAVS
  if (keys.includes("index")) return SOURCE_RB
  if (keys.includes("foodItem")) return SOURCE_FS_FULL
  if (keys.includes("macrosEntryId")) return SOURCE_OLD_FAVS
  if (keys.includes("entry")) return SOURCE_DB_CACHE
  if (keys.includes("isMyFood")) return SOURCE_DB_FOOD
  if (keys.includes("calories")) return SOURCE_DB_FOOD_OLD
  return SOURCE_UNKNOWN
}

/**
 * Extract nutrition item ID
 *
 * ID depends on the source of the nutrition object.
 *
 * @param {Object} item a nutrition object of any origin
 * @returns {NutritionIndex} an extracted id or NO_ID if the origin is unknown
 */
export const extractItemId = item => {
  const type = detectItemType(item)
  if (type !== FOOD) return item.id
  const source = detectFoodSource(item)
  switch (source) {
    case SOURCE_DB_FOOD_OLD:
    case SOURCE_DB_FOOD:
    case SOURCE_FAVS:
    case SOURCE_KS_SEARCH:
    case SOURCE_KS_FOODBANK:
    case SOURCE_UNKNOWN:
      return item.id || NO_ID
    case SOURCE_FS_FULL:
      return getOr(NO_ID, "foodItem.id", item)
    case SOURCE_DB_CACHE:
      return extractItemId(JSON.parse(item.entry)) || NO_ID
    case SOURCE_CACHE_FS:
    case SOURCE_CACHE_MACRO:
    case SOURCE_CACHE_OLD_MY_FOOD:
    case SOURCE_CACHE_DB_FOOD:
      return getOr(NO_ID, "meta.id", item)
    case SOURCE_RB:
      return `${getOr("", "label", item)}__${getOr("", "macros.protein", item)}__${getOr(
        "",
        "macros.fat",
        item
      )}__${getOr("", "macros.carbs", item)}`
    default:
      return NO_ID
  }
}

/**
 * Extract food ID for using in FoodList's
 *
 * ID depends on the source of the food object.
 * The result is always a string for guaranteed ho,orogeneity
 *
 * @param {Object} food a food object of any origin
 * @param {number} index used as a fallback for NO_ID values
 * @returns {FoodListIndex} an extracted id or index if the origin is unknown
 */
export const extractFoodListId = (food, index) => {
  const id = extractItemId(food)
  const res = id && id !== NO_ID ? id + " " + index : index
  return `${res}`
}

/**
 * Merge 2 given nutrition facts
 *
 * The result set will consist of summed values for every nutrition fact
 *
 * @param {NutritionFacts} nutritionFact1 Nutrition facts 1
 * @param {NutritionFacts} nutritionFact2 Nutrition facts 2
 * @returns {NutritionFacts} resulting nutrition facts
 */
export const mergeNutritionFacts = (nutritionFact1, nutritionFact2) =>
  nutritionFactsKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: round(numOr(nutritionFact1[key]) + numOr(nutritionFact2[key]))
    }),
    emptyTotals
  )

/**
 * Calculate reference nutrition fact
 *
 * @param {Serving} serving
 * @param {Macro} nutritionFact volume of a nutrition fact in a given serving
 * @return {Macro} volume of a nutrition fact in 100 g of food
 */
export const getRefNutritionFact = (serving, nutritionFact) =>
  nutritionFact === null || nutritionFact === undefined
    ? null
    : round((numOr(nutritionFact) * 100) / (+serving.volume * +serving.num))

/**
 * Calculate reference nutrition facts
 *
 * @param {Serving} serving
 * @param {NutritionFacts} nutritionFacts set of nutrition facts in a given serving
 * @return {NutritionFacts} volume of nutrition facts in 100 g of food
 */
export const getRefNutritionFacts = (serving, nutritionFacts) =>
  nutritionFactsKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: getRefNutritionFact(serving, nutritionFacts[key])
    }),
    emptyTotals
  )

/**
 * Calculate serving nutrition fact
 *
 * @param {Serving} serving
 * @param {Macro} nutritionFact volume of a nutrition fact in 100 g of food
 * @return {Macro} volume of a nutrition fact in a given serving
 */
export const getServingNutritionFact = (serving, nutritionFact) =>
  nutritionFact === null || nutritionFact === undefined
    ? null
    : round((numOr(nutritionFact) * +serving.volume * +serving.num) / 100)

/**
 * Calculate serving nutrition facts
 *
 * @param {Serving} serving
 * @param {NutritionFacts} nutritionFact set of nutrition fact in 100 g of food
 * @return {NutritionFacts} volume of a nutrition fact in a given serving
 */
export const getServingNutritionFacts = (serving, nutritionFact) =>
  nutritionFactsKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: getServingNutritionFact(serving, nutritionFact[key])
    }),
    emptyTotals
  )

export const servingToNutritionFacts = (serving, amount) => ({
  ...nutritionFactsKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: !nullOrUndefined(serving[key]) ? round(serving[key] * amount) : null
    }),
    emptyTotals
  ),
  cals: serving.calories * amount
})

/**
 * Calculate nutrition facts for a meal item
 *
 * @param {MealItem} mealItem
 * @return {NutritionFacts} volume of nutrition facts in a given meal item
 */
export const mealItemNutritionFacts = mealItem =>
  getServingNutritionFacts(mealItem.serving, mealItem.food.macros)

/**
 * Calculate nutrition facts for a meal
 *
 * @param {Meal} meal
 * @return {NutritionFacts} volume of nutrition facts in a given meal
 */
export const mealNutritionFacts = meal =>
  (meal.items || []).reduce(
    (acc, item) => mergeNutritionFacts(acc, mealItemNutritionFacts(item)),
    emptyTotals
  )

/**
 * Calculate nutrition facts for a meal
 *
 * @param {Day} day
 * @return {NutritionFacts} volume of nutrition facts in a given day plan
 */
export const dayNutritionFacts = day =>
  (day.meals || []).reduce(
    (acc, meal) => mergeNutritionFacts(acc, mealNutritionFacts(meal)),
    emptyTotals
  )

const convertNutritionFacts = facts =>
  nutritionFactsKeys.reduce((acc, key) => ({ ...acc, [key]: +facts[key] }), emptyTotals)

export const dataToDay = day => {
  const meals = getOr([], "meals.nodes", day).map(dataToMeal)

  return {
    id: day.id,
    name: day.name,
    macros: day.nutritionFacts
      ? convertNutritionFacts(day.nutritionFacts)
      : dayNutritionFacts({ meals }),
    source: "DAY",
    class: DAY,
    isEmpty: meals.length === 0,
    meals
  }
}

/**
 * Transforms a given object into Meal
 *
 * @param {object} data source of data for meal
 * @return {Meal} transformed object
 */
export const dataToMeal = meal => {
  const items = getOr([], "items.nodes", meal).map(item => ({
    id: item.id,
    food: dataToFood(item.food),
    serving: {
      num: +getOr(1, "serving.num", item),
      name: getOr("serving", "serving.name", item),
      volume: +getOr(100, "serving.volume", item),
      unit: getOr("g", "serving.unit", item)
    }
  }))

  return {
    id: meal.id,
    name: meal.title,
    macros: meal.nutritionFacts
      ? convertNutritionFacts(meal.nutritionFacts)
      : mealNutritionFacts({ items }),
    source: "MEAL",
    class: MEAL,
    isEmpty: items.length === 0,
    items
  }
}

/**
 * Transforms a given object into Recipe
 *
 * @param {object} data source of data for recipe
 * @return {Recipe} transformed object
 */
export const dataToRecipe = recipe => {
  const items = getOr([], "recipe.meal.items.nodes", recipe).map(item => ({
    id: item.id,
    food: dataToFood(item.food),
    serving: {
      num: +getOr(1, "serving.num", item),
      name: getOr("serving", "serving.name", item),
      volume: +getOr(100, "serving.volume", item),
      unit: getOr("g", "serving.unit", item)
    }
  }))

  return {
    id: recipe.id,
    name: getOr("", "recipe.meal.title", recipe),
    macros: getOr(null, "recipe.meal.nutritionFacts", recipe)
      ? convertNutritionFacts(getOr(null, "recipe.meal.nutritionFacts", recipe))
      : mealNutritionFacts({ items }),
    servingsNum: getOr(0, "recipe.servingsNum", recipe),
    totalTime: getOr(0, "recipe.totalTime", recipe),
    prepareTime: getOr(0, "recipe.prepareTime", recipe),
    meta: JSON.parse(getOr("{}", "recipe.meta", recipe)),
    source: "RECIPE",
    class: RECIPE,
    isEmpty: items.length === 0,
    ingredients: items
  }
}

export const dataToRecipeFood = recipe => dataToFood(recipe.food)

/**
 * Transforms a given object into Food
 *
 * @param {object} data source of data for food
 * @return {Food} transformed object
 */
export const dataToFood = food => {
  const source = detectFoodSource(food)
  const object = (transformerMap[source] || transformerMap[SOURCE_UNKNOWN])(food)
  const provides = ["FS", "KS"]
  return {
    origin: food.origin || null,
    hasStar: food.hasStar || false,
    ...object,
    isMyFood: !provides.includes(object.provider),
    isGeneric: !object.brand && Boolean(object.provider),
    class: FOOD
  }
}

const transformKsSearch = food => {
  const serving = {
    num: 1,
    name: food.servingName,
    volume: food.servingVolume || 100,
    unit: "g" // food.servingUnit
  }

  return {
    id: extractItemId(food),
    name: food.name,
    brand: food.brand,
    macros: {
      calories: round(+food.servingCals),
      fat: +food.servingFat,
      carbs: +food.servingCarbs,
      protein: +food.servingProtein
    },
    servings: [serving],
    defaultServingIndex: 0,
    externalId: extractItemId(food),
    provider: "KS",
    type: SOURCE_KS_SEARCH,
    origin: food.origin,
    hasStar: food.hasStar
  }
}

const transformKsFoodbank = food => {
  const servings = [...getOr([], "servings.nodes", food)]

  return {
    id: extractItemId(food),
    name: food.name,
    brand: getOr(null, "brand.name", food),
    macros: {
      ...getOr({}, "nutritionFacts", food)
    },
    servings: servings.map(s => {
      if (s.name === "100 g" || s.num === 1) return s

      return {
        num: 1,
        name: s.num + " " + s.name,
        volume: s.volume,
        unit: s.unit
      }
    }),
    defaultServingIndex: servings.findIndex(s => s.isDefaultServing),
    externalId: extractItemId(food),
    provider: "KS",
    type: SOURCE_KS_FOODBANK,
    origin: getOr(null, "origin.name", food)
  }
}

const transformDbCache = food => dataToFood(JSON.parse(food.entry))

const transformOldFavs = food => {
  return {
    ...dataToFood(JSON.parse(food.entry)),
    favId: food.id
  }
}

const transformFavs = food => {
  return {
    favId: food.id,
    ...dataToFood(food.food)
  }
}

const transformGeneric = food => {
  return {
    id: extractItemId(food),
    name: food.title || food.name || food.label,
    brand: null,
    macros: food.macros || {},
    isEmpty: true,
    servings: [{ num: 1, name: "100g", volume: 100, unit: "g" }],
    defaultServingIndex: 0,
    type: SOURCE_UNKNOWN
  }
}

const transformFsFull = food => {
  const serve = getOr({}, "servings[0]", food)
  const serving = {
    num: +(serve.metric_serving_amount || 1),
    name: serve.description,
    volume: +serve.amount || 100,
    unit: serve.unit || "g"
  }
  return {
    id: extractItemId(food),
    name: food.foodItem.name,
    brand: food.foodItem.brand,
    macros: getRefNutritionFacts(serving, serve),
    servings: (food.servings || []).map(s => ({
      num: +(s.metric_serving_amount || 1),
      name: s.description,
      volume: +s.amount || 100,
      unit: s.unit || "g"
    })),
    defaultServingIndex: 0,
    externalId: extractItemId(food),
    provider: "FS",
    type: SOURCE_FS_FULL
  }
}

const transformDbFood = food => ({
  id: extractItemId(food),
  name: food.title || food.name,
  brand: food.brand,
  macros: getRefNutritionFacts({ num: 1, volume: 100 }, food),
  servings: (food.servings || []).map(s => ({
    num: +s.num,
    name: s.name,
    volume: +s.volume,
    unit: s.unit
  })),
  defaultServingIndex: food.defaultServingIndex,
  externalId: food.externalId,
  provider: food.provider,
  type: SOURCE_DB_FOOD,
  origin: food.origin
})

const transformCachedFs = food => {
  const serving = {
    num: +food.servingAmount,
    name: food.servingUnit,
    volume: +food.unitAmount || +food.amount || 100,
    unit: food.unit
  }
  return {
    id: extractItemId(food),
    name: food.label,
    brand: getOr("", "meta.brand", food),
    macros: {
      ...getRefNutritionFacts(serving, food.macros || {}),
      calories: getRefNutritionFact(
        serving,
        getOr(getOr(0, "macros.calories", food), "macros.cals", food)
      )
    },
    servings: (food.servings || []).map(s => ({
      num: +(s.metric_serving_amount || 1),
      name: s.description,
      volume: +s.amount,
      unit: s.unit
    })),
    defaultServingIndex: 0,
    externalId: extractItemId(food),
    provider: "FS",
    type: SOURCE_CACHE_FS
  }
}

const transformCachedMacro = food => {
  const serving = {
    num: 1,
    name: "1 serving",
    volume: 100,
    unit: "g"
  }

  return {
    id: NO_ID,
    name: food.label,
    brand: null,
    macros: {
      ...getRefNutritionFacts(serving, food.macros || {}),
      calories: getRefNutritionFact(serving, food.cals)
    },
    servings: [serving],
    defaultServingIndex: 0,
    externalId: null,
    provider: null,
    type: SOURCE_CACHE_MACRO
  }
}

const transformCacheFood = food => {
  const serving = {
    num: +food.servingAmount || 1,
    name: food.servingUnit,
    volume: +food.amount || 100,
    unit: food.measure
  }
  return {
    id: extractItemId(food),
    name: food.label,
    brand: getOr("", "meta.brand", food),
    macros: getRefNutritionFacts(serving, food.macros || {}),
    servings: (food.servings || []).map(s => ({
      num: +(s.serving_amount || 1),
      name: s.description,
      volume: +s.amount,
      unit: s.unit
    })),
    defaultServingIndex: 0,
    externalId: null,
    provider: null,
    type: SOURCE_CACHE_DB_FOOD,
    origin: food.origin
  }
}

const transformCacheOldFood = food => {
  const serving = {
    num: 1,
    name: food.servingUnit,
    volume: 100,
    unit: food.measure
  }
  return {
    id: extractItemId(food),
    name: food.label,
    brand: getOr("", "meta.brand", food),
    macros: {
      ...getRefNutritionFacts(serving, food.macros || {}),
      calories: getRefNutritionFact(serving, food.cals)
    },
    servings: (food.servings || []).map(s => ({
      num: +(s.serving_amount || 1),
      name: s.description,
      volume: +s.amount,
      unit: s.unit
    })),
    defaultServingIndex: 0,
    externalId: extractItemId(food),
    provider: "old_my_food",
    type: SOURCE_CACHE_OLD_MY_FOOD
  }
}

const transformRbFood = food => {
  const serving = {
    num: 1,
    name: "100 g",
    volume: 100,
    unit: "g"
  }
  return {
    id: extractItemId(food),
    name: food.label,
    brand: "",
    macros: {
      ...getRefNutritionFacts(serving, food.macros || {}),
      calories: nutritionToCalories(food.macros || {})
    },
    servings: [serving],
    defaultServingIndex: 0,
    externalId: extractItemId(food),
    provider: "macro",
    type: SOURCE_RB
  }
}

const transformerMap = {
  [SOURCE_UNKNOWN]: transformGeneric,
  [SOURCE_FS_FULL]: transformFsFull,
  [SOURCE_DB_FOOD]: transformDbFood,
  // [SOURCE_DB_FOOD_OLD]: "", the table is not fetched directly
  [SOURCE_DB_CACHE]: transformDbCache,
  [SOURCE_CACHE_FS]: transformCachedFs,
  [SOURCE_CACHE_MACRO]: transformCachedMacro,
  [SOURCE_CACHE_OLD_MY_FOOD]: transformCacheOldFood,
  [SOURCE_CACHE_DB_FOOD]: transformCacheFood,
  [SOURCE_OLD_FAVS]: transformOldFavs,
  [SOURCE_RB]: transformRbFood,
  [SOURCE_FAVS]: transformFavs,
  [SOURCE_KS_SEARCH]: transformKsSearch,
  [SOURCE_KS_FOODBANK]: transformKsFoodbank
}
