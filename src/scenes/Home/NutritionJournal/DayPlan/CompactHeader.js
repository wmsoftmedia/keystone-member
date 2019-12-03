import { View } from "glamorous-native"
import React from "react"
import numeral from "numeral"
import _ from "lodash/fp"

import { Row } from "kui/components"
import { SOURCES, sourceToColor } from "scenes/Home/NutritionJournal/journal"
import Text from "kui/components/Text"
import colors from "kui/colors"

const CompactHeader = ({ target, consumed }) => {
  const hasAllTargets =
    !!target.protein || !!target.fat || !!target.carbs || !!target.vegetables

  return (
    <Row flexWrap="wrap" flex={1}>
      {SOURCES.map(s => {
        const isOverTarget =
          hasAllTargets &&
          ((target[s.toLowerCase()] && consumed[s] > target[s.toLowerCase()]) ||
            (!target[s.toLowerCase()] && consumed[s] > 0))
        const sourceTarget = target[s.toLowerCase()] || 0

        return (
          (!!sourceTarget || !!consumed[s]) && (
            <View key={s} width="50%" paddingVertical={8} paddingHorizontal={4}>
              <View
                height={12}
                width="100%"
                backgroundColor={colors.darkBlue90}
                borderRadius={2}
              >
                <View
                  flex={1}
                  backgroundColor={isOverTarget ? colors.red50 : sourceToColor(s)}
                  borderRadius={2}
                  width={
                    isOverTarget || !hasAllTargets
                      ? "100%"
                      : `${Math.round((consumed[s] / sourceTarget) * 100)}%`
                  }
                />
              </View>
              <Row centerY spread paddingTop={4}>
                <Text variant="caption1" opacity={0.6}>
                  {_.capitalize(s)}
                </Text>
                <Text
                  variant="caption1"
                  color={isOverTarget ? colors.red50 : colors.darkBlue70}
                >
                  <Text color={isOverTarget ? colors.red50 : sourceToColor(s)}>
                    {numeral(consumed[s]).format("0.[00]")}
                  </Text>
                  {hasAllTargets ? "/" + sourceTarget : ""}
                </Text>
              </Row>
            </View>
          )
        )
      })}
    </Row>
  )
}

export default CompactHeader
