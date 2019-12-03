import gql from "graphql-tag";
import servingFragment from "graphql/fragment/food/serving";

export default {
  fullFood: gql`
    fragment FoodFull on Food {
      id
      title
      brand
      calories
      protein
      fat
      carbs
      fibre
      alcohol
      saturatedFat
      polyunsaturatedFat
      monounsaturatedFat
      transFat
      cholesterol
      sodium
      potassium
      sugar
      vitaminA
      vitaminC
      calcium
      iron
      servings {
        ...ServingFull
      }
      defaultServingIndex
      provider
      externalId
      isMyFood
      origin
    }
    ${servingFragment}
  `,
  minFood: gql`
    fragment FoodMin on Food {
      id
      title
      brand
      calories
      protein
      fat
      carbs
      fibre
      alcohol
      saturatedFat
      polyunsaturatedFat
      monounsaturatedFat
      transFat
      cholesterol
      sodium
      potassium
      sugar
      vitaminA
      vitaminC
      calcium
      iron
      isMyFood
      origin
    }
  `,
};
