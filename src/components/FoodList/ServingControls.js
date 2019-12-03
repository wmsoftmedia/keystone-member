import { Text, View } from "glamorous-native"
import { withHandlers } from "recompose"
import React from "react"

import Picker from "components/Picker"
import Row from "components/Row"
import colors from "colors"

import ServingInput from "./ServingInput"
import ServingSummary from "./ServingSummary"

const InputLabel = p => (
  <Text color={colors.white50} fontSize={10} paddingBottom={4} {...p} />
)

const enhance = withHandlers({
  onServingNumChange: props => props.onServingNumChange(props.item),
  onServingChange: props => props.onServingChange(props.item)
})

export default enhance(({ servings, serving, onServingNumChange, onServingChange }) => (
  <View>
    <Row justifyContent="space-between">
      <View flex={1} paddingRight={10}>
        <InputLabel>Servings</InputLabel>
        <ServingInput value={`${serving.num}`} onChange={onServingNumChange} />
      </View>
      <View flex={1} paddingLeft={10}>
        <InputLabel>Serving Size</InputLabel>
        <Picker
          prompt="Select serving size"
          pickerHeader="Serving size"
          onChange={onServingChange}
          items={servings.map(s => s.name)}
          value={serving.name}
          onBlur={() => {}}
        />
      </View>
    </Row>
    <ServingSummary serving={serving} />
  </View>
))
