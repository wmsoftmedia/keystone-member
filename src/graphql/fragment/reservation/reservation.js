import gql from "graphql-tag"

export default {
  node: gql`
    fragment ReservationNode on MemberReservation {
      className
      date
      day
      time
      classId
      timeslotId
      requestId
      type
      status
      updatedAt
    }
  `
}
