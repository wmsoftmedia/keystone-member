import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { gqlDate, genMutationId } from "keystone"
import { MEMBER_STEPS } from "graphql/query/steps/byDate"
import { WEEKLY_TRAINING_STATS } from "graphql/query/training/weeklyStats"

export const UPDATE_STEPS = gql`
  mutation UpdateSteps($input: UpdateStepsInput!) {
    updateSteps(input: $input) {
      clientMutationId
      steps {
        totalCount
        nodes {
          date
          key
          value
        }
      }
    }
  }
`

export default graphql(UPDATE_STEPS, {
  props: ({ mutate, ownProps: { date } }) => ({
    updateSteps: steps => {
      const clientMutationId = genMutationId()
      return mutate({
        variables: {
          input: {
            clientMutationId,
            steps: steps.map(s => ({ ...s, date: gqlDate(s.date) }))
          },
          __offline__: true
        },
        refetchQueries: [
          {
            query: MEMBER_STEPS,
            variables: { __offline__: true, date: gqlDate(date) }
          },
          {
            query: WEEKLY_TRAINING_STATS,
            variables: { __offline__: true, date: gqlDate(moment()) }
          }
        ]
      })
    }
  })
})
