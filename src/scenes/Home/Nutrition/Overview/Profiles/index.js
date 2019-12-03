import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { compose } from "recompose"
import React from "react"

import { withErrorHandler, withLoader } from "hoc"
import NutritionProfilesList from "scenes/Home/Nutrition/Overview/Profiles/NutritionProfilesList"
import colors from "kui/colors"

const NutritionProfilesContainer = ({ data }) => {
  const profiles = data.currentMember.nutritionProfiles.nodes
  const refreshProfiles = done => data.refetch().then(done)
  return <NutritionProfilesList profiles={profiles} refreshProfiles={refreshProfiles} />
}

const MEMBER_NUTRITION_PROFILES = gql`
  query MemberNutritionProfiles {
    currentMember {
      id
      nutritionProfiles: nutritionProfilesByMemberId {
        nodes {
          id
          label
          days
          notes
          macros {
            protein
            fat
            carbs
          }
        }
      }
    }
  }
`

const withData = graphql(MEMBER_NUTRITION_PROFILES, {
  options: {
    fetchPolicy: "network-only",
    variables: { __offline__: true },
    notifyOnNetworkStatusChange: true
  }
})

const enhance = compose(
  withData,
  withErrorHandler,
  withLoader({
    color: colors.white,
    operationName: "MemberNutritionProfiles"
  })
)

export default enhance(NutritionProfilesContainer)
