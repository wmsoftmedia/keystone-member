import { LayoutAnimation } from "react-native"
import { View } from "glamorous-native"
import { compose, lifecycle, withProps } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { getOr } from "keystone"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import Line from "kui/components/Line"
import Steps from "components/Steps"
import WeekTotal from "scenes/Home/Training/Overview/WeekTotal"
import colors from "kui/colors"
import stepsByDate from "graphql/query/steps/byDate"

const TrainingOverview = props => {
  const { date, steps, refresh } = props
  return (
    <View>
      <View paddingHorizontal={20}>
        <Steps date={date} steps={steps} showIcon />
      </View>
      <Line marginVertical={16} color={colors.darkBlue60} />
      <View paddingHorizontal={20} height={56}>
        <WeekTotal date={date} refresh={refresh} />
      </View>
    </View>
  )
}

const withData = compose(stepsByDate)

const dataKeys = ["stepsByDate"]

const screen = compose(
  withNavigation,
  withData,
  withExtendedErrorHandler({ dataKeys }),
  withLoader({
    color: colors.white,
    message: "Loading...",
    dataKeys
  }),
  lifecycle({
    componentWillMount() {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }
  }),
  withProps(props => {
    const steps = getOr(
      null,
      "stepsByDate.currentMember.stepsByDate.nodes[0].value",
      props
    )
    return { steps }
  })
)

export default screen(TrainingOverview)
