import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import mealFragments from "graphql/fragment/food/meal"
import { compose, withProps } from "recompose"
import { getOr } from "keystone"
import { dataToMeal } from "keystone/food"

const GET_MEALS_QUERY = gql`
  query GetMealsByIds($ids: [Uuid]!) {
    memberMealsByIds(ids: $ids) {
      nodes {
        ...MealFull
      }
    }
  }
  ${mealFragments.fullMeal}
`

export const getMealsByIds = ids => ({
  query: GET_MEALS_QUERY,
  fetchPolicy: "cache-first",
  variables: { ids }
})

const query = graphql(GET_MEALS_QUERY, {
  options: ({ mealIds }) => ({
    fetchPolicy: "network-only",
    variables: { ids: mealIds }
  })
})

export const GetMealByIdTransformed = compose(
  query,
  withProps(props => ({
    meals: getOr([], "data.memberMealsByIds", props).map(dataToMeal)
  }))
)
export default query
