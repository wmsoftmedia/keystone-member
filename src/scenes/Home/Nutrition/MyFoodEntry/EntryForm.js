import { Form, Control } from "react-redux-form/native"
import { compose, withProps } from "recompose"
import { connect } from "react-redux"
import React from "react"
import numeral from "numeral"
import styled, { Text } from "glamorous-native"

import { cals } from "keystone"

import { H2 } from "../../../../components/Typography"
import { pick } from "../../../../../lib/keystone"
import Row from "../../../../components/Row"
import TextInput from "../../../../components/inputs/TextInput"
import colors from "../../../../colors"

const MacroInput = styled(p => (
  <TextInput
    light
    maxLength={5}
    selectTextOnFocus
    selectionColor={colors.primary1}
    minWidth={90}
    keyboardType={"numeric"}
    {...p}
  />
))({
  color: colors.textInputDark,
  borderBottomColor: colors.black24,
  textAlign: "center",
  fontSize: 16,
  fontWeight: "600"
})

const LabelInput = styled(p => (
  <TextInput
    light
    placeholderTextColor={colors.black24}
    maxLength={120}
    selectionColor={colors.textLight}
    autoCapitalize={"words"}
    autoCorrect
    {...p}
  />
))({
  color: colors.textInputDark,
  borderBottomColor: colors.black24,
  fontSize: 18,
  fontWeight: "500"
})

const FieldRow = styled(p => <Row {...p} />)({
  paddingHorizontal: 16,
  paddingVertical: 8,
  justifyContent: "space-between",
  alignItems: "center"
})

const Label = styled(p => <Text {...p} />)({
  flex: 1,
  color: colors.textLight,
  fontSize: 18,
  fontWeight: "500"
})

const Measure = styled(p => <Text {...p} />)({
  color: colors.blue5,
  paddingLeft: 12,
  fontSize: 14
})

const MacrosEntryForm = props => {
  const { totalCalories } = props
  const { onSubmit } = props
  return (
    <Form
      model={FORM_NAME}
      onSubmit={onSubmit}
      style={{ flex: 1, backgroundColor: colors.white }}
    >
      <FieldRow>
        <Row>
          <Control
            placeholder={"Enter food name"}
            model={".title"}
            width={"100%"}
            component={LabelInput}
          />
        </Row>
      </FieldRow>
      <FieldRow>
        <Label>Protein</Label>
        <Row>
          <Control
            model={".protein"}
            keyboardType={"numeric"}
            component={MacroInput}
          />
          <Measure>g</Measure>
        </Row>
      </FieldRow>
      <FieldRow>
        <Label>Fat</Label>
        <Row>
          <Control
            model={".fat"}
            keyboardType={"numeric"}
            component={MacroInput}
          />
          <Measure>g</Measure>
        </Row>
      </FieldRow>
      <FieldRow>
        <Label>Carbs</Label>
        <Row>
          <Control
            model={".carbs"}
            keyboardType={"numeric"}
            component={MacroInput}
          />
          <Measure>g</Measure>
        </Row>
      </FieldRow>
      <FieldRow marginTop={8} backgroundColor={colors.black6}>
        <Text color={colors.black48} fontSize={18}>
          Total
        </Text>
        <Row paddingVertical={8} alignItems={"center"}>
          <Text color={colors.black48} fontSize={18}>
            {numeral(totalCalories).format("0,[0]")}
          </Text>
          <H2 color={colors.black48} paddingLeft={10}>
            cal
          </H2>
        </Row>
      </FieldRow>
    </Form>
  )
}

export const FORM_NAME = "formsRoot.myFoodEntryForm"

const normalizeMacro = (curr, prev) => {
  const val = +curr
  if (isNaN(val) || val < 0 || val > 999) return prev
  if (val == 0) return ""
  return curr
}

const enhanced = compose(
  connect(state => {
    const formValues = state.formsRoot.myFoodEntryForm
    const macros = pick(["protein", "fat", "carbs"], formValues)
    const totalCalories = cals(macros)
    return {
      totalCalories,
      ...formValues
    }
  }),
  withProps(props => {
    const { onSubmit } = props
    return {
      onSubmit: formData => {
        return onSubmit(formData)
      }
    }
  })
)

export default enhanced(MacrosEntryForm)
