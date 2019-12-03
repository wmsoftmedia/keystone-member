import { View } from "glamorous-native"
import React from "react"

import { InputRowText } from "kui/components/Input"
import Text from "kui/components/Text"
import colors from "kui/colors"

const MeasurementField = props => {
  const { onChange, value, measurement, focused, onFocus, onBlur } = props
  return (
    <View>
      <InputRowText
        label={measurement.label}
        inputProps={{
          maxLength: 6,
          keyboardType: "numeric",
          value,
          onChange,
          onFocus,
          onBlur,
          selectTextOnFocus: true,
          focused
        }}
        renderSuffix={() => (
          <Text
            marginLeft={12}
            minWidth={30}
            color={colors.white}
            fontSize={12}
            lineHeight={16}
          >
            {measurement.measure}
          </Text>
        )}
      />
    </View>
  )
}

export default MeasurementField
