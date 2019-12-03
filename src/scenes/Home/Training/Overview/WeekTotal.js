import { compose, withProps, lifecycle } from "recompose"
import React from "react"
import numeral from "numeral"
import styled, { View, Text } from "glamorous-native"
import _ from "lodash/fp"

import { withErrorHandler, withLoader, withSettings } from "hoc"
import { withWeeklyTrainingStats } from "graphql/query/training/weeklyStats"
import { Row } from "kui/components"
import colors from "kui/colors"
import fonts from "kui/fonts"

const ValueLabel = styled(Text)({
  fontFamily: fonts.montserrat,
  color: colors.white,
  fontSize: 28,
  lineHeight: 36
})
const TextLabel = styled(Text)({
  fontFamily: fonts.montserrat,
  color: colors.blue20,
  fontSize: 10,
  lineHeight: 16,
  paddingTop: 4
})

const Total = props => {
  const { totalVolume, totalSteps, weightUnit } = props

  return (
    <Row>
      <View flex={1}>
        <ValueLabel>{numeral(totalVolume).format("0,0") + " " + weightUnit}</ValueLabel>
        <TextLabel>TOTAL WEEK VOLUME</TextLabel>
      </View>
      <View flex={1}>
        <ValueLabel>{numeral(totalSteps).format("0,0")}</ValueLabel>
        <TextLabel>TOTAL WEEK STEPS</TextLabel>
      </View>
    </Row>
  )
}

const enhance = compose(
  withSettings,
  withWeeklyTrainingStats,
  withErrorHandler,
  withLoader({ color: colors.white, operationName: "WeeklyTrainingStats" }),
  withProps(props => {
    return {
      totalVolume: props.weightConverter(
        _.getOr(0, "data.currentMember.weeklyTrainingStat.volume", props)
      ),
      totalSteps: _.getOr(0, "data.currentMember.weeklyTrainingStat.steps", props),
      totalDistance: _.getOr(0, "data.currentMember.weeklyTrainingStat.distance", props),
      totalCalories: _.getOr(0, "data.currentMember.weeklyTrainingStat.calories", props)
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (this.props.refresh !== prevProps.refresh) {
        this.props.data.refetch()
      }
    }
  })
)

export default enhance(Total)
