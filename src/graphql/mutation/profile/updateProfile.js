import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { MEMBER_PROFILE } from "graphql/query/member/profileData"

const UPDATE_MEMBER_PROFILE = gql`
  mutation UpdateMemberProfile($input: UpdateMemberProfileInput!) {
    updateMemberProfile(input: $input) {
      member {
        id
        firstName
        lastName
        gender
        dateOfBirth
        height
        goal
      }
    }
  }
`

const updateMemberProfile = graphql(UPDATE_MEMBER_PROFILE, {
  props: ({ mutate }) => ({
    updateMemberProfile: ({
      memberId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      height,
      goal,
      member = {}
    }) => {
      return mutate({
        variables: {
          input: {
            memberId,
            firstName,
            lastName,
            gender,
            dateOfBirth: dateOfBirth === "" ? null : dateOfBirth,
            height: height === "" ? null : height,
            goal
          }
        },
        refetchQueries: [
          {
            query: MEMBER_PROFILE,
            variables: { __offline__: true }
          }
        ],
        optimisticResponse: {
          updateMemberProfile: {
            __typename: "UpdateMemberProfilePayload",
            member: {
              __typename: "Member",
              id: memberId,
              firstName: firstName || member.firstName,
              lastName: lastName || member.lastName,
              gender: gender || member.gender,
              dateOfBirth: dateOfBirth || member.dateOfBirth,
              height: height || member.height,
              goal: goal || member.goal
            }
          }
        }
      })
    }
  })
})

export default updateMemberProfile
