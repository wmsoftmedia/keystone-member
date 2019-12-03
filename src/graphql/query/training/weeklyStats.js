import { compose, setPropTypes } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import PropTypes from "prop-types"

export const WEEKLY_TRAINING_STATS = gql`
  query WeeklyTrainingStats($date: NaiveDate!) {
    currentMember {
      id
      weeklyTrainingStat(date: $date) {
        steps
        volume
        distance
        calories
      }
    }
  }
`

export const withWeeklyTrainingStats = compose(
  setPropTypes({
    date: PropTypes.string.isRequired
  }),
  graphql(WEEKLY_TRAINING_STATS, {
    options: ({ date }) => ({
      fetchPolicy: "cache-and-network",
      variables: { date }
    })
  })
)
