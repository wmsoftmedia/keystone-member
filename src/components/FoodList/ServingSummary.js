import React from "react"
import { Text } from "glamorous-native"

import colors from "colors"
import Row from "components/Row"

export default ({ serving: { num, volume, unit } }) => (
  <Row flex={1} paddingTop={10}>
    <Text fontSize={14} color={colors.black48}>
      {num}
    </Text>
    <Text fontSize={14} color={colors.black48} paddingHorizontal={10}>
      X
    </Text>
    <Text
      fontSize={14}
      flex={1}
      numberOfLines={2}
      ellipsizeMode="tail"
      color={colors.black48}
    >
      {`${volume}${unit}`}
    </Text>
  </Row>
)
