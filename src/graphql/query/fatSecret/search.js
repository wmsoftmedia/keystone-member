import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { fatSecretFragments } from "graphql/fragment/food/fatSecret"
import { trim, getOr } from "keystone"
import { compose, withProps } from "recompose"
import { dataToFood } from "keystone/food"

export const FOOD_SEARCH = gql`
  query SearchFood($term: String!, $meta: SearchInput) {
    currentMember {
      id
      searchFood(term: $term, meta: $meta) {
        totalCount
        page
        count
        nodes {
          ...FsFoodItem
        }
      }
    }
  }
  ${fatSecretFragments.foodItem}
`

const query = graphql(FOOD_SEARCH, {
  skip: ({ term }) => trim(term) === "",
  options: ({ term, meta }) => ({
    fetchPolicy: "network-only",
    variables: { __offline__: true, term, meta }
  })
})

export const searchFoodTransformed = compose(
  query,
  withProps(props => ({
    searchFoodItems: getOr(
      [],
      "data.currentMember.searchFood.nodes",
      props
    ).map(dataToFood)
  }))
)

export default query
