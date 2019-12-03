// packages
import { compose, withProps, withHandlers } from "recompose"
import React from "react"

import { AllMyMealsTransformed } from "graphql/query/food/allMyMeals"
import { confirm } from "native"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "kui/colors"
import deleteMeal from "graphql/mutation/food/deleteMeal"

const withData = AllMyMealsTransformed
const withMutations = deleteMeal

const enhanceFoodList = compose(
  withData,
  withExtendedErrorHandler({
    dataKeys: ["AllMyMeals"]
  }),
  withLoader({
    color: colors.white,
    backgroundColor: colors.transparent,
    dataKeys: ["AllMyMeals"]
  }),
  withMutations,
  withHandlers({
    onAdd: props => () =>
      props.navigation.navigate({
        routeName: "KitchenMeal",
        key: "KitchenMeal"
      }),
    onClick: props => meal =>
      props.navigation.navigate({
        routeName: "KitchenMeal",
        key: "KitchenMeal",
        params: {
          mealId: meal.id
        }
      }),
    onDelete: props => meal =>
      confirm(
        () => props.deleteMeal(meal.id),
        "Are you sure you want to permanently delete this meal?"
      )
  }),
  withProps(props => ({
    items: props.allMyMeals,
    offline: true,
    manageMode: true,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="You don't have any meals created."
          subtitle={`Click on the + button to create your first meal.`}
        />
      )
    },
    searchable: true,
    searchProps: {
      placeholder: "Search my meals...",
      ActionButton: AddButton,
      actionProps: {
        onPress: props.onAdd
      }
    }
  }))
)

export default enhanceFoodList(FoodList)
