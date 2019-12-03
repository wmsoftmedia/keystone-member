import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { readQuerySafe, getOr, genMutationId } from "keystone"
import {
  ALL_MY_DAYS_QUERY,
  ALL_MY_DAYS_MIN_QUERY
} from "graphql/query/food/allMyDays"

const DELETE_DAY = gql`
  mutation DeleteNutritionDay($input: DeleteFullNutritionDayInput!) {
    deleteFullNutritionDay(input: $input) {
      clientMutationId
    }
  }
`
const deleteDay = (store, id) => {
  [ALL_MY_DAYS_QUERY, ALL_MY_DAYS_MIN_QUERY].forEach(query => {
    const cachedQuery = { query }
    const { error, data } = readQuerySafe(store, cachedQuery)
    if (error) return

    const curDays = getOr(
      [],
      "currentMember.nutritionDaysByMemberId.nodes",
      data
    )
    data.currentMember.nutritionDaysByMemberId.nodes = curDays.filter(
      day => day.id !== id
    )
    store.writeQuery({ query, data })
  })
}

export default graphql(DELETE_DAY, {
  props: ({ mutate }) => ({
    deleteDay: id => {
      const mutationId = genMutationId()

      return mutate({
        variables: {
          input: { day: id },
          clientMutationId: mutationId,
          __offline__: true
        },
        optimisticResponse: {
          deleteFullNutritionDay: {
            clientMutationId: mutationId,
            __typename: "DeleteFullNutritionDayPayload"
          }
        },
        update: store => deleteDay(store, id)
      })
    }
  })
})
