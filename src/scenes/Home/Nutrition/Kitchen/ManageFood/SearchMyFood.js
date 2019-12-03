// packages
import { compose, withProps, withHandlers } from "recompose"
import React from "react"

import { AllMyFoodTransformed } from "graphql/query/food/allMyFood"
import { confirm } from "native"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "kui/colors"
import deleteFood from "graphql/mutation/food/deleteFood"

const withData = AllMyFoodTransformed
const withMutation = deleteFood

const enhanceFoodList = compose(
  withData,
  withMutation,
  withExtendedErrorHandler({
    dataKeys: ["AllMyFood"]
  }),
  withLoader({
    color: colors.white,
    backgroundColor: colors.transparent,
    dataKeys: ["AllMyFood"]
  }),
  withHandlers({
    onAdd: props => () =>
      props.navigation.navigate({
        routeName: "KitchenFood",
        key: "KitchenFood"
      }),
    onClick: props => food =>
      props.navigation.navigate({
        routeName: "KitchenFood",
        key: "KitchenFood",
        params: {
          foodId: food.id
        }
      }),
    onDelete: props => food =>
      confirm(
        () => props.deleteFood(food.id),
        "This item will be deleted from your Kitchen, Favourites and any My Meals you created."
      )
  }),
  withProps(props => ({
    items: props.allMyFoodItems,
    offline: true,
    manageMode: true,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="You don't have any food created."
          subtitle={`Click on the + button to create your own food.`}
        />
      )
    },
    searchable: true,
    searchProps: {
      placeholder: "Search my food...",
      ActionButton: AddButton,
      actionProps: {
        onPress: props.onAdd
      }
    }
  }))
)

export default enhanceFoodList(FoodList)
