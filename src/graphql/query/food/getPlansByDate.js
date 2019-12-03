import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import planFragments from "graphql/fragment/food/plan"

const GET_PLANS_QUERY = gql`
  query GetPlansByDate($date: Date!) {
    memberNutritionPlansByDate(date: $date) {
      nodes {
        id
        notes
        startDate
        endDate
        plan: nutritionPlanByNutritionPlanId {
          ...PlanMin
        }
      }
    }
  }
  ${planFragments.minPlan}
`

export default graphql(GET_PLANS_QUERY, {
  options: ({ date }) => ({
    fetchPolicy: "network-only",
    variables: { date }
  })
})
