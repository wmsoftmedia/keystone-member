import React from "react"
import styled, { TextInput as RNTextInput } from "glamorous-native"

import { fontL } from "../../Typography"
import { scaleFont, verticalScale } from "../../../scalingUnits"
import colors from "../../../colors"

const Input = styled(p => <RNTextInput {...p} />)(
  {
    paddingHorizontal: 8,
    borderWidth: 1,
    fontSize: scaleFont(fontL),
    //fontWeight: "600",
    minWidth: 60,
    height: verticalScale(40)
  },
  ({ value, light, focused, enabled }) => ({
    color: light ? colors.textLight : colors.white,
    backgroundColor: light ? colors.black6 : colors.white10,
    borderRadius: 8,
    borderColor: light
      ? focused
        ? colors.textLight
        : colors.black24
      : value === ""
        ? colors.primary3
        : colors.primary4
  })
)

const TextInput = ({ input, label, style, light, onChange, ...rest }) => {
  return (
    <Input
      clearButtonMode="while-editing"
      placeholderTextColor={colors.white50}
      underlineColorAndroid="transparent"
      placeholder={label}
      returnKeyType="done"
      autoCorrect={false}
      autoCapitalize="none"
      onChangeText={input ? input.onChange : onChange}
      style={style}
      light={light}
      {...rest}
    />
  )
}

export default TextInput
