import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { defaultProps, compose } from "recompose"
import _ from "lodash/fp"

export const MY_MEAL_SEARCH = gql`
  query SearchMyMeals(
    $term: String!
    $withCommonMeals: Boolean
    $pageSize: Int
    $offset: Int
  ) {
    searchMyMeals(
      search: $term
      includeCommon: $withCommonMeals
      first: $pageSize
      offset: $offset
    ) {
      totalCount
      nodes {
        id
        title
        items: mealItemsByMealId {
          nodes {
            serving {
              num
              name
              volume
              unit
            }
            food: foodByFoodId {
              id
              title
              brand
              calories
              protein
              fat
              carbs
              fibre
              alcohol
              servings {
                num
                name
                volume
                unit
              }
              provider
              externalId
            }
          }
        }
      }
    }
  }
`

const DEFAULT_VALUES = {
  term: "",
  withCommonMeals: true,
  pageSize: null,
  offset: null
}

export default compose(
  defaultProps(DEFAULT_VALUES),
  graphql(MY_MEAL_SEARCH, {
    options: props => ({
      fetchPolicy: "network-only",
      variables: {
        ..._.pick(Object.keys(DEFAULT_VALUES), props)
      }
    })
  })
)
