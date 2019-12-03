import { View } from "glamorous-native"
import { connect } from "react-redux"
import { withProps, compose } from "recompose"
import React from "react"
import moment from "moment"

import { Screen } from "components/Background"
import { getOr, isToday } from "keystone"
import { setSwitch } from "components/Switch/actions"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader, withMemberId } from "hoc"
import Chart from "scenes/Home/Training/StepTracker/Chart"
import StepForm from "scenes/Home/Training/StepTracker/StepForm"
import _ from "lodash/fp"
import colors from "kui/colors"
import stepsByDate from "graphql/query/steps/byDate"
import trendQuery from "graphql/query/steps/latestTrend"

const dataKeys = ["stepsTrend", "stepsByDate"]
const DEFAULT_INTERVAL = 7

const withData = compose(
  stepsByDate,
  trendQuery
)

const mapStateToProps = state => ({
  interval: state.ui.switches.stepTrendInterval || DEFAULT_INTERVAL
})

const mapDispatchToProps = dispatch => ({
  setInterval: i => dispatch(setSwitch("stepTrendInterval")(i))
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withMemberId,
  withData,
  withExtendedErrorHandler({ dataKeys }),
  withLoader({
    color: colors.white,
    message: "Loading steps...",
    dataKeys
  }),
  withProps(props => {
    const data = getOr([], "stepsTrend.allMemberMetrics.nodes", props)
    const steps = getOr(
      null,
      "stepsByDate.currentMember.stepsByDate.nodes[0].value",
      props
    )
    const hasData = data && data.length >= 1

    const chartData = hasData
      ? _.rangeRight(0, props.interval).map(i => {
          const date = moment()
            .subtract(i, "days")
            .format("YYYY-MM-DD")
          const datum = data.filter(d => d.date === date)
          return datum.length === 0
            ? {
                date,
                value: 0
              }
            : datum[0]
        })
      : []

    return {
      steps,
      chartData,
      canCopyData: isToday(props.date) && props.mobileSteps > 0
    }
  })
)

export default enhance(props => {
  return (
    <Screen>
      <View justifyContent="flex-end" height={124}>
        <StepForm {...props} />
      </View>

      <View flex={1}>
        <Chart
          onRangePress={props.setInterval}
          selectedRange={props.interval}
          data={props.chartData}
          selectedDate={props.date}
        />
      </View>
    </Screen>
  )
})
