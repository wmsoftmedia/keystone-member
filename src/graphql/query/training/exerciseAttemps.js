import { compose, defaultProps, setPropTypes } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { withLoader } from "hoc"
import PropTypes from "prop-types"

const EXERCISE_ATTEMPTS_BY_NAME = gql`
  query MemberExerciseAttemptsByName($term: String!, $limit: Int!) {
    currentMember {
      id
      exerciseAttemptsByName(name: $term, limit: $limit) {
        nodes {
          id
          date
          exerciseName
          effort
          weightValue
        }
      }
    }
  }
`

const exerciseAttemptsByNameQuery = graphql(EXERCISE_ATTEMPTS_BY_NAME, {
  options: ({ term, limit }) => ({
    fetchPolicy: "cache-and-network",
    variables: { term, limit }
  })
})

export const exerciseAttemptsByName = compose(
  defaultProps({ limit: 50 }),
  setPropTypes({ term: PropTypes.string.isRequired }),
  exerciseAttemptsByNameQuery
)

export const exerciseAttemptsByNameLoaded = compose(
  exerciseAttemptsByName,
  withLoader({ message: "Loading exercise history..." })
)
