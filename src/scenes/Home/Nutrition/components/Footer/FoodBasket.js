import { View } from "glamorous-native"
import {
  compose,
  defaultProps,
  renameProps,
  setPropTypes,
  withHandlers,
  withProps,
  withState
} from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"

import { ModalScreen } from "components/Background"
import { PrimaryButton, TextButton } from "kui/components/Button"
import FoodLine from "components/FoodList/FoodLine"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import PropTypes from "prop-types"

const BasketList = compose(
  withState("items", "setItems", props => props.items),
  withProps({
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="No food selected"
          subtitle="Click 'Back' to return to food search"
        />
      )
    },
    offline: true,
    manageMode: true,
    LineComp: FoodLine
  }),
  withHandlers({
    onDelete: ({ items, setItems, toggleItem }) => food => {
      setItems(items.filter(i => i.id !== food.id))
      toggleItem(food)
    }
  })
)(FoodList)

const Basket = props => {
  const { onPrimaryPress, onSecondaryPress, confirmLabel, backLabel } = props
  const { items, toggleItem } = props
  const hasItems = items.length > 0
  return (
    <ModalScreen grabby>
      <BasketList items={items} toggleItem={toggleItem} />
      {hasItems && (
        <PrimaryButton
          marginHorizontal={20}
          marginTop={20}
          label={confirmLabel}
          onPress={onPrimaryPress}
        />
      )}
      <View marginVertical={10} />
      <TextButton
        marginHorizontal={20}
        marginBottom={20}
        label={backLabel}
        onPress={onSecondaryPress}
      />
    </ModalScreen>
  )
}

const enhance = compose(
  withMappedNavigationParams(),
  defaultProps({
    confirmLabel: "ADD",
    backLabel: "BACK"
  }),
  setPropTypes({
    popupContent: PropTypes.object
  }),
  renameProps({ onConfirmPress: "onPrimaryPress" }),
  withHandlers({
    onSecondaryPress: ({ navigation }) => () => navigation.pop()
  })
)

export const FoodBasketContent = enhance(Basket)
