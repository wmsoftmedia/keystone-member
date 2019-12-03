import { View } from "glamorous-native"
import React from "react"

import colors from "kui/colors"

const Line = ({ color = colors.white10, ...rest }) => (
  <View
    maxWidth="100%"
    marginHorizontal={20}
    backgroundColor={color}
    height={1}
    {...rest}
  />
)

export default Line
