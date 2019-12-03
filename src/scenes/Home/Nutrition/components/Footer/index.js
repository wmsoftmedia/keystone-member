import { View } from "glamorous-native"
import { compose, setPropTypes, withProps } from "recompose"
import React from "react"

import { FloatButton } from "kui/components/Button"
import { SpoonIcon } from "kui/icons"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import colors from "kui/colors"

const BasketButton = props => {
  const { foodNum, isEmpty, onPress } = props
  if (isEmpty) {
    return null
  }

  return (
    <View position="absolute" width={52} height={52} bottom={34} right={20}>
      <FloatButton color={colors.darkBlue50} onPress={onPress} alignItems="center">
        <View position="absolute" left={14}>
          <SpoonIcon color={colors.white50} />
        </View>
        <View position="absolute" left={26}>
          <Text marginTop={4} variant="body2">
            {foodNum}
          </Text>
        </View>
      </FloatButton>
    </View>
  )
}

const enhance = compose(
  setPropTypes({
    icon: PropTypes.func,
    food: PropTypes.array,
    onPress: PropTypes.func
  }),
  withProps(props => ({
    foodNum: props.food.length,
    isEmpty: props.food.length === 0
  }))
)

export default enhance(BasketButton)
