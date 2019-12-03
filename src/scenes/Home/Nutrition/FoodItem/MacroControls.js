import { View } from "glamorous-native"
import { compose, setPropTypes, withHandlers, withProps, withState } from "recompose"
import React from "react"
import _ from "lodash/fp"

import { Row } from "kui/components"
import { TextInput } from "kui/components/Input"
import { isValid } from "scenes/Home/Nutrition/FoodItem/validation"
import {
  positiveFloatNormalizer,
  numberNormalizer
} from "scenes/Home/Nutrition/FoodItem/normalizers"
import PropTypes from "prop-types"

const MacroInput = p => (
  <TextInput
    compact
    maxLength={5}
    selectTextOnFocus
    keyboardType={"numeric"}
    clearButtonMode={"never"}
    borderBottomWidth={1}
    height={34}
    textAlign="center"
    {...p}
  />
)

const LabelInput = p => (
  <TextInput
    compact
    maxLength={120}
    autoCapitalize={"words"}
    autoCorrect
    borderBottomWidth={1}
    height={34}
    {...p}
  />
)

const MacroControls = props => {
  const { item } = props
  const { onLabelChange } = props
  const {
    onCalsAmountChange,
    onProteinAmountChange,
    onFatAmountChange,
    onCarbsAmountChange
  } = props
  const { calsAmount, proteinAmount, fatAmount, carbsAmount } = props
  const { label } = item

  return (
    <View>
      <Row justifyContent="space-between" paddingBottom={10}>
        <View flex={1} paddingRight={5}>
          <MacroInput label={"Cal"} value={calsAmount} onChange={onCalsAmountChange} />
        </View>
        <View flex={1} paddingHorizontal={5}>
          <MacroInput
            label={"P (g)"}
            value={proteinAmount}
            onChange={onProteinAmountChange}
          />
        </View>
        <View flex={1} paddingHorizontal={5}>
          <MacroInput label={"F (g)"} value={fatAmount} onChange={onFatAmountChange} />
        </View>
        <View flex={1} paddingLeft={5}>
          <MacroInput
            label={"C (g)"}
            value={carbsAmount}
            onChange={onCarbsAmountChange}
          />
        </View>
      </Row>
      <LabelInput label="Description" value={label} onChange={onLabelChange} />
    </View>
  )
}

const enhance = compose(
  setPropTypes({
    item: PropTypes.object.isRequired,
    onLabelChange: PropTypes.func.isRequired,
    onCalsChange: PropTypes.func.isRequired,
    onProteinChange: PropTypes.func.isRequired,
    onFatChange: PropTypes.func.isRequired,
    onCarbsChange: PropTypes.func.isRequired
  }),
  withState("calsAmount", "setCalsAmount", ({ item }) =>
    _.getOr("", "macros.cals", item)
  ),
  withState("proteinAmount", "setProteinAmount", ({ item }) =>
    _.getOr("", "macros.protein", item)
  ),
  withState("fatAmount", "setFatAmount", ({ item }) => _.getOr("", "macros.fat", item)),
  withState("carbsAmount", "setCarbsAmount", ({ item }) =>
    _.getOr("", "macros.carbs", item)
  ),
  withHandlers({
    validateAndSave: () => onChange => value => {
      if (isValid(value)) {
        onChange(positiveFloatNormalizer(value))
      }
      return value
    }
  }),
  withProps(
    ({
      onCalsChange,
      onProteinChange,
      onFatChange,
      onCarbsChange,
      validateAndSave,
      calsAmount,
      setCalsAmount,
      proteinAmount,
      setProteinAmount,
      fatAmount,
      setFatAmount,
      carbsAmount,
      setCarbsAmount
    }) => ({
      onCalsAmountChange: compose(
        setCalsAmount,
        validateAndSave(onCalsChange),
        positiveFloatNormalizer,
        numberNormalizer(calsAmount)
      ),
      onProteinAmountChange: compose(
        setProteinAmount,
        validateAndSave(onProteinChange),
        positiveFloatNormalizer,
        numberNormalizer(proteinAmount)
      ),
      onFatAmountChange: compose(
        setFatAmount,
        validateAndSave(onFatChange),
        positiveFloatNormalizer,
        numberNormalizer(fatAmount)
      ),
      onCarbsAmountChange: compose(
        setCarbsAmount,
        validateAndSave(onCarbsChange),
        positiveFloatNormalizer,
        numberNormalizer(carbsAmount)
      )
    })
  )
)

export default enhance(MacroControls)
