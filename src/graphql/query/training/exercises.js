import { compose } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { withLoader } from "hoc"

const ALL_EXERCISES = gql`
  query AllExercises {
    allExercises(orderBy: NAME_ASC) {
      nodes {
        id
        name
        equipment
        targetMuscle
        family
        overrides: exerciseOverridesByExerciseId(first: 1) {
          nodes {
            name
            equipment
            targetMuscle
            family
          }
        }
      }
    }
  }
`

export const allExercises = graphql(ALL_EXERCISES, {
  options: () => ({
    //fetchPolicy: "cache-and-network"
    fetchPolicy: "cache-first"
  })
})

export const allExercisesLoaded = compose(
  allExercises,
  withLoader({ message: "Loading exercises..." })
)
