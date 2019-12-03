import gql from "graphql-tag"
import dayFragments from "graphql/fragment/food/day"

export default {
  minPlan: gql`
    fragment PlanMin on NutritionPlan {
      id
      name
      notes
      duration
      nutritionFacts {
        calories
        protein
        fat
        carbs
        fibre
        alcohol
      }
      schedule: nutritionPlanSchedulesByNutritionPlanId {
        nodes {
          dayType
          orderIndex
          day: nutritionDayByNutritionDayId {
            ...DayMin
          }
        }
      }
    }
    ${dayFragments.minDay}
  `
}
