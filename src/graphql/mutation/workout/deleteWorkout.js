import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { WORKOUT_SESSIONS_BY_MONTH } from "graphql/query/workout/workoutSessions"
import { genMutationId, gqlDate, readQuerySafe } from "keystone"
import _ from "lodash/fp"

const DELETE_WORKOUT_SESSIONS = gql`
  mutation DeleteWorkoutSession($input: DeleteWorkoutSessionInput!) {
    deleteWorkoutSession(input: $input) {
      clientMutationId
    }
  }
`

const deleteWorkoutSession = (store, id, date) => {
  // WARNING!!! This assumes that the date for fetching workouts by month
  // is the first date of the month. This query has to be in sync with
  // WORKOUT_SESSIONS_BY_MONTH query
  const cachedDate = gqlDate(moment(date).startOf("month"))
  const result = readQuerySafe(store, {
    query: WORKOUT_SESSIONS_BY_MONTH,
    variables: { date: cachedDate }
  })
  if (!result.error) {
    const { data } = result
    const nodes = _.getOr([], "currentMember.workoutSessionsByMonth.nodes", data)
    if (nodes.length) {
      data.currentMember.workoutSessionsByMonth.nodes = nodes.filter(s => s.id !== id)
      store.writeQuery({
        query: WORKOUT_SESSIONS_BY_MONTH,
        variables: { date: cachedDate },
        data
      })
    }
  }
}

export default graphql(DELETE_WORKOUT_SESSIONS, {
  props: ({ mutate }) => ({
    deleteWorkoutSession: (workoutId, date) => {
      const clientMutationId = genMutationId()
      mutate({
        variables: {
          input: { clientMutationId, workoutId },
          __offline__: true
        },
        optimisticResponse: {
          deleteWorkoutSession: {
            clientMutationId,
            __typename: "DeleteWorkoutSessionPayload"
          }
        },
        update: store => deleteWorkoutSession(store, workoutId, date)
      })
    }
  })
})
