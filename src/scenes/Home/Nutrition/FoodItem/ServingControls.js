import { View } from "glamorous-native"
import { compose, withHandlers, withProps, setPropTypes, withState } from "recompose"
import React from "react"
import _ from "lodash/fp"

import { Row } from "kui/components"
import { TextInput } from "kui/components/Input"
import { isValid } from "scenes/Home/Nutrition/FoodItem/validation"
import {
  positiveFloatNormalizer,
  numberNormalizer
} from "scenes/Home/Nutrition/FoodItem/normalizers"
import Picker from "kui/components/Input/Picker"
import PropTypes from "prop-types"

const ServingInput = p => (
  <TextInput
    compact
    keyboardType="numeric"
    returnKeyType="done"
    selectTextOnFocus
    maxLength={5}
    minWidth={60}
    {...p}
  />
)

const ServingControls = props => {
  const { item } = props
  const { onServingUnitChange } = props
  const { servings, servingUnit } = item
  const { amount, onAmountChange } = props

  return (
    <View>
      <Row justifyContent="space-between">
        <View flex={0.4} paddingRight={16}>
          <ServingInput
            label="Servings"
            value={String(amount)}
            onChange={onAmountChange}
          />
        </View>
        <View flex={0.6}>
          <Picker
            label="Serving size"
            value={servingUnit}
            items={servings.map(s => s.description)}
            onChange={onServingUnitChange}
            pickerHeader="Serving size"
            box
          />
        </View>
      </Row>
    </View>
  )
}

const enhance = compose(
  setPropTypes({
    item: PropTypes.object.isRequired,
    onServingAmountChange: PropTypes.func.isRequired,
    onServingUnitChange: PropTypes.func.isRequired
  }),
  withState("amount", "setAmount", ({ item }) => _.getOr("", "servingAmount", item)),
  withHandlers({
    validateAndSave: ({ onServingAmountChange }) => value => {
      if (isValid(value)) {
        onServingAmountChange(positiveFloatNormalizer(value))
      }
      return value
    }
  }),
  withProps(({ setAmount, validateAndSave, amount }) => ({
    onAmountChange: compose(
      setAmount,
      validateAndSave,
      positiveFloatNormalizer,
      numberNormalizer(amount)
    )
  }))
)

export default enhance(ServingControls)
