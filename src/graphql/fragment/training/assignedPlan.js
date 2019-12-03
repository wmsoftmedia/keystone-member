import gql from "graphql-tag"

export default {
  full: gql`
    fragment TrainingPlanAssignmentFull on TrainingPlanAssignment {
      id
      trainingPlanId
      startDate
      endDate
      assignedBy
      trainingPlan {
        id
        name
        notes
        duration
        slots {
          nodes {
            workoutTemplateId
            workoutTemplateName
            offset
            phase
            notes
            workoutTemplate {
              setMap
              duration
              difficulty
            }
          }
          totalCount
        }
      }
    }
  `,
  min: gql`
    fragment TrainingPlanAssignmentMin on TrainingPlanAssignment {
      id
      trainingPlanId
      startDate
      endDate
      assignedBy
      trainingPlan {
        id
        name
      }
    }
  `
}
