import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { genMutationId, readQuerySafe, gqlDate, today } from "keystone"
import { WORKOUT_SESSION_BY_ID } from "graphql/query/workout/sessionById"

import { WEEKLY_TRAINING_STATS } from "graphql/query/training/weeklyStats"

const SAVE_WORKOUT_SESSION = gql`
  mutation SaveWorkoutSession($input: SaveWorkoutSessionInput!) {
    saveWorkoutSession(input: $input) {
      clientMutationId
      workoutSession: workout {
        id
        date
        isCompleted
      }
    }
  }
`

const mkSaveWorkoutSessionInput = values => {
  const { workoutSessionId, workoutTemplateId, date, model, meta } = values
  const workout = {
    id: workoutSessionId,
    workoutTemplateId,
    date: gqlDate(date),
    body: JSON.stringify({ model, meta })
  }
  const clientMutationId = genMutationId()
  return {
    workout,
    clientMutationId
  }
}

export const saveWorkoutSession = ({ mutate }) => values => {
  const input = mkSaveWorkoutSessionInput(values)
  const refetchQueries = [
    { query: WEEKLY_TRAINING_STATS, variables: { date: gqlDate(today()) } }
  ]
  return mutate({
    variables: { input, __offline__: true },
    refetchQueries
  })
}

const withSaveWorkout = graphql(SAVE_WORKOUT_SESSION, {
  props: ({ mutate }) => ({
    saveWorkoutSession: saveWorkoutSession({ mutate })
  })
})

export const saveWorkoutSessionMutation = client => values => {
  const input = mkSaveWorkoutSessionInput(values)
  const refetchQueries = [
    { query: WEEKLY_TRAINING_STATS, variables: { date: gqlDate(today()) } }
  ]
  return client.mutate({
    mutation: SAVE_WORKOUT_SESSION,
    variables: { input, __offline__: true },
    refetchQueries,
    update: store => {
      const result = readQuerySafe(store, {
        query: WORKOUT_SESSION_BY_ID,
        variables: { id: input.workout.id }
      })
      const { data } = result

      if (data) {
        data.workoutSessionById.body = input.workout.body
        store.writeQuery({ query: WORKOUT_SESSION_BY_ID, data })
      }
    }
  })
}

export default withSaveWorkout
