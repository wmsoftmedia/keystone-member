import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

export const ALL_MEALS_QUERY = gql`
  query allMyMeals($limit: Int, $offset: Int) {
    allMemberMeals(first: $limit, offset: $offset) {
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

export const ALL_MEALS_MIN_QUERY = gql`
  query allMyMeals {
    allMemberMeals {
      nodes {
        id
        title
        memberId
      }
    }
  }
`

export const AllMealsMin = graphql(ALL_MEALS_MIN_QUERY, {
  fetchPolicy: "network-only",
  variables: { __offline__: true }
})

export default graphql(ALL_MEALS_QUERY, {
  options: ({ limit, offset }) => ({
    fetchPolicy: "network-only",
    variables: { __offline__: true, limit, offset }
  })
})
