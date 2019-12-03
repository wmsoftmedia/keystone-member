import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

const MEMBER_FEATURES = gql`
  query MemberFeatures {
    member: currentMember {
      id
      features {
        nodes {
          id
          name
          comment
        }
      }
    }
  }
`

export default graphql(MEMBER_FEATURES, {
  options: () => ({
    fetchPolicy: "cache-and-network"
  })
})
