import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { MEMBER_RESERVATIONS } from "graphql/query/member/reservations"
import { genMutationId, readQuerySafe } from "keystone"
import _ from "lodash/fp"
import reservationFragments from "graphql/fragment/reservation/reservation"

const CREATE_RESERVATION_REQUEST = gql`
  mutation CreateReservationRequest($input: CreateReservationRequestInput!) {
    createReservationRequest(input: $input) {
      clientMutationId
      reservations: memberReservations {
        ...ReservationNode
      }
    }
  }
  ${reservationFragments.node}
`

export const withReservationRequestMutation = graphql(
  CREATE_RESERVATION_REQUEST,
  {
    props: ({ mutate }) => ({
      createReservationRequest: request => {
        const clientMutationId = genMutationId()
        const input = {
          clientMutationId,
          timeslotId: request.timeslotId,
          prevTimeslotId: request.prevTimeslotId || null,
          date: request.date
        }
        const variables = { input, clientMutationId, __offline__: true }
        return mutate({
          variables,
          update: (proxy, response) => {
            const { createReservationRequest } = response.data
            const { error, data } = readQuerySafe(proxy, {
              query: MEMBER_RESERVATIONS
            })
            if (error) return
            const newReservations = _.getOr(
              [],
              "reservations",
              createReservationRequest
            )
            if (newReservations.length > 0) {
              data.currentMember.reservations.nodes = newReservations
              proxy.writeQuery({ query: MEMBER_RESERVATIONS, data })
            }
          }
        })
      }
    })
  }
)
