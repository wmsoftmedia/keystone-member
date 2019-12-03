import { graphql } from "react-apollo"
import gql from "graphql-tag"

import { genMutationId, gqlDate } from "keystone"

const UPSERT_MEMBER_METRICS = gql`
  mutation UpsertMemberMetricsV2($input: UpsertMemberMetricV2Input!) {
    upsertMemberMetricV2(input: $input) {
      clientMutationId
      memberMetric {
        id
        memberId
        date
        key
        value
        parts
      }
    }
  }
`

export const MEMBER_MEASUREMENTS_LATEST = gql`
  query MemberLatestMeasurements($date: Date!) {
    currentMember {
      id
      measurementsByDate(date: $date) {
        nodes {
          id
          date
          key
          value
        }
      }
    }
  }
`

export default graphql(UPSERT_MEMBER_METRICS, {
  props: ({ mutate, ownProps: { memberId, date } }) => {
    return {
      syncMetrics: ({ measurements }) => {
        const partMapper = ({ key, value }) => ({ key, value })
        const partsPayload = (parts) =>
          parts.filter((p) => (p.value ? true : false)).map(partMapper)
        const createPayload = (m) => ({
          key: m.key.toUpperCase(), // required for gql type coercion
          value: m.value ? m.value : 0,
          parts: JSON.stringify(m.parts ? partsPayload(m.parts) : []),
          memberId,
          date: gqlDate(date)
        })
        const createPromise = (metric, i) => {
          const mutationId = genMutationId()
          return mutate({
            variables: {
              input: { ...metric, clientMutationId: mutationId },
              clientMutationId: mutationId,
              __offline__: true
            },
            refetchQueries:
              i === measurements.length - 1
                ? [
                    {
                      query: MEMBER_MEASUREMENTS_LATEST,
                      variables: { date: gqlDate(date) }
                    }
                  ]
                : [],
            optimisticResponse: {
              upsertMemberMetricV2: {
                clientMutationId: mutationId,
                __typename: "UpsertMemberMetricV2Payload",
                memberMetric: {
                  __typename: "MemberMetric",
                  id: +Date.now(),
                  date: gqlDate(date),
                  memberId,
                  key: metric.key.toUpperCase(),
                  value: metric.value,
                  parts: metric.parts
                }
              }
            }
          })
        }
        // eslint-disable-next-line no-undef
        return Promise.all(measurements.map(createPayload).map(createPromise))
      }
    }
  }
})
