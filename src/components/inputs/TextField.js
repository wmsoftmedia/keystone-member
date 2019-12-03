import React from "react"
import styled, { Text, View } from "glamorous-native"

import TextInput from "./TextInput"
import colors from "../../colors"

const Container = styled(p => <View {...p} />)({
  paddingVertical: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.white
})

const Label = styled(p => <Text {...p} />)({
  flex: 1,
  color: colors.textLight,
  fontSize: 18,
  //fontWeight: "700",
  paddingLeft: 10
})

const InputContainer = styled(p => <View {...p} />)({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: 5
})

const Adornment = styled(p => <Text {...p} />)({
  color: colors.textLight,
  fontSize: 16,
  //fontWeight: "500",
  width: 40,
  textAlign: "center",
  paddingHorizontal: 5
})

const TextField = ({
  onChange,
  value,
  label,
  adornmentLabel,
  inputProps,
  ...rest
}) => {
  return (
    <Container {...rest}>
      <Label>{label}</Label>
      <InputContainer>
        <TextInput
          light
          input={{ onChange, value }}
          fontSize={22}
          maxLength={6}
          textAlign="center"
          selectTextOnFocus
          paddingHorizontal={2}
          value={value}
          {...inputProps}
        />
        <Adornment>{adornmentLabel.toUpperCase()}</Adornment>
      </InputContainer>
    </Container>
  )
}

export default TextField
