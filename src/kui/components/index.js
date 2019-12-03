import { View } from "glamorous-native"
import { compose, defaultProps, setPropTypes } from "recompose"
import React from "react"

import PropTypes from "prop-types"

export const Row = compose(
  setPropTypes({
    centerX: PropTypes.bool,
    centerY: PropTypes.bool,
    centerXY: PropTypes.bool,
    spread: PropTypes.bool
  }),
  defaultProps({ centerX: false, centerY: false, centerXY: false, spread: false })
)(props => {
  const { centerXY, centerX, centerY, spread, ...rest } = props
  const X = {
    justifyContent: centerX ? "center" : spread ? "space-between" : "flex-start"
  }
  const Y = centerY ? { alignItems: "center" } : {}
  const XY = centerXY ? { justifyContent: "center", alignItems: "center" } : {}
  return <View {...X} {...Y} {...XY} {...rest} flexDirection="row" />
})
