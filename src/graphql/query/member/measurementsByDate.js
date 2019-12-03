import { graphql } from "react-apollo"
import gql from "graphql-tag"
import moment from "moment"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"

export const MEMBER_MEASUREMENTS_BY_DATE = gql`
  query MemberMeasurementsByDate($date: Date!) {
    currentMember {
      id
      measurementsByDate(date: $date) {
        nodes {
          id
          memberId
          date
          key
          value
          parts
        }
      }
    }
  }
`

const withMeasurements = graphql(MEMBER_MEASUREMENTS_BY_DATE, {
  options: ({ date }) => ({
    fetchPolicy: "network-only",
    variables: {
      __offline__: true,
      date: (date ? moment(date) : moment()).format(DATE_FORMAT_GRAPHQL)
    },
    notifyOnNetworkStatusChange: true
  }),
  props: ({ data }) => {
    const { loading, currentMember, error } = data
    return {
      measurements: loading || error ? [] : currentMember.measurementsByDate.nodes
    }
  }
})

export default withMeasurements
