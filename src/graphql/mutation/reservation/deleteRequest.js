import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { MEMBER_RESERVATIONS } from "graphql/query/member/reservations"
import { genMutationId, readQuerySafe } from "keystone"
import _ from "lodash/fp"

const DELETE_RESERVATION_REQUEST = gql`
  mutation DeleteReservationRequest(
    $input: DeleteReservationRequestByIdInput!
  ) {
    deleteReservationRequestById(input: $input) {
      clientMutationId
    }
  }
`

export const withReservationRequestDeleteMutation = graphql(
  DELETE_RESERVATION_REQUEST,
  {
    props: ({ mutate }) => ({
      deleteReservationRequestById: requestId => {
        // Permanent bookings cannot be deleted
        if (!requestId) return
        const clientMutationId = genMutationId()
        const input = {
          clientMutationId,
          id: requestId
        }
        const variables = { input, clientMutationId, __offline__: true }
        return mutate({
          variables,
          optimisticResponse: {
            deleteReservationRequestById: {
              clientMutationId,
              __typename: "DeleteReservationRequestByIdPayload"
            }
          },
          update: proxy => {
            const { error, data } = readQuerySafe(proxy, {
              query: MEMBER_RESERVATIONS
            })
            if (error) return
            const oldReservations = _.getOr(
              [],
              "currentMember.reservations.nodes",
              data
            )
            data.currentMember.reservations.nodes = oldReservations.filter(
              r => r.requestId !== requestId
            )
            proxy.writeQuery({ query: MEMBER_RESERVATIONS, data })
          }
        })
      }
    })
  }
)
