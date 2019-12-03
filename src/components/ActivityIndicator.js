import { ActivityIndicator } from "react-native"
import React from "react"
import styled from "glamorous-native"

import colors from "../colors"

const DefaultActivityIndicator = props => (
  <ActivityIndicator color={colors.white} {...props} />
)

export default styled(DefaultActivityIndicator)({ paddingHorizontal: 5 })
