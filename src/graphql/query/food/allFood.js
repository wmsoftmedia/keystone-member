import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import foodFragments from "graphql/fragment/food/food"

export const ALL_FOOD_QUERY = gql`
  query AllFoods {
    allFoods(orderBy: UPDATED_AT_DESC) {
      nodes {
        ...FoodFull
      }
    }
  }
  ${foodFragments.fullFood}
`

export const ALL_FOOD_MIN_QUERY = gql`
  query AllFoods {
    allFoods {
      nodes {
        ...FoodMin
      }
    }
  }
  ${foodFragments.minFood}
`

export const AllFoodMin = graphql(ALL_FOOD_MIN_QUERY, {
  fetchPolicy: "network-only",
  variables: { __offline__: true }
})

export default graphql(ALL_FOOD_QUERY, {
  fetchPolicy: "network-only",
  variables: { __offline__: true }
})
