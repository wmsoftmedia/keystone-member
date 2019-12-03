import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { genMutationId, readQuerySafe } from "keystone"
import { ALL_MEMBER_WORKOUT_TEMPLATES } from "graphql/query/workout/memberWorkouts"

const SAVE_MEMBER_WORKOUT_TEMPLATE = gql`
  mutation SaveMemberWorkoutTemplate($input: SaveMemberWorkoutTemplateInput!) {
    saveMemberWorkoutTemplate(input: $input) {
      clientMutationId
      workoutTemplate {
        id
      }
    }
  }
`

export const saveMemberWorkoutTemplate = client => workoutTemplate => {
  const input = {
    clientMutationId: genMutationId(),
    workoutTemplate
  }

  const refetchQueries = [{ query: ALL_MEMBER_WORKOUT_TEMPLATES }]

  return client.mutate({
    mutation: SAVE_MEMBER_WORKOUT_TEMPLATE,
    variables: { input, __offline__: true },
    refetchQueries
    // update: store => {
    //     const result = readQuerySafe(store, {
    //       query: WORKOUT_SESSION_BY_ID,
    //       variables: { id: input.workoutTemplate.id }
    //     })
    //     const { data } = result
    //     if (data) {
    //       data.workoutSessionById.body = input.workout.body
    //       store.writeQuery({ query: WORKOUT_SESSION_BY_ID, data })
    //     }
    // }
  })
}
