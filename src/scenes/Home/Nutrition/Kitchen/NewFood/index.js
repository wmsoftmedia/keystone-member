// packages
import { compose, withHandlers, branch, withProps } from "recompose"

import { getOr, getNavigationParam } from "keystone"
import { getRefNutritionFacts, nutritionToCalories } from "keystone/food"
import { withDelayedMemberId } from "hoc/withMemberId"
import { withLoader } from "hoc"
import Form from "scenes/Home/Nutrition/Kitchen/NewFood/Form"
import colors from "kui/colors"
import createFood from "graphql/mutation/food/createFood"
import getFoodQuery from "graphql/query/food/getFoodById"
import updateFood from "graphql/mutation/food/updateFood"

const withMutations = compose(
  createFood,
  updateFood
)

const withDataLoad = compose(
  getFoodQuery,
  withLoader({
    backgroundColor: colors.transparent,
    color: colors.white,
    textColor: colors.white,
    indicatorSize: "small"
  }),
  withProps(props => ({
    food: getOr({}, "data.foodById", props)
  }))
)

const enhance = compose(
  withMutations,
  withProps(props => ({
    foodId: getNavigationParam(props.navigation, "foodId")
  })),
  branch(props => props.foodId, withDataLoad),
  withDelayedMemberId,
  withHandlers({
    onSubmit: props => data => {
      const refServing = {
        num: 1,
        name: `${data.servingSize}${data.servingUnit}`,
        volume: +data.servingSize,
        unit: data.servingUnit
      }

      const servings = [
        refServing,
        ...data.customServings,
        ...(refServing.volume === 100
          ? []
          : [
              {
                num: 1,
                name: `100${data.servingUnit}`,
                volume: 100,
                unit: data.servingUnit
              }
            ]),
        ...(refServing.volume === 1
          ? []
          : [
              {
                num: 1,
                name: `1${data.servingUnit}`,
                volume: 1,
                unit: data.servingUnit
              }
            ])
      ]

      const macros = getRefNutritionFacts(refServing, data)
      const foodData = {
        title: data.title,
        brand: data.brand || null,
        memberId: props.memberId,
        calories: macros.calories || nutritionToCalories(macros) || null,
        protein: macros.protein || null,
        fat: macros.fat || null,
        carbs: macros.carbs || null,
        fibre: macros.fibre || null,
        alcohol: macros.alcohol || null,
        saturatedFat: null,
        polyunsaturatedFat: null,
        monounsaturatedFat: null,
        transFat: null,
        cholesterol: null,
        sodium: null,
        potassium: null,
        sugar: null,
        vitaminA: null,
        vitaminC: null,
        calcium: null,
        iron: null,
        servings,
        defaultServingIndex:
          data.defaultServing === "serving size"
            ? 0
            : servings.findIndex(s => s.name === data.defaultServing) || 0
      }

      const input = props.food
        ? { id: props.food.id, foodPatch: foodData }
        : { food: foodData }
      const mutate = props.food ? props.updateFood : props.createFood

      mutate(input)
      props.navigation.goBack(null)
    }
  })
)

export default enhance(Form)
