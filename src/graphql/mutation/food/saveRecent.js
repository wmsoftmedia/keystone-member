import gql from "graphql-tag"
import { ALL_RECENT_FOOD } from "graphql/query/food/allRecent"

export const SAVE_RECENT_FOOD = gql`
  mutation SaveRecentFood($foodIds: [Uuid]!) {
    saveRecentFoodItems(input: { foodIds: $foodIds }) {
      clientMutationId
    }
  }
`

export const saveRecentFood = foodIds => ({
  mutation: SAVE_RECENT_FOOD,
  variables: { foodIds },
  refetchQueries: [
    {
      query: ALL_RECENT_FOOD
    }
  ]
})
