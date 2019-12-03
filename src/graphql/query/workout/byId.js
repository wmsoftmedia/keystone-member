import { compose, setPropTypes } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import PropTypes from "prop-types"

import workoutTemplateFragment from "graphql/fragment/workout/workout"

const WORKOUT_TEMPLATE_BY_ID = gql`
  query WorkoutTemplateById($id: ID!, $date: NaiveDate!) {
    workoutTemplateById(id: $id) {
      ...WorkoutTemplateFull
    }
    currentMember {
      id
      workoutSessionsByDate(date: $date) {
        nodes {
          id
          date
          isCompleted
          workoutTemplate {
            id
          }
        }
        totalCount
      }
    }
  }
  ${workoutTemplateFragment.full}
`

export const withWorkoutTemplateById = compose(
  setPropTypes({
    workoutId: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  }),
  graphql(WORKOUT_TEMPLATE_BY_ID, {
    options: ({ workoutId, date }) => ({
      fetchPolicy: "cache-and-network",
      variables: { id: workoutId, date }
    })
  })
)

// ------------------------------------------------------

const WORKOUT_TEMPLATE_MODEL_BY_ID = gql`
  query WorkoutTemplateById($id: ID!) {
    workoutTemplateById(id: $id) {
      ...WorkoutTemplateModel
    }
  }
  ${workoutTemplateFragment.withModel}
`
export const withWorkoutTemplateModelById = compose(
  setPropTypes({
    workoutId: PropTypes.string.isRequired
  }),
  graphql(WORKOUT_TEMPLATE_MODEL_BY_ID, {
    options: ({ workoutId }) => ({
      fetchPolicy: "cache-and-network",
      variables: { id: workoutId }
    })
  })
)

const WORKOUT_TEMPLATE_MODEL_SESSION_BY_ID = gql`
  query WorkoutTemplateModelSessionById($id: ID!, $date: NaiveDate!) {
    workoutTemplateById(id: $id) {
      ...WorkoutTemplateModel
    }
    currentMember {
      id
      workoutSessionsByDate(date: $date) {
        nodes {
          id
          date
          isCompleted
          workoutTemplate {
            id
          }
        }
        totalCount
      }
    }
  }
  ${workoutTemplateFragment.withModel}
`
export const withWorkoutTemplateModelSessionById = compose(
  setPropTypes({
    workoutId: PropTypes.string.isRequired
  }),
  graphql(WORKOUT_TEMPLATE_MODEL_SESSION_BY_ID, {
    options: ({ workoutId, date }) => ({
      fetchPolicy: "cache-and-network",
      variables: { id: workoutId, date }
    })
  })
)
