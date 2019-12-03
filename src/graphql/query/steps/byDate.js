import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

export const MEMBER_STEPS = gql`
  query StepsByDate($date: Date!) {
    currentMember {
      id
      stepsByDate: memberMetricsByMemberId(condition: { date: $date, key: STEPS }) {
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

export default graphql(MEMBER_STEPS, {
  name: "stepsByDate",
  options: props => ({
    fetchPolicy: "network-only",
    variables: {
      __offline__: true,
      date: props.date
    },
    notifyOnNetworkStatusChange: true
  })
})
