import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import workoutTemplateFragment from "graphql/fragment/workout/workout"

export const ALL_ASSIGNED_WORKOUT_TEMPLATES = gql`
  query AllMemberTrainingPlans {
    allWorkoutTemplates(filter: ASSIGNED) {
      nodes {
        ...WorkoutTemplateMin
      }
      totalCount
    }
  }
  ${workoutTemplateFragment.min}
`

export const withAssignedWorkoutTemplates = graphql(
  ALL_ASSIGNED_WORKOUT_TEMPLATES,
  {
    options: {
      fetchPolicy: "cache-and-network"
    }
  }
)
