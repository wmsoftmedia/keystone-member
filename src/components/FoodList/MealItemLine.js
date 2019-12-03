import { View, TouchableOpacity } from "glamorous-native"
import { compose, mapProps, withHandlers, withProps } from "recompose"
import React from "react"

import { ChevronRightIcon } from "kui/icons"
import { MacroSummary } from "scenes/Home/Nutrition/components/TotalInfo"
import { Row } from "kui/components"
import { formatCals } from "keystone"
import { mealItemNutritionFacts } from "keystone/food"
import { servingLabelFromItem } from "scenes/Home/Nutrition/FoodItem/ServingLabel"
import Serving from "components/FoodList/Serving"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const Label = p => (
  <Text numberOfLines={1} fontSize={13} lineHeight={24} ellipsizeMode="tail" {...p} />
)

const CompactRow = p => <Row centerY spread paddingHorizontal={20} height={48} {...p} />

const Base = props => {
  const { onPress, label, cals, serving, nutritionFacts } = props
  return (
    <TouchableOpacity onPress={onPress}>
      <View paddingHorizontal={20}>
        <Row justifyContent="center" alignItems="flex-end" paddingTop={10}>
          <View flex={1} justifyContent="center">
            <Label>{label}</Label>
          </View>
          <View alignItems="center" justifyContent="flex-end">
            <Text variant="caption1" color={colors.darkBlue30}>
              {cals}
            </Text>
          </View>
        </Row>
        <Row spread alignItems="flex-start">
          <MacroSummary hideCals item macros={nutritionFacts} />
          <View alignItems="flex-end">
            <Serving paddingHorizontal={0} serving={serving} />
          </View>
        </Row>
      </View>
    </TouchableOpacity>
  )
}

const CompactBase = ({ onPress, label, cals, servingLabel, ...rest }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <CompactRow {...rest}>
      <ChevronRightIcon color={colors.darkBlue40} size={20} />
      <View flex={1}>
        <Label>{label}</Label>
      </View>
      <View alignItems="flex-end">
        <Text textAlign="right" color={colors.darkBlue30} fontSize={12} fontHeight={16}>
          {cals}
        </Text>
        <Text textAlign="right" color={colors.white50} fontSize={10}>
          {servingLabel || " "}
        </Text>
      </View>
    </CompactRow>
  </TouchableOpacity>
)

// Adapters
// ----------------------------------------------------------------------------

const enhanceMealItem = compose(
  withHandlers({
    onPress: ({ onItemPress, item, index }) => () => onItemPress(item, index)
  }),
  mapProps(props => {
    const { item, onPress } = props
    const nutritionFacts = mealItemNutritionFacts(item)
    const cals = formatCals(nutritionFacts.calories)
    const label = item.food.name || "--"
    const serving = item.serving
    const servingLabel = servingLabelFromItem(item)
    return { onPress, label, cals, nutritionFacts, serving, servingLabel }
  })
)

const enhanceTrackerMealItem = compose(
  mapProps(props => {
    const { item, onPress } = props
    const isQuickAdd = item.origin && item.origin === "QUICK ADD"
    const label = _.getOr("--", "label", item) || (isQuickAdd ? "Quick Add" : "--")
    const cals = formatCals(item.cals || 0)
    const servingLabel = servingLabelFromItem(item)
    return { onPress, label, cals, servingLabel }
  })
)

// Variations
// ----------------------------------------------------------------------------

const card = withProps({
  paddingRight: 16,
  paddingLeft: 10,
  backgroundColor: colors.darkBlue90
})

export const MealItemLine = enhanceMealItem(Base)
export const MealItemLineCompact = enhanceMealItem(CompactBase)

export const DayMealItemLineCompact = enhanceMealItem(card(CompactBase))
export const TrackerMealItemLine = enhanceTrackerMealItem(card(CompactBase))

export default MealItemLine
