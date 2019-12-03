import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet } from "react-native"
import { View } from "glamorous-native"
import { setPropTypes } from "recompose"
import React from "react"
import numeral from "numeral"

import { Row } from "kui/components"
import { cals } from "keystone"
import Card from "kui/components/Card"
import Line from "kui/components/Line"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors, { gradients } from "kui/colors"

const formatValue = (value, limit = 9999) =>
  numeral(value).format(value > limit ? "0.[0]a" : "0,0")

const PFCWidget = setPropTypes({
  totals: PropTypes.object.isRequired,
  profile: PropTypes.object
})(props => {
  const { totals, profile } = props

  const calActual = totals.cals
  const calTarget = profile && profile.macros ? cals(profile.macros) : 0

  const proteinTarget = _.getOr(null, "macros.protein", profile)
  const fatTarget = _.getOr(null, "macros.fat", profile)
  const carbsTarget = _.getOr(null, "macros.carbs", profile)
  const hasProfile = profile && profile.label

  return (
    <Card paddingVertical={16} backgroundColor={colors.darkBlue90}>
      <Row centerY paddingHorizontal={20} spread>
        <HorizontalBar
          value={calActual}
          max={hasProfile ? calTarget : Infinity}
          flex={1}
        />
        <Text variant="body1" paddingHorizontal={8}>
          {formatValue(calActual)}
          <Text color={colors.darkBlue40}>
            {(hasProfile ? "/" + formatValue(calTarget) : "") + " cal"}
          </Text>
        </Text>
        <Text variant="caption2" color={colors.blue20}>
          DAILY TOTAL
        </Text>
      </Row>

      <Line marginVertical={12} />

      <Row spread paddingHorizontal={20}>
        <HorizontalBar
          flex={1}
          value={totals.protein || 0}
          max={hasProfile ? proteinTarget : Infinity}
          color={colors.green50}
          withLabelBelow
          label="PROTEIN (G)"
        />
        <HorizontalBar
          flex={1}
          value={totals.fat || 0}
          max={hasProfile ? fatTarget : Infinity}
          color={colors.rose40}
          withLabelBelow
          label="FAT (G)"
          paddingHorizontal={18}
        />
        <HorizontalBar
          flex={1}
          value={totals.carbs || 0}
          max={hasProfile ? carbsTarget : Infinity}
          color={colors.turquoise50}
          withLabelBelow
          label="CARBS (G)"
        />
      </Row>
    </Card>
  )
})

const HorizontalBar = ({
  value,
  max,
  color = colors.blue40,
  withLabelBelow = false,
  label,
  ...rest
}) => {
  const hasProfile = max !== Infinity && max > 0
  const isOverTarget = hasProfile && value > max
  const barWidth = hasProfile ? (value < max ? Math.round((value / max) * 100) : 100) : 0
  const barColor = isOverTarget ? colors.warningRed : color

  return (
    <View {...rest}>
      <View
        height={8}
        backgroundColor={colors.darkBlue80}
        borderRadius={4}
        overflow="hidden"
      >
        <View
          width={barWidth + "%"}
          height={8}
          borderRadius={4}
          backgroundColor={barColor}
        >
          {isOverTarget && (
            <LinearGradient
              colors={gradients.red}
              style={[StyleSheet.absoluteFill, { borderRadius: 4 }]}
              start={[0, 0.5]}
              end={[1, 0.5]}
            />
          )}
        </View>
      </View>
      {withLabelBelow && (
        <View>
          <Text variant="caption1" paddingTop={8}>
            {value + (hasProfile ? "/" + max : "") + " g"}
          </Text>
          <Text variant="caption2" color={colors.blue20}>
            {label}
          </Text>
        </View>
      )}
    </View>
  )
}

export default PFCWidget
