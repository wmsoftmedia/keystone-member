import { View } from "glamorous-native"
import React from "react"

import { Row } from "kui/components"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import { SetTypes, setName, setIcon } from "scenes/Home/TrainingV3/common"

const SetHeader = props => {
  const { set, exercisesCount, roundTime } = props

  const setType = _.getOr("", "type.setType", set)
  const name = setName(setType, exercisesCount)
  const Icon = setIcon(setType, exercisesCount)
  const typeInfo = SetTypes.properties[SetTypes[setType.toUpperCase()] || 0]
  const typeSufix = roundTime && roundTime > 60 ? Math.ceil(roundTime / 60) : ""

  return (
    <View paddingVertical={20} paddingHorizontal={20}>
      <Row alignItems="center">
        <Row alignItems="center">
          <Icon />
          <Text paddingLeft={8} variant="body2">
            {typeInfo.label} - {name + typeSufix}
          </Text>
        </Row>
      </Row>
    </View>
  )
}

export default SetHeader
