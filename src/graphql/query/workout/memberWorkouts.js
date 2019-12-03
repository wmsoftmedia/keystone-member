import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import workoutTemplateFragment from "graphql/fragment/workout/workout"

export const ALL_MEMBER_WORKOUT_TEMPLATES = gql`
  query AllMemberTrainingPlans {
    allWorkoutTemplates(filter: OWN) {
      nodes {
        ...WorkoutTemplateMin
      }
      totalCount
    }
  }
  ${workoutTemplateFragment.min}
`

export const withMemberWorkoutTemplates = graphql(
  ALL_MEMBER_WORKOUT_TEMPLATES,
  {
    options: {
      fetchPolicy: "cache-and-network"
    }
  }
)
