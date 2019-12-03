import { View } from "glamorous-native"
import { PieChart } from "react-native-svg-charts"
import React from "react"
import numeral from "numeral"

import { SOURCES, sourceToColor } from "scenes/Home/NutritionJournal/journal"
import Text from "kui/components/Text"
import colors from "kui/colors"

const TargetChart = ({
  dayStat,
  target,
  diameter = 160,
  width = 22,
  backgroundColor = colors.darkBlue90,
  withTotal = true
}) => {
  const hasAllTargets =
    !!target.protein || !!target.fat || !!target.carbs || !!target.vegetables
  const maxPortions = SOURCES.map(s => s.toLowerCase()).reduce(
    (sum, s) => sum + (target[s] ? target[s] : 0),
    0
  )
  const consumedPortions = SOURCES.reduce(
    (sum, s) => sum + (dayStat[s] ? dayStat[s] : 0),
    0
  )

  const data = SOURCES.map(s => ({
    source: s,
    value: dayStat[s],
    isOverTarget:
      hasAllTargets &&
      ((target[s.toLowerCase()] && dayStat[s] > target[s.toLowerCase()]) ||
        (!target[s.toLowerCase()] && dayStat[s] > 0))
  }))

  const pieData = data.map(d => ({
    value: d.value,
    svg: { fill: d.isOverTarget ? colors.red50 : sourceToColor(d.source) },
    key: `pie-${d.source}`
  }))

  return (
    <View>
      <View
        position="absolute"
        height={diameter}
        width={diameter}
        borderWidth={width}
        borderRadius={diameter / 2}
        borderColor={backgroundColor}
        alignItems="center"
        justifyContent="center"
        padding={10}
      >
        {withTotal && (
          <View alignItems="center">
            <Text
              variant="h1"
              color={
                hasAllTargets && maxPortions < consumedPortions
                  ? colors.red50
                  : colors.white
              }
            >
              {numeral(consumedPortions).format("0.[0]")}
              {hasAllTargets && (
                <Text
                  color={
                    maxPortions < consumedPortions ? colors.red50 : colors.darkBlue40
                  }
                >
                  /{maxPortions}
                </Text>
              )}
            </Text>
            <Text variant="caption2" color={colors.blue20} textAlign="center">
              DAILY TOTAL {hasAllTargets && "TARGET"}
            </Text>
          </View>
        )}
      </View>
      <PieChart
        style={{ height: diameter, width: diameter }}
        outerRadius={diameter / 2}
        innerRadius={diameter / 2 - width}
        endAngle={
          Math.PI *
          2 *
          (hasAllTargets
            ? consumedPortions < maxPortions
              ? consumedPortions / maxPortions
              : 1
            : 1)
        }
        padAngle={0.04}
        data={pieData}
        sort={() => 0}
      />
    </View>
  )
}

export default TargetChart
