import { compose, defaultProps, setPropTypes } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { withLoader } from "hoc"
import PropTypes from "prop-types"

const SEARCH_EXERCISES_BY_NAME = gql`
  query SearchExercisesByName($term: String!, $limit: Int!) {
    searchExercises(search: $term, first: $limit) {
      nodes {
        id
        name
        equipment
        targetMuscle
      }
    }
  }
`

const searchExercisesByNameQuery = graphql(SEARCH_EXERCISES_BY_NAME, {
  options: ({ term, limit }) => ({
    fetchPolicy: "cache-and-network",
    variables: { term, limit }
  })
})

export const searchExercisesByName = compose(
  defaultProps({ limit: 50 }),
  setPropTypes({ term: PropTypes.string.isRequired }),
  searchExercisesByNameQuery
)

export const searchExercisesByNameLoaded = compose(
  searchExercisesByName,
  withLoader({ message: "Loading exercises..." })
)
