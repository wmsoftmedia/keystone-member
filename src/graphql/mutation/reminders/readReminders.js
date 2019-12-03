import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import memberReminderFragment from "graphql/fragment/reminders/reminder"
import { ACCOUNT_POLLER } from "graphql/query/reminders/allReminders"
import { getOr } from "keystone"

const READ_REMINDERS = gql`
  mutation ReadReminders($input: ReadRemindersInput!) {
    readReminders(input: $input) {
      memberReminders {
        ...MemberReminderFull
      }
    }
  }
  ${memberReminderFragment}
`

export default graphql(READ_REMINDERS, {
  props: ({ mutate }) => ({
    readReminders: reminders => {
      const reminderIds = reminders.map(r => r.id)
      const optReminders = reminders.map(r => ({ ...r, seen: true }))
      return mutate({
        variables: { input: { reminders: reminderIds } },
        optimisticResponse: {
          readReminders: {
            __typename: "ReadRemindersPayload",
            memberReminders: optReminders
          }
        },
        update: (proxy, props) => {
          const data = proxy.readQuery({ query: ACCOUNT_POLLER })
          const totalCount = getOr(0, "unreadReminderCount.totalCount", data)
          if (totalCount) {
            data.unreadReminderCount.totalCount =
              reminders.length < totalCount ? totalCount - reminders.length : 0
            proxy.writeQuery({ query: ACCOUNT_POLLER, data })
          }
        }
      })
    }
  })
})
