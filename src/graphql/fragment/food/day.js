import gql from "graphql-tag"
import mealFragments from "graphql/fragment/food/meal"

export default {
  fullDay: gql`
    fragment DayFull on NutritionDay {
      id
      name
      notes
      nutritionFacts {
        calories
        protein
        fat
        carbs
        fibre
        alcohol
      }
      meals {
        nodes {
          ...MealFull
        }
      }
    }
    ${mealFragments.fullMeal}
  `,
  minDay: gql`
    fragment DayMin on NutritionDay {
      id
      name
      notes
      nutritionFacts {
        calories
        protein
        fat
        carbs
        fibre
        alcohol
      }
    }
  `
}
