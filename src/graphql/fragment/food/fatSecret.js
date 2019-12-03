import gql from "graphql-tag"

export const fatSecretFragments = {
  foodItem: gql`
    fragment FsFoodItem on FatSecretFoodItem {
      id: foodId
      type
      brand
      name
      description
    }
  `,
  serving: gql`
    fragment FsServing on FatSecretServing {
      id
      description
      amount
      unit
      numberOfUnits
      measurementDescription
      calories
      protein
      fat
      carbs: carbohydrate
      saturatedFat
      polyunsaturatedFat
      monounsaturatedFat
      transFat
      cholesterol
      sodium
      potassium
      fibre: fiber
      sugar
      vitaminA
      vitaminC
      calcium
      iron
    }
  `
}
