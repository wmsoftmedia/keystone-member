import { LayoutAnimation } from "react-native"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { compose } from "recompose"
import { lifecycle } from "recompose"
import React from "react"
import moment from "moment"

import {
  emptyTotals,
  gqlDate,
  isCurrent,
  isFutureDate,
  mealTotals,
  sortMoments,
  today
} from "keystone"
import { getProfileForMetric } from "scenes/Home/Nutrition/utils"
import { withErrorHandler, withLoader } from "hoc"
import Today from "scenes/Home/Nutrition/Overview/Today/Today"
import colors from "kui/colors"

const getTotals = snapshot => {
  if (snapshot.length === 0 || !snapshot[0]) {
    return emptyTotals
  }
  const metric = snapshot[0]
  const body = JSON.parse(metric.body)
  return mealTotals(body.meals)
}

const TodayContainer = props => {
  const { date } = props
  const profiles = props.data.currentMember.nutritionProfiles.nodes
    .filter(p => p.startDate)
    .filter(p => {
      const startDate = moment(p.startDate)
      return startDate.isBefore(moment(date)) || startDate.isSame(moment(date))
    })
    .sort((p1, p2) => sortMoments(moment(p2.startDate), moment(p1.startDate)))

  const snapshot = props.data.currentMember.snapshot

  const trackedProfile = getProfileForMetric(snapshot)

  const currentProfile =
    trackedProfile && !isFutureDate(date)
      ? trackedProfile
      : profiles.find(p => isCurrent(p, moment(date).day()))

  const totals = getTotals(snapshot.nodes)

  return <Today date={date} profile={currentProfile} totals={totals} />
}

export const MEMBER_NUTRITION_SNAPSHOT = gql`
  query MemberNutritionSnapshot($date: Date!) {
    currentMember {
      id
      nutritionProfiles: nutritionProfilesByMemberId {
        nodes {
          id
          label
          days
          notes
          startDate
          macros {
            protein
            fat
            carbs
          }
        }
      }
      snapshot: memberNutritionMetricsByMemberId(condition: { date: $date }) {
        nodes {
          id
          date
          body
          profileBody
        }
      }
    }
  }
`

const withData = graphql(MEMBER_NUTRITION_SNAPSHOT, {
  options: ({ date }) => ({
    fetchPolicy: "cache-first",
    variables: {
      __offline__: true,
      date: gqlDate(date || today())
    },
    notifyOnNetworkStatusChange: true
  })
})

const enhance = compose(
  withData,
  withErrorHandler,
  withLoader({ color: colors.white, operationName: "MemberNutritionSnapshot" }),
  lifecycle({
    componentWillMount() {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }
  })
)

export default enhance(TodayContainer)
