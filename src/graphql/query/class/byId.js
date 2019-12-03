import { compose } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { gradients } from "kui/colors"
import { withLoader } from "hoc"

const CLASS_BY_ID = gql`
  query ClassById($classId: Uuid!) {
    currentMember {
      id
      ksUserId
    }
    classById(id: $classId) {
      id
      capacity
      name
      timeslots: timeslotsByClassId {
        nodes {
          id
          time
          day
          capacity
        }
      }
    }
  }
`

export const withClassById = graphql(CLASS_BY_ID, {
  options: () => ({
    fetchPolicy: "cache-and-network"
  })
})

export const withClassByIdLoaded = compose(
  withClassById,
  withLoader({
    message: "Loading Class Info...",
    backgroundColor: gradients.bg1[0]
  })
)
