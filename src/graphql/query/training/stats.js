import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

export const MEMBER_TRAINING_STATS = gql`
  query MemberTrainingStats($memberId: Int!) {
    allTopLifts(
      condition: { memberId: $memberId }
      orderBy: MAX_WEIGHT_DESC
      first: 6
    ) {
      nodes {
        memberId
        label
        maxWeight
      }
    }
  }
`

export default graphql(MEMBER_TRAINING_STATS, {
  name: "topLifts",
  options: props => ({
    fetchPolicy: "network-only",
    variables: {
      __offline__: true,
      memberId: props.memberId
    },
    notifyOnNetworkStatusChange: true
  })
})
