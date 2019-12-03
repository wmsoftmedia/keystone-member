import { View } from "glamorous-native"
import React from "react"

const CenterView = ({ children, ...rest }) => (
  <View flex={1} alignItems="center" justifyContent="center" {...rest}>
    {children}
  </View>
)

export default CenterView
