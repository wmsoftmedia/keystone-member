import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import assignedTrainingPlanFragment from "graphql/fragment/training/assignedPlan"

export const ACTIVE_ASSIGNED_TRAINING_PLANS = gql`
  query ActiveAssignedTrainingPlans($date: NaiveDate!) {
    currentMember {
      id
      assignedTrainingPlans(filter: ACTIVE, date: $date) {
        nodes {
          ...TrainingPlanAssignmentMin
        }
        totalCount
      }
    }
  }
  ${assignedTrainingPlanFragment.min}
`

export const COMPLETED_ASSIGNED_TRAINING_PLANS = gql`
  query CompletedAssignedTrainingPlans($date: NaiveDate!) {
    currentMember {
      id
      assignedTrainingPlans(filter: COMPLETED, date: $date) {
        nodes {
          ...TrainingPlanAssignmentMin
        }
        totalCount
      }
    }
  }
  ${assignedTrainingPlanFragment.min}
`

export const withActiveAssignedTrainingPlans = graphql(
  ACTIVE_ASSIGNED_TRAINING_PLANS,
  {
    options: ({ date }) => ({
      fetchPolicy: "cache-and-network",
      variables: { date }
    })
  }
)

export const withCompletedAssignedTrainingPlans = graphql(
  COMPLETED_ASSIGNED_TRAINING_PLANS,
  {
    options: ({ date }) => ({
      fetchPolicy: "cache-and-network",
      variables: { date }
    })
  }
)
