// packages
import React from "react"
import { compose, defaultProps, withProps, withHandlers } from "recompose"
import styled, { View } from "glamorous-native"
// project components
import colors from "colors"
import { scaleFont, verticalScale } from "scalingUnits"
import { fontL } from "components/Typography"
import { InvertedClearIcon } from "scenes/Home/Icons"

const colorScheme = {
  light: {
    color: colors.textLight,
    backgroundColor: colors.black6
  },
  dark: {
    color: colors.white,
    backgroundColor: colors.transparent
  }
}

const Input = styled.textInput(
  {
    paddingHorizontal: 8,
    fontSize: scaleFont(fontL),
    minWidth: 60,
    height: verticalScale(40)
  },
  props => (props.light ? colorScheme.light : colorScheme.dark)
)

const ClearButtonContainer = styled.touchableOpacity({
  position: "absolute",
  right: 0,
  height: "100%",
  justifyContent: "center",
  paddingHorizontal: 8,
  opacity: 0.3
})

const getTextValue = value => {
  if (typeof value === "string" || typeof value === "number") {
    return `${value}`
  }

  return ""
}

const enhance = compose(
  defaultProps({
    light: false,
    clearButton: true,
    onChange: () => {},
    onBlur: () => {},
    onFocus: () => {},
    value: "",
    viewValue: ""
  }),
  withProps(props => ({
    showClear: props.clearButton && !!props.value,
    value: getTextValue(props.value || props.viewValue)
  })),
  withHandlers({
    onBlur: props => () => props.onBlur(props.viewValue),
    onChangeText: props => props.onChange,
    onResponderGrant: props => props.onFocus,
    onClear: props => () => props.onChange("")
  })
)

const TextInput = props => (
  <View flex={1} backgroundColor={colors.textInputBgDark}>
    <Input
      placeholderTextColor={colors.white50}
      underlineColorAndroid="transparent"
      returnKeyType="done"
      autoCorrect={false}
      autoCapitalize="none"
      {...props}
    />
    {props.showClear && (
      <ClearButtonContainer onPress={props.onClear}>
        <InvertedClearIcon color={colors.black24} size={18} />
      </ClearButtonContainer>
    )}
  </View>
)

export default enhance(TextInput)
