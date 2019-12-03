import React from "react"
import numeral from "numeral"

import { DASHBOARD_KEYS, metricDisplay } from "scenes/Home/Body/display"
import { Row } from "kui/components"
import { withMetricConverter } from "scenes/Home/Body/withMetricConverter"
import Text from "kui/components/Text"
import colors from "kui/colors"

const Metric = ({ value, metricKey, displayUnit, converter }) => {
  const aboutMetric = metricDisplay({ key: metricKey })
  const convertedValue = value ? converter(value) : value

  if (!convertedValue && !DASHBOARD_KEYS.includes(metricKey)) return null

  return (
    <Row width="50%" centerY paddingVertical={8} flexWrap="wrap" paddingHorizontal={2}>
      <Text variant="body2" paddingRight={4} fontSize={12} lineHeight={13}>
        {convertedValue
          ? numeral(convertedValue).format("0.[0]") + " " + displayUnit
          : "--"}
      </Text>
      <Text variant="caption2" color={colors.darkBlue20} fontSize={9} lineHeight={14}>
        {aboutMetric.label.toUpperCase()}
      </Text>
    </Row>
  )
}

export default withMetricConverter(Metric)
