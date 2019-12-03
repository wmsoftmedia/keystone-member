import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { keystoneFoodbankFragments } from "graphql/fragment/food/keystoneFoodbank"
import { trim, getOr } from "keystone"
import { compose, withProps } from "recompose"
import { transformKsSearch } from "keystone/food_new"

export const FOOD_SEARCH = gql`
  query SearchKSFood($term: String!, $meta: KeystoneSearchInput) {
    currentMember {
      id
      keystoneFoodSearch(term: $term, meta: $meta) {
        totalCount
        page
        count
        nodes {
          ...FoodItem
        }
      }
    }
  }
  ${keystoneFoodbankFragments.foodItem}
`

const query = graphql(FOOD_SEARCH, {
  skip: ({ term }) => trim(term) === "",
  options: ({ term, meta }) => ({
    fetchPolicy: "network-only",
    variables: {
      __offline__: true,
      term,
      meta: { ...meta, region: moment.tz.guess() }
    }
  })
})

export const searchFoodTransformed = compose(
  query,
  withProps(props => ({
    searchFoodItems: getOr([], "data.currentMember.keystoneFoodSearch.nodes", props)
      .map(f => ({ ...f, source: "keystone_es" }))
      .map(transformKsSearch)
  }))
)

export default query
