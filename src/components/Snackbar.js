import { View } from "glamorous-native"
import React from "react"

import { withAnimation } from "../hoc"

const Snackbar = ({ children, render, ...rest }) => (
  <View position="absolute" left={0} right={0} bottom={0} {...rest}>
    {render ? render() : children}
  </View>
)

export default withAnimation({ onUpdate: false, onUnmount: true })(Snackbar)
