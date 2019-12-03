import gql from "graphql-tag"
import mealFragments from "graphql/fragment/food/meal"

export default {
  fullRecipe: gql`
    fragment RecipeFull on MemberRecipe {
      id
      meal: memberMealByMealId {
        ...MealFull
      }
      notes
      servingsNum
      meta
      totalTime
      prepareTime
    }
    ${mealFragments.fullMeal}
  `,
  minRecipe: gql`
    fragment RecipeMin on MemberRecipe {
      id
      servingsNum
      meal: memberMealByMealId {
        ...MealMin
      }
    }
    ${mealFragments.minMeal}
  `
}
