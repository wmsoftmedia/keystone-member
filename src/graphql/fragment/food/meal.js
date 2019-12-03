import gql from "graphql-tag"
import foodFragments from "graphql/fragment/food/food"
import servingFragment from "graphql/fragment/food/serving"

export default {
  fullMeal: gql`
    fragment MealFull on MemberMeal {
      id
      title
      items: mealItemsByMealId {
        nodes {
          id
          serving {
            ...ServingFull
          }
          food: foodByFoodId {
            ...FoodFull
          }
          orderIndex
        }
      }
      nutritionFacts {
        calories
        protein
        fat
        carbs
        fibre
        alcohol
      }
    }
    ${foodFragments.fullFood}
    ${servingFragment}
  `,
  minMeal: gql`
    fragment MealMin on MemberMeal {
      id
      title
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
