import { compose, withHandlers, withProps, branch } from "recompose"
import { connect } from "react-redux"
import { actions as rrfActions } from "react-redux-form/native"
import { withApollo } from "react-apollo"

import { GetDayByIdTransformed } from "graphql/query/food/getDayById"
import { KITCHEN_DAY_FORM } from "constants"
import {
  SEARCH_TAB,
  MY_FAVS_TAB,
  MY_FOOD_TAB,
  MY_MEALS_TAB,
  MY_RECIPES_TAB
} from "scenes/Home/Nutrition/components/Basket/index"
import { getOr, getNavigationParam, trim, genUuid } from "keystone"
import { routes } from "navigation/routes"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import DayScreen from "scenes/Home/Nutrition/Kitchen/NewDay/DayScreen"
import actions from "scenes/Home/Nutrition/Kitchen/NewDay/actions"
import saveDay from "graphql/mutation/food/saveDay"
import withRRFLoader from "hoc/withRRFLoader"

const withMutations = saveDay

const withDataLoading = compose(
  GetDayByIdTransformed,
  withLoader()
)

const enhance = compose(
  withProps(props => ({
    dayId: getNavigationParam(props.navigation, "dayId")
  })),
  branch(props => props.dayId, withDataLoading),
  connect(
    state => ({
      isLoading: getOr(false, "app.kitchenDay.isLoading", state),
      error: getOr(null, "app.kitchenDay.error", state)
    }),
    (dispatch, props) => ({
      dispatch,
      loadData: () =>
        dispatch(rrfActions.load(KITCHEN_DAY_FORM, props.day || { meals: [] }))
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
    openSearch: ({ navigation, dispatch, client }) => id =>
      navigation.navigate(routes.FoodSearchRoot, {
        tabs: [SEARCH_TAB, MY_FAVS_TAB, MY_FOOD_TAB, MY_RECIPES_TAB, MY_MEALS_TAB],
        addToText: "ADD TO MEAL",
        onAdd: items => dispatch(actions.addItems(client, id, items))
      }),
    onSubmit: props => data => {
      props.saveDay({
        id: getOr(genUuid(), "day.id", props),
        name: trim(data.name),
        notes: "",
        meals: data.meals
      })
      props.navigation.goBack(null)
      props.dispatch(actions.reset)
    }
  })
)

export default enhance(DayScreen)
