import { View } from "glamorous-native"
import { compose, withProps, withHandlers } from "recompose"
import React from "react"

import { AddIcon, TrashIcon } from "kui/icons"
import { IconButton } from "kui/components/Button"
import { Row } from "kui/components"
import { mealNutritionFacts } from "keystone/food"
import Text from "kui/components/Text"
import colors from "kui/colors"

const enhance = compose(
  withProps(props => ({
    macros: mealNutritionFacts(props.meal)
  })),
  withHandlers({
    onDeleteClick: props => () => props.onDelete(props.index),
    onAddClick: props => () => props.onFoodSearch(props.index)
  })
)

const MealHeader = props => {
  const { index, macros, onDeleteClick, onAddClick } = props
  return (
    <Row spread centerY paddingLeft={16}>
      <View>
        <Text variant="body2">Meal {index + 1}</Text>
        <Row>
          <Text variant="caption1" color={colors.darkBlue30}>
            {macros.calories ? props.macros.calories + " cal" : "--"}
            {" |"}
          </Text>
          <Text variant="caption1" color={colors.darkBlue30}>
            P {macros.protein || "--"} g |{" "}
          </Text>
          <Text variant="caption1" color={colors.darkBlue30}>
            F {macros.fat || "--"} g |{" "}
          </Text>
          <Text variant="caption1" color={colors.darkBlue30}>
            C {macros.carbs || "--"} g
          </Text>
        </Row>
      </View>
      <Row>
        <IconButton onPress={onDeleteClick}>
          <TrashIcon color={colors.darkBlue30} size={24} />
        </IconButton>
        <IconButton paddingRight={20} onPress={onAddClick}>
          <AddIcon color={colors.darkBlue30} size={24} />
        </IconButton>
      </Row>
    </Row>
  )
}

export default enhance(MealHeader)
