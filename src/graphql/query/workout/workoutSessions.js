import { compose, setPropTypes } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { gqlDate } from "keystone"
import PropTypes from "prop-types"
import workoutSessionFragment from "graphql/fragment/workout/session"

export const ALL_MEMBER_WORKOUT_SESSIONS = gql`
  query AllWorkoutSessions {
    currentMember {
      id
      workoutSessions {
        nodes {
          ...WorkoutSessionMin
        }
        totalCount
      }
    }
  }
  ${workoutSessionFragment.min}
`

export const withWorkoutSessions = graphql(ALL_MEMBER_WORKOUT_SESSIONS, {
  options: {
    fetchPolicy: "cache-and-network"
  }
})

export const WORKOUT_SESSIONS_BY_MONTH = gql`
  query WorkoutSessionsByMonth($date: NaiveDate!) {
    currentMember {
      id
      workoutSessionsByMonth(month: $date) {
        nodes {
          ...WorkoutSessionMin
        }
        totalCount
      }
    }
  }
  ${workoutSessionFragment.min}
`

export const withWorkoutSessionsByMonth = compose(
  setPropTypes({
    date: PropTypes.string.isRequired
  }),
  graphql(WORKOUT_SESSIONS_BY_MONTH, {
    options: ({ date }) => ({
      fetchPolicy: "cache-and-network",
      variables: { date: gqlDate(moment(date).startOf("month")) }
    })
  })
)

const WORKOUT_SESSIONS_BY_DATE = gql`
  query WorkoutSessionsByDate($date: NaiveDate!) {
    currentMember {
      id
      workoutSessionsByDate(date: $date) {
        nodes {
          ...WorkoutSessionMin
        }
        totalCount
      }
    }
  }
  ${workoutSessionFragment.min}
`

export const withWorkoutSessionsByDate = compose(
  setPropTypes({
    date: PropTypes.string.isRequired
  }),
  graphql(WORKOUT_SESSIONS_BY_DATE, {
    options: ({ date }) => ({
      fetchPolicy: "cache-and-network",
      variables: { date }
    })
  })
)
