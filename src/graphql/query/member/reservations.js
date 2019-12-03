import { compose } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import reservationFragments from "graphql/fragment/reservation/reservation"

export const MEMBER_RESERVATIONS = gql`
  query MemberReservations {
    currentMember {
      id
      ksUserId
      club {
        id
        name
      }
      org {
        id
        name
      }
      reservations {
        nodes {
          ...ReservationNode
        }
      }
    }
  }
  ${reservationFragments.node}
`

export const withReservations = graphql(MEMBER_RESERVATIONS, {
  options: () => ({
    fetchPolicy: "cache-and-network"
  })
})

export const withReservationsLoaded = compose(withReservations)
