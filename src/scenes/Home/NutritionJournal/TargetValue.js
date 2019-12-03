import { View } from "glamorous-native"
import React from "react"
import numeral from "numeral"
import _ from "lodash/fp"

import { sourceToColor } from "scenes/Home/NutritionJournal/journal"
import Text from "kui/components/Text"
import colors from "kui/colors"

const TargetValue = ({
  target = 0,
  hasAllTargets = true,
  consumed = 0,
  source,
  ...rest
}) => {
  return target > 0 || consumed >= 0 ? (
    <View minWidth={72} opacity={consumed > 0 ? 1 : 0.4} {...rest}>
      <Text
        variant="h1"
        fontSize={22}
        lineHeight={28}
        color={consumed > target && hasAllTargets ? colors.red50 : colors.darkBlue70}
        paddingBottom={4}
      >
        <Text
          color={
            consumed > target && hasAllTargets ? colors.red50 : sourceToColor(source)
          }
        >
          {numeral(consumed).format("0.[00]")}
        </Text>
        {hasAllTargets ? "/" + target : ""}
      </Text>
      <Text variant="caption1" opacity={0.6}>
        {!!source && _.startCase(source.toLowerCase())}
      </Text>
    </View>
  ) : null
}

export default TargetValue
