// packages
import { compose, withHandlers, withProps } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { AllMyMealsTransformed } from "graphql/query/food/allMyMeals"
import { routes } from "navigation/routes"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "kui/colors"

const enhance = compose(
  AllMyMealsTransformed,
  withNavigation,
  withExtendedErrorHandler({
    dataKeys: ["AllMyMeals"]
  }),
  withLoader({
    color: colors.white,
    dataKeys: ["AllMyMeals"],
    message: "Loading My Meals..."
  }),
  withHandlers({
    onAdd: props => () => props.navigation.navigate(routes.KitchenMeal)
  }),
  withProps(props => ({
    items: props.allMyMeals,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage title="No meals yet." subtitle="You don't have any meals created." />
      ),
      searchNotFound: () => <InfoMessage title="No meals found." />
    },
    offline: true,
    selectMode: false,
    selected: props.selectedIds,
    searchable: true,
    searchProps: {
      placeholder: "Search my meals...",
      ActionButton: AddButton,
      actionProps: {
        onPress: props.onAdd
      }
    },
    sortField: "name"
  })),
  withHandlers({
    onClick: props => meal => props.toggleMeal(meal)
  })
)
export default enhance(FoodList)
