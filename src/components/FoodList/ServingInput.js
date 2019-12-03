import React from "react"
import styled from "glamorous-native"

import TextInput from "components/inputs/TextInput"
import colors from "colors"

const ServingInput = styled(p => (
  <TextInput
    light
    keyboardType="numeric"
    maxLength={5}
    returnKeyType="done"
    selectTextOnFocus
    selectionColor={colors.primary1}
    minWidth={60}
    paddingHorizontal={2}
    {...p}
  />
))({
  textAlign: "center",
  fontSize: 16,
  fontWeight: "500",
  backgroundColor: colors.black12
})

export default ServingInput
