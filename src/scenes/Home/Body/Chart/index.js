import { View } from "glamorous-native"
import { compose, withProps, withState } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"
import numeral from "numeral"
import _ from "lodash/fp"

import { EditThinIcon } from "kui/icons"
import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { METRIC_TYPES, metricDisplay } from "scenes/Home/Body/display"
import { FloatButton } from "kui/components/Button"
import { Screen } from "components/Background"
import { Switch } from "kui/components/Switch"
import { routes } from "navigation/routes"
import { withLoader } from "hoc/withLoader"
import Chart from "scenes/Home/Body/Chart/Chart"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withChartData from "graphql/query/body/byInterval"
import withMetricConverter from "scenes/Home/Body/withMetricConverter"

const RANGES = [7, 14, 30, 60]

const MetricChart = ({
  metricKey,
  title,
  trendData,
  selectedRange,
  setSelectedRange,
  hasData,
  displayUnit,
  date,
  navigation
}) => {
  return (
    <Screen flex={1}>
      <View flex={0.25} justifyContent="center">
        {hasData ? (
          <TrendSummary
            interval={selectedRange}
            trendData={trendData}
            measure={displayUnit}
            label={title}
            metricKey={metricKey}
          />
        ) : (
          <NoData />
        )}
      </View>
      <View flex={0.75}>
        <Chart selectedTrend={metricKey} data={trendData} />
        <View bottom={20} left={20} right={20} position={"absolute"}>
          <Switch
            values={RANGES.map(r => r + " DAYS")}
            value={RANGES.findIndex(x => x === selectedRange)}
            onChange={i => setSelectedRange(RANGES[i])}
          />
        </View>
      </View>
      <FloatButton
        position="absolute"
        right={24}
        bottom={84}
        onPress={() =>
          navigation.navigate(routes.BodyDataEntry, {
            metricKey,
            date
          })
        }
        elevation={5}
      >
        <EditThinIcon size={30} />
      </FloatButton>
    </Screen>
  )
}

const TrendSummary = props => {
  const { trendData, interval, measure, label, metricKey } = props
  const min = _.minBy("date", trendData)
  const max = _.maxBy("date", trendData)
  const delta = max.value - min.value
  const deltaPrefix =
    delta > 0 ? "You've gained" : delta < 0 ? "You've lost" : "No change"
  const formattedDelta = numeral(delta * Math.sign(delta)).format("0.[0]") + " " + measure
  const aboutMetric = metricDisplay({ key: metricKey })

  return (
    <View alignItems="center">
      {(aboutMetric.type === METRIC_TYPES.WEIGHT ||
        aboutMetric.type === METRIC_TYPES.LENGTH) && (
        <Text variant="body2" paddingBottom={8}>
          {deltaPrefix} {delta === 0 ? "" : formattedDelta}
        </Text>
      )}
      <Text variant="caption1" color={colors.darkBlue30}>
        {label} in the last {interval} days.
      </Text>
    </View>
  )
}

const NoData = () => (
  <View alignItems="center">
    <Text variant="body2" paddingBottom={8}>
      No data to show.
    </Text>
    <Text variant="caption1" color={colors.darkBlue30}>
      With regular tracking, you can
    </Text>
    <Text variant="caption1" color={colors.darkBlue30}>
      see your progress trends here.
    </Text>
  </View>
)

const enhance = compose(
  withNavigation,
  withState("selectedRange", "setSelectedRange", RANGES[2]),
  withProps(({ selectedRange }) => ({
    startDate: moment()
      .subtract(selectedRange - 1, "days")
      .format(DATE_FORMAT_GRAPHQL),
    endDate: moment().format(DATE_FORMAT_GRAPHQL)
  })),
  withChartData,
  withMetricConverter,
  withLoader({ message: "Loading Your Data..." }),
  withProps(({ metricByInterval, converter }) => ({
    trendData: metricByInterval
      ? metricByInterval
          .filter(m => m.value !== 0)
          .map(m => ({
            value: m.value ? converter(m.value) : m.value,
            date: moment(m.date)
          }))
      : []
  })),
  withProps(({ trendData }) => ({ hasData: trendData && trendData.length > 0 }))
)

export default enhance(MetricChart)
