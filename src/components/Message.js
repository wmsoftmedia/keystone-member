import React from "react"
import { Text } from "glamorous-native"
import colors from "colors"

const Message = props => {
  const { color = colors.black48, ...rest } = props
  return <Text color={color} padding={24} textAlign="center" {...rest} />
}

export default Message
