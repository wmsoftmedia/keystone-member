import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import dayFragments from "graphql/fragment/food/day"

const ALL_MY_PLANS_QUERY = gql`
  query AllMyPlans {
    currentMember {
      id
      memberNutritionPlansByMemberId(orderBy: UPDATED_AT_DESC) {
        nodes {
          id
          notes
          startDate
          endDate
          plan: nutritionPlanByNutritionPlanId {
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
                  id
                  name
                  notes
                }
              }
            }
          }
        }
      }
    }
  }
`

export default graphql(ALL_MY_PLANS_QUERY, {
  name: "AllMyPlans",
  fetchPolicy: "cache-first",
  variables: { __offline__: true }
})
