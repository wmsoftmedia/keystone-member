import { compose, withHandlers, withProps } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"

import { AllMyMealsTransformed } from "graphql/query/food/allMyMeals"
import { Screen } from "components/Background"
import { routes } from "navigation/routes"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"

const dataKeys = ["AllMyMeals"]

const MealList = compose(
  withMappedNavigationParams(),
  AllMyMealsTransformed,
  withExtendedErrorHandler({ dataKeys }),
  withLoader({ dataKeys, message: "Loading meals..." }),
  withHandlers({
    onAdd: ({ navigation }) => () => navigation.navigate(routes.KitchenMeal)
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
    //selectMode: false,
    //selected: props.selectedIds,
    tapMode: true,
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
    onClick: ({ onMealClick }) => meal => onMealClick(meal)
  })
)(FoodList)

const MealSearch = props => {
  return (
    <Screen>
      <MealList {...props} />
    </Screen>
  )
}

export default MealSearch
