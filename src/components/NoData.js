import { Text } from "glamorous-native"
import { defaultProps, compose, setPropTypes } from "recompose"
import React from "react"

import CenterView from "components/CenterView"
import Message from "components/Message"
import PropTypes from "prop-types"
import colors from "colors"

const enhanceNoData = compose(
  setPropTypes({
    message: PropTypes.string.isRequired
  }),
  defaultProps({
    message: "No Data."
  })
)

const NoData = props => {
  const { message, color, ...rest } = props
  return (
    <CenterView {...rest}>
      <Text color={color || colors.textLight} textAlign={"center"} fontSize={16}>
        {message}
      </Text>
    </CenterView>
  )
}

export default enhanceNoData(NoData)

const enhanceNotFound = compose(
  setPropTypes({
    message: PropTypes.string.isRequired
  })
)

export const NotFound = enhanceNotFound(props => {
  const { message, ...rest } = props
  return (
    <CenterView {...rest}>
      <Message fontSize={24} paddingBottom={12}>
        {message}
      </Message>
    </CenterView>
  )
})
