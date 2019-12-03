import { View } from "glamorous-native"
import React from "react"
import moment from "moment"
import numeral from "numeral"

import { DownIcon, UpIcon } from "kui/icons"
import { Row } from "kui/components"
import { metricDisplay } from "scenes/Home/Body/display"
import { withLoader } from "hoc"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withMetricConverter from "scenes/Home/Body/withMetricConverter"

const Metric = ({
  value,
  metricKey,
  displayUnit,
  converter,
  delta,
  date,
  selectedDate
}) => {
  const aboutMetric = metricDisplay({ key: metricKey })
  const convertedValue = value ? converter(value) : value

  return (
    <View flex={1} paddingVertical={8} opacity={selectedDate === date ? 1 : 0.7}>
      <View paddingBottom={4}>
        {delta ? (
          <Row>
            {delta > 0 ? (
              <UpIcon size={16} color={colors.darkBlue30} />
            ) : (
              <DownIcon size={16} color={colors.darkBlue30} />
            )}
            <Text variant="body2" color={colors.white50} paddingLeft={4} fontSize={12}>
              {numeral(delta).format("+0.[0]")}
            </Text>
          </Row>
        ) : delta === 0 && +value > 0 ? (
          <Icon name="trending-neutral" size={22} color={colors.darkBlue30} />
        ) : null}
      </View>
      <Row centerY flexWrap="wrap" width="100%">
        <Text variant="body2" paddingRight={4}>
          {convertedValue
            ? numeral(convertedValue).format("0.[0]") + " " + displayUnit
            : "--"}
        </Text>
        <Text variant="caption2" fontSize={9} lineHeight={14} color={colors.darkBlue20}>
          {(aboutMetric.shortLabel || aboutMetric.label).toUpperCase()}
        </Text>
      </Row>
      <Text variant="caption2" opacity={0.5}>
        {selectedDate === date && date === moment().format("YYYY-MM-DD")
          ? "Today"
          : convertedValue
          ? moment(date).format("D MMM 'YY")
          : ""}
      </Text>
    </View>
  )
}

export default withLoader({ color: colors.white })(withMetricConverter(Metric))
