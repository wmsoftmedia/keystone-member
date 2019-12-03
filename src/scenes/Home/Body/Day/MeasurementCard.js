import { TouchableOpacity, View } from "glamorous-native"
import { compose } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"
import numeral from "numeral"

import { AddIcon, ProgressIcon } from "kui/icons"
import { COMPLEX_PARTS, metricDisplay } from "scenes/Home/Body/display"
import { IconButton } from "kui/components/Button"
import { Row } from "kui/components"
import { routes } from "navigation/routes"
import { withMetricConverter } from "scenes/Home/Body/withMetricConverter"
import Text from "kui/components/Text"
import colors, { gradients } from "kui/colors"

export const MeasurementCard = ({
  metricKey,
  value,
  date,
  navigation,
  isComplex,
  displayUnit,
  converter
}) => {
  const aboutMetric = metricDisplay({ key: metricKey })

  const displayValue = isComplex
    ? value
      ? COMPLEX_PARTS[metricKey].reduce((acc, key) => acc + +value[key], 0)
      : null
    : value

  const convertedValue = displayValue ? converter(displayValue) : displayValue

  return (
    <TouchableOpacity
      flex={1}
      paddingTop={16}
      paddingHorizontal={12}
      backgroundColor={convertedValue ? colors.darkBlue90 : gradients.bg[1]}
      borderRadius={12}
      alignItems="center"
      justifyContent="space-between"
      elevation={10}
      shadowOpacity={0.3}
      shadowColor={colors.black}
      shadowOffset={{ width: 5, height: 5 }}
      shadowRadius={15}
      onPress={() =>
        convertedValue
          ? navigation.navigate(routes.BodyChart, {
              title: aboutMetric.fullLabel || aboutMetric.label,
              measurement: aboutMetric.dbKey,
              metricKey,
              date
            })
          : null
      }
      activeOpacity={convertedValue ? 0.2 : 1}
    >
      <Text variant="body2" fontSize={14} textAlign="center">
        {aboutMetric.label}
      </Text>
      {convertedValue ? (
        <View alignItems="center" justifyContent="flex-end" paddingBottom={16}>
          <Text variant="h1" fontSize={22} lineHeight={28} paddingBottom={14}>
            {numeral(convertedValue).format("0.[0]")} {displayUnit}
          </Text>
          <Text variant="caption1" color={colors.darkBlue30}>
            {date === moment().format("YYYY-MM-DD")
              ? "Today"
              : moment(date).format("MMM D, YYYY")}
          </Text>
        </View>
      ) : (
        <View alignItems="center" justifyContent="flex-end">
          <Text
            variant="caption1"
            fontSize={10}
            textAlign="center"
            color={colors.darkBlue30}
          >
            No data
          </Text>
          <Row centerY spread>
            <IconButton
              onPress={() =>
                navigation.navigate(routes.BodyDataEntry, {
                  metricKey,
                  date
                })
              }
            >
              <AddIcon size={40} />
            </IconButton>
            <IconButton
              onPress={() =>
                navigation.navigate(routes.BodyChart, {
                  title: aboutMetric.fullLabel || aboutMetric.label,
                  measurement: aboutMetric.dbKey,
                  metricKey,
                  date
                })
              }
            >
              <ProgressIcon size={40} />
            </IconButton>
          </Row>
        </View>
      )}
    </TouchableOpacity>
  )
}

const enhance = compose(
  withMetricConverter,
  withNavigation
)

export default enhance(MeasurementCard)
