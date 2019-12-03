import { graphql } from "@apollo/react-hoc"
import { compose } from "recompose"
import React from "react"
import gql from "graphql-tag"

import { LIFESTYLE_KEYS } from "scenes/Home/Feelings/display"
import { gqlDate } from "keystone"
import { withErrorHandler, withLoader } from "hoc"
import Swiper from "scenes/Home/Feelings/Overview/Stats/Swiper"
import colors from "kui/colors"

const normalizeStats = (keys, records, property) => {
  const metricExtractor = k => {
    const byKey = k => ({ key }) => key.toLowerCase() === k
    const m = records.find(byKey(k))
    const val = m && m[property] ? m[property] : 0
    return {
      key: m && m.key ? m.key : k,
      value: Math.round(val * 10) / 10
    }
  }
  return keys.map(metricExtractor)
}

const Container = props => {
  const feelings = props.data.currentMember.feelingsByDate.nodes
  const normalizedAverages = normalizeStats(LIFESTYLE_KEYS, feelings, "value")
  const stats = [{ data: normalizedAverages }]
  console.log('feeling stats', stats);
  return <Swiper stats={stats} />
}

export const MEMBER_FEELINGS_TODAY = gql`
  query MemberFeelingsToday($date: Date!) {
    currentMember {
      id
      feelingsByDate(date: $date) {
        nodes {
          id
          memberId
          date
          key
          value
        }
      }
    }
  }
`

const withData = graphql(MEMBER_FEELINGS_TODAY, {
  options: ({ date }) => ({
    fetchPolicy: "cache-first",
    variables: { __offline__: true, date: gqlDate(date) },
    notifyOnNetworkStatusChange: true
  })
})

const container = compose(
  withData,
  withErrorHandler,
  withLoader({ color: colors.white, operationName: "MetricsOverview" })
)

export default container(Container)
