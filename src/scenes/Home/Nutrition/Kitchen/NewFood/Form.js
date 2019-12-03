// packages
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { View } from "glamorous-native"
import { actions, Form, Control } from "react-redux-form/native"
import { compose, withHandlers } from "recompose"
import { connect } from "react-redux"
import React from "react"

import { InputRowPicker, InputRowText, TextInput } from "kui/components/Input"
import { ModalScreen } from "components/Background"
import { Row } from "kui/components"
import { dataToFood, getServingNutritionFacts } from "keystone/food"
import { getOr, round } from "keystone"
import { inputPropsMapper } from "keystone/forms/rrf"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import withRRFLoader from "hoc/withRRFLoader"

export const FORM_NAME = "formsRoot.myFoodForm"

const UNIT_PICKER_ITEMS = [
  { label: "g (grams)", value: "g" },
  { label: "ml (milliliters)", value: "ml" }
]

const MacroSection = p => <Text variant="body2" fontSize={12} {...p} />

const LabelInput = p => (
  <TextInput compact autoCapitalize={"words"} keyboardType="numeric" autoCorrect {...p} />
)

const floatNumNormalizer = _.replace(",", ".")
const negNormalizer = _.replace("-", "")
const zeroNormalizer = value => (Number(value) === 0 ? null : value)
const inputNormalizer = compose(
  negNormalizer,
  floatNumNormalizer
)

//const zeroInputNormalizer = compose(
//zeroNormalizer,
//negNormalizer,
//floatNumNormalizer
//)

const Selector = props => <InputRowPicker label="Default serving" pickerProps={props} />

const MappedInput = props => {
  const { value, label, suffix, focused, placeholder } = props
  const { onChange, onFocus, onBlur } = props
  const { renderPrefix } = props
  return (
    <View>
      <InputRowText
        height={48}
        label={label}
        suffix={suffix}
        renderPrefix={renderPrefix}
        inputProps={{
          placeholder,
          maxLength: 6,
          textAlign: "center",
          keyboardType: "numeric",
          value,
          onChange,
          onFocus,
          onBlur,
          focused,
          selectTextOnFocus: true
        }}
      />
    </View>
  )
}

const InputRow = props => {
  const { isRefSize, data, model } = props
  const renderPrefix = () => {
    if (!isRefSize) {
      return (
        <View width={120}>
          <Text textAlign="center" variant="caption1">
            {round((data[model] / data.servingSize) * 100) || 0}
          </Text>
        </View>
      )
    }
    return null
  }

  return (
    <View>
      <Control
        placeholder={"_ _ _"}
        model={`.${props.model}`}
        label={props.name}
        suffix={props.unit}
        textAlign="center"
        clearButton={false}
        mapProps={inputPropsMapper}
        renderPrefix={renderPrefix}
        parser={inputNormalizer}
        component={MappedInput}
      />
    </View>
  )
}

const prepareFood = data => {
  const food = dataToFood(data)
  const { defaultServingIndex } = food
  const serving = {
    num: 1,
    volume: +getOr("100", `servings[0].volume`, food),
    unit: getOr("g", `servings[0].unit`, food)
  }
  return {
    title: food.name,
    brand: food.brand,
    ...getServingNutritionFacts(serving, food.macros),
    defaultServing:
      defaultServingIndex === 0
        ? "serving size"
        : getOr("100", `servings[${defaultServingIndex}].volume`, food) +
          getOr("g", `servings[${defaultServingIndex}].unit`, food),
    customServings: [],
    servingUnit: getOr("g", `servings[${defaultServingIndex}].unit`, food),
    servingSize: getOr("100", `servings[0].volume`, food)
  }
}

const enhance = compose(
  connect(state => {
    const size = getOr("100", `${FORM_NAME}.servingSize`, state)
    const unit = getOr("g", `${FORM_NAME}.servingUnit`, state)

    const customServings = getOr([], `${FORM_NAME}.customServings`, state)
    return {
      isRefSize: size === "100" || !size,
      data: getOr({}, FORM_NAME, state),
      servingItems: [
        "serving size",
        ...customServings,
        ...(size === "100" ? [] : ["100" + unit]),
        ...(size === "1" ? [] : ["1" + unit])
      ]
    }
  }),
  withHandlers({
    loadData: props => () => {
      const data = props.food
        ? prepareFood(props.food)
        : {
            customServings: [],
            servingUnit: "g",
            servingSize: "100",
            defaultServing: "serving size"
          }
      props.dispatch(actions.load(FORM_NAME, data))
    }
  }),
  withRRFLoader
)

export default enhance(props => (
  <ModalScreen paddingTop={20}>
    <KeyboardAwareScrollView enableOnAndroid>
      <Form
        validateOn="change"
        model={FORM_NAME}
        onSubmit={props.onSubmit}
        style={{ flex: 1 }}
      >
        <View paddingHorizontal={20}>
          <View paddingBottom={16}>
            <Control
              label="Enter food name"
              model=".title"
              clearButton
              keyboardType="default"
              autoCapitalize="sentences"
              component={LabelInput}
            />
          </View>
          <Control model=".servingUnit" component={Selector} items={UNIT_PICKER_ITEMS} />
          <InputRow
            name="Serving Size"
            model="servingSize"
            unit={props.data.servingUnit}
            {...props}
          />
          <Control
            model=".defaultServing"
            component={Selector}
            items={props.servingItems}
          />
        </View>
        <Line marginTop={24} marginBottom={20} />
        <View paddingHorizontal={20}>
          <Row paddingBottom={8} justifyContent="space-between">
            <Row flex={0}>
              <MacroSection>Macros</MacroSection>
            </Row>

            {!props.isRefSize && (
              <Row paddingLeft={40} flex={0}>
                <MacroSection>Per 100{`${props.data.servingUnit}`}</MacroSection>
              </Row>
            )}
            <Row width={120} flex={0}>
              <MacroSection>
                Per Serving ({`${props.data.servingSize || 0}${props.data.servingUnit}`})
              </MacroSection>
            </Row>
          </Row>
          <InputRow name="Calories" model="calories" unit="cal" {...props} />
          <InputRow name="Protein" model="protein" unit="g" {...props} />
          <InputRow name="Fat" model="fat" unit="g" {...props} />
          <InputRow name="Carbs" model="carbs" unit="g" {...props} />
          <InputRow name="Fibre" model="fibre" unit="g" {...props} />
          {/* <Row paddingVertical={10}>
          <Control
            placeholder="Enter brand name"
            model=".brand"
            component={LabelInput}
            clearButton
            keyboardType="default"
            autoCapitalize="sentences"
          />
        </Row> */}
        </View>
      </Form>
    </KeyboardAwareScrollView>
  </ModalScreen>
))
