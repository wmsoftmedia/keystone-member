import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import workoutTemplateFragment from "graphql/fragment/workout/workout"

export const KEYSTONE_WORKOUT_TEMPLATES = gql`
  query KeystoneWorkoutTemplates {
    allWorkoutTemplates(filter: KEYSTONE) {
      nodes {
        ...WorkoutTemplateMin
      }
      totalCount
    }
  }
  ${workoutTemplateFragment.min}
`

export const withKeystoneWorkoutTemplates = graphql(
  KEYSTONE_WORKOUT_TEMPLATES,
  {
    options: {
      fetchPolicy: "cache-and-network"
    }
  }
)
