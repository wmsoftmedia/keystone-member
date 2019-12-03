import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { MEMBER_STEPS } from "graphql/query/steps/byDate"
import { MEMBER_STEPS as LATEST_TREND } from "graphql/query/steps/latestTrend"
import { WEEKLY_TRAINING_STATS } from "graphql/query/training/weeklyStats"
import { gqlDate, genMutationId } from "keystone"

export const UPSERT_STEPS = gql`
  mutation UpsertMemberMetricV2($input: UpsertMemberMetricV2Input!) {
    upsertMemberMetricV2(input: $input) {
      clientMutationId
      memberMetric {
        id
        memberId
        date
        key
        value
        notes
      }
    }
  }
`

export default graphql(UPSERT_STEPS, {
  props: ({ mutate, ownProps: { memberId, date } }) => ({
    upsertSteps: (steps, interval) => {
      const payload = {
        key: "STEPS",
        value: steps,
        memberId,
        date: gqlDate(date),
        notes: ""
      }

      const mutationId = genMutationId()
      return mutate({
        variables: {
          input: { ...payload, clientMutationId: mutationId },
          clientMutationId: mutationId,
          __offline__: true
        },
        refetchQueries: [
          {
            query: MEMBER_STEPS,
            variables: { __offline__: true, date: gqlDate(date) }
          },
          {
            query: LATEST_TREND,
            variables: { __offline__: true, interval }
          },
          {
            query: WEEKLY_TRAINING_STATS,
            variables: { __offline__: true, date: gqlDate(moment()) }
          }
        ],
        optimisticResponse: {
          upsertMemberMetricV2: {
            clientMutationId: mutationId,
            __typename: "UpsertMemberMetricV2Payload",
            memberMetric: {
              __typename: "MemberMetric",
              id: +Date.now(),
              date: gqlDate(date),
              memberId,
              key: "STEPS",
              value: steps,
              notes: ""
            }
          }
        }
      })
    }
  })
})
