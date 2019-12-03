import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { readQuerySafe, getOr, genMutationId } from "keystone"
import {
  ALL_MY_MEALS_QUERY,
  ALL_MY_MEALS_MIN_QUERY
} from "graphql/query/food/allMyMeals"

export const DELETE_MEAL = gql`
  mutation DeleteMyMeal($input: DeleteMemberMealByIdInput!) {
    deleteMemberMealById(input: $input) {
      clientMutationId
    }
  }
`
const deleteMeal = (store, id) => {
  [ALL_MY_MEALS_QUERY, ALL_MY_MEALS_MIN_QUERY].forEach(query => {
    const cachedQuery = { query }
    const { error, data } = readQuerySafe(store, cachedQuery)
    if (error) return

    const oldMeals = getOr([], "currentMember.allMyMeals.nodes", data)
    data.currentMember.allMyMeals.nodes = oldMeals.filter(
      meal => meal.id !== id
    )
    store.writeQuery({ query, data })
  })
}

export default graphql(DELETE_MEAL, {
  props: ({ mutate }) => ({
    deleteMeal: id => {
      const mutationId = genMutationId()

      return mutate({
        variables: {
          input: { id },
          clientMutationId: mutationId,
          __offline__: true
        },
        optimisticResponse: {
          deleteMemberMealById: {
            clientMutationId: mutationId,
            __typename: "DeleteMemberMealPayload"
          }
        },
        update: store => deleteMeal(store, id)
      })
    }
  })
})
