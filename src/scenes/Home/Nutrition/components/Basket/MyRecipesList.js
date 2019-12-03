// packages
import { compose, withHandlers, withProps } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { AllMyRecipesTransformed } from "graphql/query/food/allMyRecipes"
import { routes } from "navigation/routes"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "colors"

const enhance = compose(
  AllMyRecipesTransformed,
  withNavigation,
  withExtendedErrorHandler({
    dataKeys: ["AllMyRecipes"]
  }),
  withLoader({
    color: colors.white,
    dataKeys: ["AllMyRecipes"],
    message: "Loading My Recipes..."
  }),
  withHandlers({
    onAdd: props => () => props.navigation.navigate(routes.KitchenRecipe)
  }),
  withProps(props => ({
    items: props.allMyRecipes,
    onClick: props.onSubmit,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="No recipes yet."
          subtitle="You don't have any recipes created."
        />
      ),
      searchNotFound: () => <InfoMessage title="No recipes found." />
    },
    offline: true,
    selectMode: true,
    selected: props.selectedIds,
    searchable: true,
    searchProps: {
      ActionButton: AddButton,
      placeholder: "Search my recipes...",
      actionProps: {
        onPress: props.onAdd
      }
    }
  })),
  withHandlers({
    onClick: props => recipe => props.toggleRecipe(recipe)
  })
)

export default enhance(FoodList)
