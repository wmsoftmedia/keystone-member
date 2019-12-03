import { compose } from "recompose"
import React from "react"
import styled, { Text } from "glamorous-native"

import PropTypes from "prop-types"

import { scaleFont } from "../../scalingUnits"
import { titleCase } from "../../../lib/keystone"
import colors from "../../colors"

const upperCaseNode = node => (typeof node === "string" ? node.toUpperCase() : node)

const titleCaseNode = node => (typeof node === "string" ? titleCase(node) : node)

const upperCaseTransformer = predicate => node => (predicate ? upperCaseNode(node) : node)
const titleCaseTransformer = predicate => node => (predicate ? titleCaseNode(node) : node)

const TextBase = ({ children, upperCase, titleCase, ...rest }) => {
  const childTransformer = compose(
    upperCaseTransformer(upperCase),
    titleCaseTransformer(titleCase)
  )
  return <Text {...rest}>{React.Children.map(children, childTransformer)}</Text>
}

TextBase.defaultProps = {
  upperCase: false,
  titleCase: false,
  allowFontScaling: false
}

TextBase.propTypes = {
  upperCase: PropTypes.bool.isRequired,
  titleCase: PropTypes.bool.isRequired,
  style: PropTypes.any
}

const SIZE_SCALE = 0.6

export const fontXXXXL = 52 * SIZE_SCALE
export const fontXXXL = 42 * SIZE_SCALE
export const fontXXL = 38 * SIZE_SCALE
export const fontXL = 26 * SIZE_SCALE
export const fontL = 18 * SIZE_SCALE
export const fontM = 17 * SIZE_SCALE
export const fontS = 16 * SIZE_SCALE
export const fontXS = 12 * SIZE_SCALE

// Headers
const H1 = styled(TextBase)({
  fontSize: scaleFont(fontXXL),
  color: colors.white
})

const H2 = styled(TextBase)({
  fontSize: scaleFont(fontXL),
  color: colors.white
})
const H3 = styled(TextBase)({
  fontSize: scaleFont(fontM),
  color: colors.white
})
const H4 = styled(props => <TextBase upperCase {...props} />)({
  fontSize: scaleFont(fontM)
})
const H5 = styled(TextBase)({ fontSize: scaleFont(fontS) })

// Paragraph
const P = props => <TextBase fontSize={scaleFont(fontXS)} {...props} />

export { H1, H2, H3, H4, H5, P }
