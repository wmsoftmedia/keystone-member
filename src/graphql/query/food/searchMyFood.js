import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { compose, defaultProps } from "recompose"
import _ from "lodash/fp"

export const MY_FOOD_SEARCH = gql`
  query searchMyFood(
    $term: String!
    $withCommonFood: Boolean
    $pageSize: Int
    $offset: Int
  ) {
    searchMyFood(
      search: $term
      includeCommon: $withCommonFood
      first: $pageSize
      offset: $offset
    ) {
      totalCount
      nodes {
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
`

const DEFAULT_VALUES = {
  term: "",
  withCommonFood: true,
  pageSize: null,
  offset: null
}

export default compose(
  defaultProps(DEFAULT_VALUES),
  graphql(MY_FOOD_SEARCH, {
    options: props => ({
      fetchPolicy: "network-only",
      variables: {
        __offline__: true,
        ..._.pick(Object.keys(DEFAULT_VALUES), props)
      }
    })
  })
)
