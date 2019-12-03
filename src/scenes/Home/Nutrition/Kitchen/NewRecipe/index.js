// packages
import { compose, withHandlers, withProps, branch } from "recompose"
import { connect } from "react-redux"
import { actions as rrfActions } from "react-redux-form/native"
import { withApollo } from "react-apollo"

import { GetRecipeByIdTransformed } from "graphql/query/food/getRecipeById"
import { KITCHEN_RECIPE_FORM } from "constants"
import {
  SEARCH_TAB,
  MY_FAVS_TAB,
  MY_FOOD_TAB
} from "scenes/Home/Nutrition/components/Basket/index"
import { getOr, getNavigationParam, trim, genUuid } from "keystone"
import { routes } from "navigation/routes"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import RecipeScreen from "scenes/Home/Nutrition/Kitchen/NewRecipe/RecipeScreen"
import _ from "lodash/fp"
import saveRecipe from "graphql/mutation/food/saveRecipe"
import withRRFLoader from "hoc/withRRFLoader"

import actions from "./actions"

const withMutations = saveRecipe

const withDataLoading = compose(
  GetRecipeByIdTransformed,
  withLoader()
)

const enhance = compose(
  withProps(props => ({
    recipeId: getNavigationParam(props.navigation, "recipeId")
  })),
  branch(props => props.recipeId, withDataLoading),
  connect(
    state => ({
      isLoading: getOr(false, "app.kitchenRecipe.isLoading", state),
      error: getOr(null, "app.kitchenRecipe.error", state)
    }),
    (dispatch, props) => ({
      dispatch,
      loadData: () =>
        dispatch(
          rrfActions.load(
            KITCHEN_RECIPE_FORM,
            props.recipe
              ? {
                  ...props.recipe,
                  servings: getOr(1, "recipe.servingsNum", props),
                  ingredients: _.sortBy(
                    "orderIndex",
                    getOr([], "recipe.ingredients", props)
                  )
                }
              : {}
          )
        )
    })
  ),
  withRRFLoader,
  withLoader({
    loaderProp: "isLoading"
  }),
  withExtendedErrorHandler({
    errorProp: "error",
    message: "Close",
    retryHandler: props => props.dispatch(actions.setError(""))
  }),
  withMutations,
  withApollo,
  withHandlers({
    getServing: props => food =>
      props.servings[food.id] || food.servings[food.defaultServingIndex],
    openSearch: props => () =>
      props.navigation.push(routes.FoodSearchRoot, {
        tabs: [SEARCH_TAB, MY_FAVS_TAB, MY_FOOD_TAB],
        addToText: "ADD TO RECIPE",
        onAdd: food => props.dispatch(actions.addFood(props.client, food))
      }),
    onSubmit: props => data => {
      props.saveRecipe({
        id: getOr(genUuid(), "recipe.id", props),
        foodId: getOr(genUuid(), "data.recipeByFoodId.food.id", props),
        name: trim(data.name),
        servingsNum: +data.servings || 1,
        totalTime: data.totalTime,
        prepTime: data.prepTime,
        meta: data.meta,
        notes: data.method,
        ingredients: data.ingredients
      })

      props.navigation.goBack(null)
      props.dispatch(actions.reset)
    }
  })
)

export default enhance(RecipeScreen)
