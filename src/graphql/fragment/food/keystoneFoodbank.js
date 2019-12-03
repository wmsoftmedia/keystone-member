import gql from "graphql-tag"

export const keystoneFoodbankFragments = {
  foodItem: gql`
    fragment FoodItem on KeystoneFoodItem {
      id
      brand
      name
      origin
      hasStar
      servingName
      servingVolume
      servingMult
      servingUnit
      refCals
      refProtein
      refFat
      refCarbs
    }
  `,
  serving: gql`
    fragment Serving on Serving {
      num
      name
      volume
      unit
      isDefaultServing
      multiplier
    }
  `,
  nutritionFacts: gql`
    fragment NutritionFacts on FoodbankNutritionFact {
      calories: p1
      protein: p2
      fat: p3
      carbs: p4
      fibre: p5
      alcohol: p6
      saturatedFat: p7
      polyunsaturatedFat: p8
      monounsaturatedFat: p9
      transFat: p10
      cholesterol: p11
      sodium: p12
      potassium: p13
      sugar: p14
      vitaminA: p15
      vitaminC: p16
      calcium: p17
      iron: p18
      water: p19
      ash: p20
    }
  `,
  keystoneFoodNutritionFacts: gql`
    fragment KsNutritionFacts on KeystoneNutritionFact {
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
      water
      ash
    }
  `,
  keystoneServing: gql`
    fragment KsServing on KeystoneServing {
      num
      name
      volume
      unit
      isDefaultServing
      multiplier
    }
  `
}
