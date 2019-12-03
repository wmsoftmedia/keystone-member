// packages
import { compose, withProps, withHandlers } from "recompose"
import React from "react"

import { AllMyRecipesTransformed } from "graphql/query/food/allMyRecipes"
import { confirm } from "native"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "kui/colors"
import deleteRecipe from "graphql/mutation/food/deleteRecipe"

const withData = AllMyRecipesTransformed
const withMutations = deleteRecipe

const enhanceFoodList = compose(
  withData,
  withExtendedErrorHandler({
    dataKeys: ["AllMyRecipes"]
  }),
  withLoader({
    color: colors.white,
    backgroundColor: colors.transparent,
    dataKeys: ["AllMyRecipes"]
  }),
  withMutations,
  withHandlers({
    onAdd: props => () =>
      props.navigation.navigate({
        routeName: "KitchenRecipe",
        key: "KitchenRecipe"
      }),
    onClick: props => recipe =>
      props.navigation.navigate({
        routeName: "KitchenRecipe",
        key: "KitchenRecipe",
        params: {
          recipeId: recipe.id
        }
      }),
    onDelete: props => recipe =>
      confirm(
        () => props.deleteRecipe(recipe.id),
        "Are you sure you want to permanently delete this recipe?"
      )
  }),
  withProps(props => ({
    items: props.allMyRecipes,
    offline: true,
    manageMode: true,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="You don't have any recipes created."
          subtitle={`Click on the + button to create a recipe.`}
        />
      )
    },
    searchable: true,
    searchProps: {
      placeholder: "Search my recipes...",
      ActionButton: AddButton,
      actionProps: {
        onPress: props.onAdd
      }
    }
  }))
)

export default enhanceFoodList(FoodList)
