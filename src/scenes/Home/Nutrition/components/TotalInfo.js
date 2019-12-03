// packages
import { View } from "glamorous-native"
import React from "react"

import { AddIcon } from "kui/icons"
import { IconButton } from "kui/components/Button"
import { Row } from "kui/components"
import Text from "kui/components/Text"
import colors from "kui/colors"

const SummaryText = p => <Text variant="caption1" color={colors.darkBlue30} {...p} />

const Macro = props => (
  <SummaryText>
    {props.name}
    {props.value ? `${props.value} ` : <Text> -- </Text>}
    {props.unit}
  </SummaryText>
)

const AddFoodButton = ({ onPress, ...rest }) => {
  return (
    <IconButton onPress={onPress} {...rest}>
      <AddIcon size={24} color={colors.white} />
    </IconButton>
  )
}

export const MacroSummary = ({
  macros,
  item = false,
  hideCals = false,
  hideFibre = false
}) => (
  <SummaryText>
    {!hideCals && (
      <React.Fragment>
        {!item ? (
          <Macro name="Total " value={macros.calories} unit="cal" />
        ) : (
          <Macro value={macros.calories} unit="cal" />
        )}
        {" | "}
      </React.Fragment>
    )}
    <Macro name="P " value={macros.protein} unit="g" />
    {" | "}
    <Macro name="F " value={macros.fat} unit="g" />
    {" | "}
    <Macro name="C " value={macros.carbs} unit="g" />
    {!hideFibre && <Macro name=" | Fibre " value={macros.fibre} unit="g" />}
  </SummaryText>
)

const TotalInfo = props => {
  const { macros, onPress, ...rest } = props
  return (
    <View {...rest}>
      <Row centerY spread>
        <MacroSummary macros={macros} />
        {onPress && <AddFoodButton onPress={onPress} marginRight={-10} />}
      </Row>
    </View>
  )
}

export default TotalInfo
