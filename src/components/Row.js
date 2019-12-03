import { View } from "glamorous-native"
import React from "react"

const Row = ({ children, ...rest }) => (
  <View alignItems="center" flexDirection={"row"} {...rest}>
    {children}
  </View>
)

export default Row
