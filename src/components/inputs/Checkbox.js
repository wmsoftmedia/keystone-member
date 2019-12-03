import { TouchableOpacity, View } from "glamorous-native"
import MIcons from "react-native-vector-icons/MaterialIcons"
import React from "react"

import colors from "../../colors"

const Checkbox = props => {
  const { selected, onPress, checkboxProps, ...rest } = props

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      padding={5}
      onPress={onPress}
      {...rest}
    >
      <View
        backgroundColor={selected ? colors.primary2 : "transparent"}
        borderWidth={2}
        borderColor={selected ? colors.primary2 : colors.black24}
        {...checkboxProps}
      >
        <MIcons
          name={"check"}
          size={20}
          color={selected ? colors.white : colors.black24}
        />
      </View>
    </TouchableOpacity>
  )
}

export default Checkbox
