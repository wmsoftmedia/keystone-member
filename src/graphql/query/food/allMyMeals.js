import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import mealFragments from "graphql/fragment/food/meal"
import { compose, withProps } from "recompose"
import { getOr } from "keystone"
import { dataToMeal } from "keystone/food"

export const ALL_MY_MEALS_QUERY = gql`
  query AllMyMeals {
    currentMember {
      id
      allMyMeals {
        nodes {
          ...MealFull
        }
      }
    }
  }
  ${mealFragments.fullMeal}
`

export const ALL_MY_MEALS_MIN_QUERY = gql`
  query allMyMeals {
    currentMember {
      id
      allMyMeals {
        nodes {
          ...MealMin
        }
      }
    }
  }
  ${mealFragments.minMeal}
`

const transformedQuery = query =>
  compose(
    query,
    withProps(props => ({
      allMyMeals: getOr(
        [],
        "AllMyMeals.currentMember.allMyMeals.nodes",
        props
      ).map(dataToMeal)
    }))
  )

const AllMyMealsMinQuery = graphql(ALL_MY_MEALS_MIN_QUERY, {
  name: "AllMyMeals",
  fetchPolicy: "network-only",
  variables: { __offline__: true }
})

const AllMyMealsQuery = graphql(ALL_MY_MEALS_QUERY, {
  name: "AllMyMeals",
  fetchPolicy: "network-only",
  variables: { __offline__: true }
})

export const AllMyMinMealsTransformed = transformedQuery(AllMyMealsMinQuery)
export const AllMyMealsTransformed = transformedQuery(AllMyMealsQuery)

export default AllMyMealsQuery
