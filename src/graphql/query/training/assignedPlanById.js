import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import assignedTrainingPlanFragment from "graphql/fragment/training/assignedPlan"

export const ASSIGNED_TRAINING_PLAN = gql`
  query TrainingPlanAssignmentById($id: ID!) {
    trainingPlanAssignmentById(id: $id) {
      ...TrainingPlanAssignmentFull
    }
  }
  ${assignedTrainingPlanFragment.full}
`

export const withAssignedTrainingPlan = graphql(ASSIGNED_TRAINING_PLAN, {
  options: ({ assignedPlanId }) => ({
    fetchPolicy: "cache-and-network",
    variables: { id: assignedPlanId }
  })
})
