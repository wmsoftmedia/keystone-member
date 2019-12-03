import { Control } from "react-redux-form/native"
import React from "react"
import styled, { TextInput, View } from "glamorous-native"

import IncrementalInput from "components/inputs/IncrementalInput"
import colors from "kui/colors"
import fonts from "kui/fonts"

const LabelBottom = styled.text({
  color: colors.white50,
  fontSize: 14,
  textAlign: "center",
  position: "absolute",
  bottom: -4,
  left: 0,
  right: 0
})

const inputConfig = {
  returnKeyType: "done",
  keyboardAppearance: "dark",
  keyboardType: "numeric",
  textAlign: "center",
  selectionColor: colors.white50,
  placeholder: "--",
  placeholderTextColor: colors.white10,
  selectTextOnFocus: true,
  underlineColorAndroid: colors.transparent
}
const Input = styled(p => <TextInput {...inputConfig} {...p} />)({
  height: 36,
  color: colors.white,
  fontSize: 22,
  fontFamily: fonts.montserrat
})

const inputField = ({ onChange, value, label }) => (
  <View flex={1}>
    <LabelBottom>{label}</LabelBottom>
    <Input onChangeText={onChange} value={value} />
  </View>
)

export default ({ model, label, step, placeholder, ...rest }) => (
  <Control
    model={model}
    component={IncrementalInput}
    label={label}
    onUp={v => (parseFloat(v) || 0) + step}
    onDown={v => Math.max(0, (parseFloat(v) || 0) - step)}
    inputProps={{ placeholder: placeholder }}
    renderProps={inputField}
    {...rest}
  />
)
