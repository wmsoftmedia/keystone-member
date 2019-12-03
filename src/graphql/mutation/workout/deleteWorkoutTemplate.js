import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import _ from "lodash/fp"

import { ALL_MEMBER_WORKOUT_TEMPLATES } from "graphql/query/workout/memberWorkouts"
import { genMutationId, readQuerySafe } from "keystone"

const DELETE_WORKOUT_TEMPLATE = gql`
  mutation DeleteWorkoutTemplate($input: DeleteWorkoutTemplateInput!) {
    deleteWorkoutTemplate(input: $input) {
      clientMutationId
    }
  }
`

const deleteWorkoutTemplate = (store, id) => {
  const result = readQuerySafe(store, { query: ALL_MEMBER_WORKOUT_TEMPLATES })
  if (!result.error) {
    const { data } = result
    const nodes = _.getOr([], "allWorkoutTemplates.nodes", data)
    if (nodes.length) {
      data.allWorkoutTemplates.nodes = nodes.filter(n => n.id !== id)
      store.writeQuery({
        query: ALL_MEMBER_WORKOUT_TEMPLATES,
        data
      })
    }
  }
}

export default graphql(DELETE_WORKOUT_TEMPLATE, {
  props: ({ mutate }) => ({
    deleteWorkoutTemplate: workoutTemplateId => {
      const clientMutationId = genMutationId()
      mutate({
        variables: {
          input: { clientMutationId, workoutTemplateId },
          __offline__: true
        },
        optimisticResponse: {
          deleteWorkoutTemplate: {
            clientMutationId,
            __typename: "DeleteWorkoutSessionPayload"
          }
        },
        update: store => deleteWorkoutTemplate(store, workoutTemplateId)
      })
    }
  })
})
