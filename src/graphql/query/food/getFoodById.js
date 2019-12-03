import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import foodFragments from "graphql/fragment/food/food"

export const GET_FOOD_QUERY = gql`
  query FoodById($id: Uuid!) {
    foodById(id: $id) {
      ...FoodFull
    }
  }
  ${foodFragments.fullFood}
`

export default graphql(GET_FOOD_QUERY, {
  options: ({ foodId }) => ({
    fetchPolicy: "network-only",
    variables: { id: foodId }
  })
})
