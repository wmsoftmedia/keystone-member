import { TouchableOpacity } from "glamorous-native"
import { View } from "glamorous-native"
import React from "react"

import Text from "kui/components/Text"
import colors from "kui/colors"

const COLORS = [colors.blue50, colors.turquoise60, colors.green50]

const RadioButtonList = ({ values = [], value, onChange, colorScheme = COLORS }) => {
  return (
    <View>
      {values.map((v, index) => (
        <TouchableOpacity
          key={index}
          backgroundColor={
            value && value.toLowerCase() === v.toLowerCase()
              ? colorScheme.length < index + 1
                ? colorScheme[0]
                : colorScheme[index]
              : colors.darkBlue90
          }
          borderRadius={8}
          paddingVertical={14}
          paddingHorizontal={24}
          marginTop={14}
          onPress={() => onChange(v)}
        >
          <Text variant="h2">{v}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default RadioButtonList
