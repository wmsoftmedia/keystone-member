import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { keystoneFoodbankFragments } from "graphql/fragment/food/keystoneFoodbank"

export const FOOD_ITEM_BY_ID = gql`
  query KSFoodItemById($id: Uuid!) {
    foodbankFoodById(id: $id) {
      id
      name
      brand: brandByBrand {
        id
        name
      }
      origin: dataSourceBySource {
        id
        name
      }
      nutritionFacts: foodbankNutritionFactByFoodId {
        ...NutritionFacts
      }
      servings: servingsByFoodId {
        nodes {
          ...Serving
        }
      }
    }
  }
  ${keystoneFoodbankFragments.nutritionFacts}
  ${keystoneFoodbankFragments.serving}
`

export const foodByIdQuery = id => ({
  query: FOOD_ITEM_BY_ID,
  fetchPolicy: "cache-first",
  variables: { id }
})

export default graphql(FOOD_ITEM_BY_ID, {
  options: props => ({
    fetchPolicy: "cache-first",
    variables: { id: props.id },
    notifyOnNetworkStatusChange: true
  })
})
