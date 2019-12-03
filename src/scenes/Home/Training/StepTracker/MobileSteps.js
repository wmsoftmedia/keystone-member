import { TouchableOpacity } from "react-native"
import { View } from "glamorous-native"
import { withHandlers, compose } from "recompose"
import React from "react"

import { Row } from "kui/components"
import { formatSteps } from "keystone"
import { CopyFromIcon } from "kui/icons"
import Text from "kui/components/Text"

const enhance = compose(
  withHandlers({
    onPress: props => () => props.onSetSteps(props.steps)
  })
)

export default enhance(props => {
  return (
    <View flex={1} alignItems="center">
      <Text variant="caption2">OR</Text>
      <Row centerX>
        <View flex={1} />
        <View alignItems="center" flex={2}>
          <Text variant="h1" fontSize={22}>
            {formatSteps(props.steps, "")}
          </Text>
          <Text variant="caption2">STEPS FROM PHONE</Text>
        </View>
        <Row centerX flex={1}>
          <TouchableOpacity onPress={props.onPress}>
            <CopyFromIcon size={40} />
          </TouchableOpacity>
        </Row>
      </Row>
    </View>
  )
})
