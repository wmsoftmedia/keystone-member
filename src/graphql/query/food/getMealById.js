import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import mealFragments from "graphql/fragment/food/meal"
import { compose, withProps } from "recompose"
import { getOr } from "keystone"
import { dataToMeal } from "keystone/food"

export const GET_MEAL_QUERY = gql`
  query GetMealById($id: Uuid!) {
    memberMealById(id: $id) {
      ...MealFull
    }
  }
  ${mealFragments.fullMeal}
`

const query = graphql(GET_MEAL_QUERY, {
  options: ({ mealId }) => ({
    fetchPolicy: "network-only",
    variables: { id: mealId }
  })
})

export const GetMealByIdTransformed = compose(
  query,
  withProps(props => ({
    meal: dataToMeal(getOr({}, "data.memberMealById", props))
  }))
)
export default graphql(GET_MEAL_QUERY, {
  options: ({ mealId }) => ({
    fetchPolicy: "network-only",
    variables: { id: mealId }
  })
})
