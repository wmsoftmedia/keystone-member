import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

export const MEMBER_STEPS = gql`
  query StepsTrend($interval: Int!) {
    allMemberMetrics(condition: { key: STEPS }, orderBy: DATE_DESC, first: $interval) {
      nodes {
        id
        date
        value
      }
    }
  }
`

export default graphql(MEMBER_STEPS, {
  name: "stepsTrend",
  options: ({ interval }) => ({
    fetchPolicy: "network-only",
    variables: { __offline__: true, interval },
    notifyOnNetworkStatusChange: true
  })
})
