// packages
import { compose, pure, withHandlers, withProps } from "recompose"
import React from "react"
import styled, { TouchableOpacity, View } from "glamorous-native"

import { CheckboxActiveIcon, CheckboxInactiveIcon, PlusIcon } from "kui/icons"
import { RateStarIcon } from "scenes/Home/Icons"
import { Row } from "kui/components"
import CenterView from "components/CenterView"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"
import { round } from "keystone"

const TouchWrapper = styled(p => <TouchableOpacity activeOpacity={0.5} {...p} />)({})

const LineContainer = styled(p => <Row centerY {...p} />)({
  paddingHorizontal: 20,
  height: 58
})

export const FoodItemName = p => (
  <Text variant={"body1"} numberOfLines={1} ellipsizeMode="tail" {...p} />
)

export const FoodItemDesc = p => (
  <Text variant={"caption1"} color={colors.darkBlue30} numberOfLines={2} {...p} />
)

const buildDescription = food => {
  const isMeal = food.source === "MEAL"
  const isDay = food.source === "DAY"

  // here must be a selection based on the current config
  // if 100 g selected - show 100g and ref facts
  // otherwise - find default serving based on index and multiply nutrition facts
  const defServing = _.getOr({}, `servings.${food.defaultServingIndex}`, food)
  const servingName = defServing.name || "1 serving"
  const multiplier = defServing.multiplier || 1

  const roundFact = val => (val ? `${round(val * multiplier)}` : "--")

  const prefix = isMeal ? "Per meal - " : isDay ? "Per day - " : `${servingName} - `
  const macros = food.macros || {}

  return (
    `${prefix}${roundFact(macros.calories)} cal` +
    ` | P ${roundFact(macros.protein)}` +
    ` | F ${roundFact(macros.fat)}` +
    ` | C ${roundFact(macros.carbs)}` +
    (food.brand ? ` | ${food.brand}` : "")
  )
}

const Line = props => {
  const { item } = props
  const { onClick } = props
  const { selectMode, isSelected, tapMode } = props
  const { lineContainerProps, touchWrapperProps } = props

  const name = item.name ? item.name : "--"
  const isEmpty = _.getOr(false, "food.isEmpty", props)
  const description = isEmpty ? null : buildDescription(item)
  const hasStar = Boolean(_.getOr(false, "item.meta.hasStar", props))

  return (
    <TouchWrapper {...touchWrapperProps} onPress={() => onClick()}>
      <LineContainer centerY {...lineContainerProps}>
        <View flex={1}>
          <View width="100%">
            <FoodItemName>{name}</FoodItemName>
          </View>
          {description && (
            <Row width="100%">
              {hasStar && (
                <View width={20}>
                  <RateStarIcon size={16} color={colors.green50} />
                </View>
              )}
              <FoodItemDesc>{description}</FoodItemDesc>
            </Row>
          )}
        </View>
        {selectMode && (
          <CenterView flex={0} width={32} paddingLeft={8}>
            {isSelected ? <CheckboxActiveIcon /> : <CheckboxInactiveIcon />}
          </CenterView>
        )}
        {tapMode && (
          <CenterView flex={0} width={32}>
            <PlusIcon />
          </CenterView>
        )}
      </LineContainer>
    </TouchWrapper>
  )
}

const enhance = compose(
  withHandlers({
    onClick: props => () => props.onClick(props.item),
    onDelete: props => () => props.onDelete(props.item)
  }),
  withProps(props => ({
    isSelected:
      props.selectMode &&
      (props.selected.has(props.item.id) || props.selected.has(props.item.externalId))
  })),
  pure
)

export default enhance(Line)
