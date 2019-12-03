import { graphql } from "react-apollo"
import gql from "graphql-tag"
import moment from "moment"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"

const UPSERT_MEMBER_METRIC = gql`
  mutation UpsertMemberMetricV2($input: UpsertMemberMetricV2Input!) {
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

export default graphql(UPSERT_MEMBER_METRIC, {
  props: ({ mutate }) => {
    return {
      upsertMemberMetric: ({ memberId, value, date, key, parts }) => {
        const partMapper = ({ key, value }) => ({ key, value })
        const partsPayload = parts =>
          parts.filter(p => (p.value ? true : false)).map(partMapper)

        const metric = {
          memberId,
          key: key.toUpperCase(),
          value: value ? value : 0,
          date: (date ? moment(date) : moment()).format(DATE_FORMAT_GRAPHQL),
          parts: JSON.stringify(parts ? partsPayload(parts) : [])
        }

        return mutate({
          variables: {
            input: metric,
            __offline__: true
          }
        })
      }
    }
  }
})
