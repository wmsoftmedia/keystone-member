import { Text as NativeText } from "glamorous-native"
import { compose, defaultProps, setPropTypes } from "recompose"
import React from "react"

import PropTypes from "prop-types"
import colors from "kui/colors"
import fonts from "kui/fonts"

const DEFAULT_VARIATION = "default"

const variants = {
  default: {},
  h0: {
    fontSize: 44,
    lineHeight: 52
  },
  h1: {
    fontSize: 28,
    lineHeight: 36
  },
  h2: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 18,
    lineHeight: 28
  },
  body1: {
    fontSize: 15,
    lineHeight: 24
  },
  body2: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 15,
    lineHeight: 16
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16
  },
  caption2: {
    fontSize: 10,
    lineHeight: 16
  },
  button1: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 12,
    lineHeight: 16
  }
}

const Text = ({ variant, children, ...rest }) => {
  const variantStyle = variants[variant] || variants[DEFAULT_VARIATION]

  return (
    <NativeText {...variantStyle} {...rest}>
      {children}
    </NativeText>
  )
}

const enhance = compose(
  setPropTypes({
    variant: PropTypes.oneOf(Object.keys(variants))
  }),
  defaultProps({
    variant: DEFAULT_VARIATION,
    color: colors.white
  })
)

export const B = p => <Text {...p} fontFamily={fonts.montserratSemiBold} />
export const I = p => <Text {...p} fontFamily={fonts.montserratItalic} />

export default enhance(Text)
