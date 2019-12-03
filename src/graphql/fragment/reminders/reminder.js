import gql from "graphql-tag"

export default gql`
  fragment MemberReminderFull on MemberReminder {
    id
    memberId
    coach: coachByCoachId {
      id
      firstName
    }
    date
    type
    title
    message
    seen
    createdAt
  }
`
