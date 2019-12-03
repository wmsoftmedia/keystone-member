import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { defaultProps, compose } from "recompose"
import _ from "lodash/fp"
import memberReminderFragment from "graphql/fragment/reminders/reminder"

export const ACCOUNT_POLLER = gql`
  query AccountPoller {
    currentMember {
      id
      accountStatus
    }
    unreadReminderCount: allMemberReminders(condition: { seen: false }) {
      totalCount
    }
  }
`

export const withUnreadReminderCnt = graphql(ACCOUNT_POLLER, {
  options: () => ({
    fetchPolicy: "network-only",
    pollInterval: 10000,
    notifyOnNetworkStatusChange: true
  })
})

export const ALL_MEMBER_REMINDERS = gql`
  query AllMemberReminders(
    $pageSize: Int
    $offset: Int
    $filter: MemberReminderCondition
  ) {
    reminders: allMemberReminders(
      condition: $filter
      first: $pageSize
      offset: $offset
      orderBy: CREATED_AT_DESC
    ) {
      totalCount
      nodes {
        ...MemberReminderFull
      }
    }
  }
  ${memberReminderFragment}
`

const DEFAULT_VALUES = {
  pageSize: null,
  offset: null,
  filter: {}
}

export default compose(
  defaultProps(DEFAULT_VALUES),
  graphql(ALL_MEMBER_REMINDERS, {
    options: props => ({
      fetchPolicy: "network-only",
      pollInterval: 10000,
      variables: {
        ..._.pick(Object.keys(DEFAULT_VALUES), props),
        __offline__: true
      },
      notifyOnNetworkStatusChange: true
    })
  })
)
