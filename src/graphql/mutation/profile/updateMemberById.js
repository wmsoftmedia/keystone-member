import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { genMutationId, readQuerySafe } from "keystone"
import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { DAILY_SNAPSHOT } from "hoc/withDailyData"
import { MEMBER_PROFILE } from "graphql/query/member/profileData"

const UPDATE_MEMBER = gql`
  mutation UpdateMemberById($input: UpdateMemberByIdInput!) {
    updateMemberById(input: $input) {
      clientMutationId
    }
  }
`

const updateMemberById = graphql(UPDATE_MEMBER, {
  props: ({ mutate }) => ({
    updateMemberById: ({
      id,
      userId,
      locationId,
      coachId,
      firstName,
      lastName,
      updatedAt,
      createdAt,
      goalSummary,
      checkedInAt,
      ksUserId,
      defaultKsOrgId,
      defaultKsClubId,
      status,
      goal,
      isOnBoarded
    }) => {
      const clientMutationId = genMutationId()
      return mutate({
        variables: {
          clientMutationId,
          input: {
            id,
            memberPatch: {
              userId,
              locationId,
              coachId,
              firstName,
              lastName,
              updatedAt,
              createdAt,
              goalSummary,
              checkedInAt,
              ksUserId,
              defaultKsOrgId,
              defaultKsClubId,
              status,
              goal,
              isOnBoarded
            }
          }
        },
        optimisticResponse: {
          updateMemberById: {
            __typename: "UpdateMemberPayload",
            clientMutationId
          }
        },
        refetchQueries: [
          {
            query: DAILY_SNAPSHOT,
            variables: { __offline__: true, date: moment().format(DATE_FORMAT_GRAPHQL) }
          },
          {
            query: MEMBER_PROFILE,
            variables: { __offline__: true }
          }
        ],
        update: proxy => {
          const { error, data } = readQuerySafe(proxy, {
            query: DAILY_SNAPSHOT,
            variables: { __offline__: true, date: moment().format(DATE_FORMAT_GRAPHQL) }
          })
          if (error) return

          if (isOnBoarded !== undefined) {
            data.currentMember.isOnBoarded = isOnBoarded
            proxy.writeQuery({
              query: DAILY_SNAPSHOT,
              data,
              variables: { __offline__: true, date: moment().format(DATE_FORMAT_GRAPHQL) }
            })
          }
        }
      })
    }
  })
})

export default updateMemberById
