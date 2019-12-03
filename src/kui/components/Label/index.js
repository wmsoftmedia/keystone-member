import { View, Text } from "glamorous-native"
import React from "react"

import colors from "kui/colors"
import fonts from "kui/fonts"

const DEFAULT_VARIANT = "future"

const variantMap = {
  future: { bgColor: colors.darkBlue80, textColor: colors.white },
  foodSource: { bgColor: colors.green70, textColor: colors.white },
  foodProvider: { bgColor: colors.darkBlue80, textColor: colors.white },
  active: { bgColor: colors.turquoise60, textColor: colors.white },
  completed: { bgColor: colors.green50, textColor: colors.white },
  hard: { bgColor: colors.red50, textColor: colors.white },
  medium: { bgColor: colors.orange50, textColor: colors.white }
}

const Label = ({ variant, text, ...rest }) => {
  const _variant = variantMap[variant] || variantMap[DEFAULT_VARIANT]
  return (
    !!text && (
      <View
        paddingVertical={4}
        paddingHorizontal={12}
        borderRadius={4}
        backgroundColor={_variant.bgColor}
        minWidth={76}
        alignItems="center"
        {...rest}
      >
        <Text
          fontFamily={fonts.montserrat}
          fontSize={12}
          lineHeight={16}
          color={_variant.textColor}
        >
          {text}
        </Text>
      </View>
    )
  )
}

export default Label
