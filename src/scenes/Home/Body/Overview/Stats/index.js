import { View } from "glamorous-native"
import { compose } from "recompose"
import React from "react"

import { DASHBOARD_KEYS } from "scenes/Home/Body/display"
import { Row } from "kui/components"
import { withErrorHandler, withLoader } from "hoc"
import Metric from "scenes/Home/Body/Overview/Stats/Metric"
import colors from "kui/colors"
import withLastMetrics from "graphql/query/body/lastMetricsByDate"

const Overview = ({ lastMetrics, date }) => {
  return (
    <Row flex={1} flexWrap="wrap" paddingBottom={20}>
      {DASHBOARD_KEYS.map(k => {
        const metric = lastMetrics && lastMetrics[k] ? lastMetrics[k] : {}
        return (
          <View key={k} width="50%" paddingTop={4}>
            <Metric metricKey={k} {...metric} selectedDate={date} />
          </View>
        )
      })}
    </Row>
  )
}

const enhance = compose(
  withLastMetrics,
  withErrorHandler,
  withLoader({ color: colors.white })
)

export default enhance(Overview)
