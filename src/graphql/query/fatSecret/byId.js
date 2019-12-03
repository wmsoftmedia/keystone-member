import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { fatSecretFragments } from "graphql/fragment/food/fatSecret"

export const FOOD_ITEM_BY_ID = gql`
  query foodItemById($id: String!) {
    currentMember {
      id
      foodItemById(id: $id) {
        foodItem {
          id: foodId
          type
          brand
          name
        }
        servings {
          ...FsServing
        }
      }
    }
  }
  ${fatSecretFragments.serving}
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
