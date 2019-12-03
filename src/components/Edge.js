import React from "react"
import styled, { View } from "glamorous-native"

import colors from "../colors"

export const edgeStyle = {
  width: "100%",
  height: 2
}

export const topStyle = {
  ...edgeStyle,
  backgroundColor: colors.black,
  opacity: 0.15
}

export const bottomStyle = {
  ...edgeStyle,
  backgroundColor: colors.black24,
  opacity: 0.2
}

export const EdgeTop = styled(p => <View {...p} />)(topStyle)

export const EdgeBottom = styled(p => <View {...p} />)(bottomStyle)

export default {
  topStyle,
  bottomStyle
}
