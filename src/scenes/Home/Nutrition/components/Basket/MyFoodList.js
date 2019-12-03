// packages
import { compose, withHandlers, withProps } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { AllMyFoodTransformed } from "graphql/query/food/allMyFood"
import { routes } from "navigation/routes"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "kui/colors"

const enhance = compose(
  AllMyFoodTransformed,
  withNavigation,
  withExtendedErrorHandler({
    dataKeys: ["AllMyFood"]
  }),
  withLoader({
    color: colors.white,
    dataKeys: ["AllMyFood"],
    message: "Loading My Food..."
  }),
  withHandlers({
    onAdd: props => () => props.navigation.navigate(routes.KitchenFood)
  }),
  withProps(props => ({
    items: props.allMyFoodItems,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage title="No food yet." subtitle="You don't have any foods created." />
      ),
      searchNotFound: () => <InfoMessage title="No food found." />
    },
    offline: true,
    selectMode: true,
    selected: props.selectedIds,
    searchable: true,
    searchProps: {
      placeholder: "Search my food...",
      ActionButton: AddButton,
      actionProps: {
        onPress: props.onAdd
      }
    }
  })),
  withHandlers({
    onClick: props => food => props.toggleFood(food)
  })
)

export default enhance(FoodList)
