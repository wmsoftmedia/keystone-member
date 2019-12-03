// packages
import { withHandlers, compose } from "recompose"
import React from "react"
import styled, { TouchableOpacity, View } from "glamorous-native"

import { PlusIcon } from "kui/icons"
import { Row } from "kui/components"
import Text from "kui/components/Text"
import colors from "kui/colors"

const TouchWrapper = styled(p => <TouchableOpacity activeOpacity={0.5} {...p} />)({})

export const FoodItemName = p => (
  <Text numberOfLines={1} ellipsizeMode="tail" variant={"body1"} {...p} />
)

export const FoodItemDesc = p => (
  <Text numberOfLines={2} variant="caption1" color={colors.darkBlue30} {...p} />
)

const enhance = compose(
  withHandlers({
    onClick: props => () => props.onClick(props.item)
  })
)

class DayLine extends React.PureComponent {
  buildDescription(food) {
    const macros = food.macros || {}

    return (
      `${macros.calories || "--"} cal` +
      ` | P ${macros.protein || "--"}` +
      ` | F ${macros.fat || "--"}` +
      ` | C ${macros.carbs || "--"}` +
      (food.brand ? ` | ${food.brand}` : "")
    )
  }

  render() {
    const name = this.props.item.name ? this.props.item.name : "--"
    const description = this.buildDescription(this.props.item)

    return (
      <TouchWrapper onPress={() => this.props.onClick()}>
        <Row paddingHorizontal={20} height={58} centerY>
          <View flex={1}>
            <View width="100%">
              <FoodItemName>{name}</FoodItemName>
            </View>
            <View width="100%">
              <FoodItemDesc>{description}</FoodItemDesc>
            </View>
          </View>
          <View width={30}>
            <PlusIcon />
          </View>
        </Row>
      </TouchWrapper>
    )
  }
}

export default enhance(DayLine)
