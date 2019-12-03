// packages
import { compose, withHandlers, withProps, branch } from "recompose"
import { connect } from "react-redux"
import { actions as rrfActions } from "react-redux-form/native"
import { withApollo } from "react-apollo"

import { GetMealByIdTransformed } from "graphql/query/food/getMealById"
import {
  SEARCH_TAB,
  MY_FAVS_TAB,
  MY_FOOD_TAB,
  MY_RECIPES_TAB
} from "scenes/Home/Nutrition/components/Basket/index"
import { getNavigationParam, trim, genUuid } from "keystone"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import MealScreen, { FORM_NAME } from "scenes/Home/Nutrition/Kitchen/NewMeal/MealScreen"
import _ from "lodash/fp"
import colors from "kui/colors"
import saveMeal from "graphql/mutation/food/saveMeal"
import withRRFLoader from "hoc/withRRFLoader"

import actions from "./actions"

const withMutations = saveMeal

const withDataLoading = compose(
  GetMealByIdTransformed,
  withLoader({ color: colors.white })
)

const enhance = compose(
  withProps(props => ({
    mealId: getNavigationParam(props.navigation, "mealId")
  })),
  branch(props => props.mealId, withDataLoading),
  connect(
    state => ({
      isLoading: _.getOr(false, "app.kitchenMeal.isLoading", state),
      error: _.getOr(null, "app.kitchenMeal.error", state)
    }),
    (dispatch, props) => ({
      dispatch,
      loadData: () =>
        dispatch(
          rrfActions.load(
            FORM_NAME,
            props.meal
              ? {
                  ...props.meal,
                  items: _.sortBy("orderIndex", props.meal.items)
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
      props.navigation.navigate({
        routeName: "TrackerBasket",
        key: "TrackerBasket",
        params: {
          tabs: [SEARCH_TAB, MY_FAVS_TAB, MY_FOOD_TAB, MY_RECIPES_TAB],
          addToText: "ADD TO MEAL",
          onAdd: food => props.dispatch(actions.addFood(props.client, food))
        }
      }),
    onSubmit: props => data => {
      props.saveMeal({
        id: _.getOr(genUuid(), "meal.id", props),
        name: trim(data.name),
        items: data.items
      })

      props.navigation.goBack(null)
      props.dispatch(actions.reset)
    }
  })
)

export default enhance(MealScreen)
