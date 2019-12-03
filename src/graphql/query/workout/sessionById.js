import { compose, setPropTypes } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import PropTypes from "prop-types"

import workoutSessionFragment from "graphql/fragment/workout/session"

export const WORKOUT_SESSION_BY_ID = gql`
  query WorkoutSessionById($id: ID!) {
    workoutSessionById(id: $id) {
      ...WorkoutSessionFull
    }
  }
  ${workoutSessionFragment.full}
`

export const withWorkoutSessionById = compose(
  setPropTypes({
    workoutSessionId: PropTypes.string.isRequired
  }),
  graphql(WORKOUT_SESSION_BY_ID, {
    options: ({ workoutSessionId }) => ({
      fetchPolicy: "cache-and-network",
      variables: { id: workoutSessionId }
    })
  })
)
