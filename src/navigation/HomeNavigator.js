import { compose } from "recompose"
import { createStackNavigator } from "react-navigation-stack"
import React from "react"

import { FeedButton, ProfileButton } from "scenes/Home/Dashboard/Buttons"
import { bodyRoutes } from "navigation/BodyNavigator"
import { bookingRoutes } from "navigation/BookingsNavigator"
import { feelingRoutes } from "navigation/FeelingsNavigator"
import { getNavigationDate, getNavigationParam, gqlDate } from "keystone"
import { headerStyle, headerTitleStyle } from "styles"
import { horizontalTransitionConfig, verticalTransitionConfig } from "native"
import { modalNavigationOptions } from "navigation/utils"
import { nutritionJournalRoutes } from "navigation/NutritionJournalNavigator"
import { nutritionRoutes } from "navigation/NutritionNavigator"
import { homeRoutes as r } from "navigation/routes"
import { profileNavigator } from "navigation/ProfileNavigator"
import { stepsNavigator } from "navigation/StepsNavigator"
import { trainingRoutes } from "navigation/TrainingNavigator"
import { workoutBuilderRoutes } from "navigation/WorkoutBuilderNavigator"
import Dashboard from "scenes/Home/Dashboard"
import Feed from "scenes/Home/Feed"
import MarkAllButton from "scenes/Home/Feed/MarkAllButton"
import NavigationDatePicker from "components/NavigationDatePicker"
import reportRoutes from "navigation/ReportNavigator"
import Text from "kui/components/Text"
import TitleMonthPicker from "components/TitleMonthPicker"
import PopupPicker from "components/PopupPicker"
import PopupFilter from "components/PopupFilter"
import colors from "kui/colors"

const getDate = compose(
  gqlDate,
  getNavigationDate
)

const routes = {
  [r.Dashboard]: {
    screen: ({ navigation, ...rest }) => {
      const date = getDate(navigation)
      return <Dashboard navigation={navigation} date={date} {...rest} />
    },
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      const hideNav = getNavigationParam(navigation, "hideNav")
      const hideProfileButton = getNavigationParam(navigation, "hideProfileButton")
      return {
        gesturesEnabled: false,
        headerTitle: hideNav ? null : (
          <NavigationDatePicker navigation={navigation} date={date} />
        ),
        headerLeft: hideProfileButton ? null : <ProfileButton navigation={navigation} />,
        headerRight: hideNav ? null : <FeedButton navigation={navigation} />
      }
    }
  },
  ...feelingRoutes,
  ...bodyRoutes,
  ...bookingRoutes,
  ...nutritionRoutes,
  ...trainingRoutes,
  ...stepsNavigator,
  ...profileNavigator,
  ...nutritionJournalRoutes,
  ...reportRoutes,
  ...workoutBuilderRoutes,
  // Modals
  [r.FeedScreen]: {
    screen: Feed,
    path: "/home/feed",
    navigationOptions: () => ({
      ...modalNavigationOptions,
      title: "Feed",
      headerRight: <MarkAllButton />
    })
  },
  [r.MonthPicker]: {
    screen: TitleMonthPicker,
    path: "/month-picker",
    navigationOptions: () => ({
      ...modalNavigationOptions,
      headerLeft: null,
      title: "Select Month",
      gestureResponseDistance: { vertical: 500 }
    })
  },
  [r.PopupPicker]: {
    screen: PopupPicker,
    path: "/popup-picker",
    navigationOptions: () => ({
      ...modalNavigationOptions,
      headerLeft: null,
      gestureResponseDistance: { vertical: 500 }
    })
  },
  [r.PopupFilter]: {
    screen: PopupFilter,
    path: "/popup-filter",
    navigationOptions: () => ({
      ...modalNavigationOptions,
      title: "Filter"
    })
  }
}

const MODAL_ROUTES = [
  r.ProfileScreen,
  r.FeedScreen,
  r.PrivacyScreen,
  r.ExercisePopup,
  r.ExerciseInfo,
  r.OverviewScene,
  r.SetPopup,
  r.NutritionProfile,
  r.NutritionTipsFullContent,
  r.FoodItem,
  r.FoodBasket,
  r.KitchenFood,
  r.KitchenMeal,
  r.KitchenRecipe,
  r.Reservation,
  r.PopupFilter,
  r.NutritionJournalSource,
  r.NutritionJournalGuide,
  r.ReportScreen,
  r.ExerciseForm,
  r.TimeSelector,
  r.SpecsForm
]

const POPUP_ROUTES = [r.MonthPicker, r.PopupPicker]

const dynamicModalTransition = (transitionProps, prevTransitionProps) => {
  const isModal = MODAL_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
  )
  const isPopup = POPUP_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
  )
  if (isModal || isPopup) {
    return verticalTransitionConfig(
      transitionProps,
      prevTransitionProps,
      isModal,
      isPopup
    )
  }
  return horizontalTransitionConfig(transitionProps, prevTransitionProps, isModal)
  /**
   * Default transition config can be used with this function call:
   * StackViewTransitionConfigs.defaultTransitionConfig(...)
   */
}

/**
 * See all options here: https://reactnavigation.org/docs/en/stack-navigator.html
 */
const HomeNavigator = createStackNavigator(routes, {
  /**
   * mode - Defines the style for rendering and transitions:
   *  card - Use the standard iOS and Android screen transitions. This is the default.
   *  modal - Make the screens slide in from the bottom which is a common iOS pattern.
   *          Only works on iOS, has no effect on Android.
   */
  mode: "modal",
  /**
   * headerMode - Specifies how the header should be rendered:
   *  float - Render a single header that stays at the top and animates as screens are changed.
   *          This is a common pattern on iOS.
   *  screen - Each screen has a header attached to it and the header fades in and out together with the screen.
   *           This is a common pattern on Android.
   *  none - No header will be rendered.
   */
  headerMode: "float",
  headerBackTitleVisible: false,
  /* Options: uikit, fade-in-place (default) */
  headerTransitionPreset: "uikit",
  /* Options: left (Android default), center (iOS default) */
  headerLayoutPreset: "center",
  cardStyle: {
    backgroundColor: colors.transparent
  },
  /* Experimental. This one allows us to make the card transparent so it looks
   * like a modal when needed. (issues on Android)
   */
  transparentCard: true,
  //cardOverlayEnabled: true,
  defaultNavigationOptions: {
    headerTransparent: false,
    headerStyle,
    headerTitleStyle,
    headerTintColor: colors.white,
    headerTitle: ({ children }) => (
      <Text textAlign="center" ellipsizeMode="tail" numberOfLines={2} variant="h2">
        {children}
      </Text>
    ),
    gesturesEnabled: false
  },
  initialRouteName: "Dashboard",
  transitionConfig: dynamicModalTransition
})

/**
 * This is quite an ugly decoration. Would be nice to have a more declarative
 * way to listen for 4xx and integrate it in the routing/navigation.
 */
class HomeStackWithAuth extends React.Component {
  static router = {
    ...HomeNavigator.router
  }

  componentDidMount() {
    const props = this.props
    if (props && props.screenProps && props.screenProps.authFailurePublisher) {
      props.screenProps.authFailurePublisher.subscribe(status => {
        if (status === 403 || status === 401) {
          props.screenProps.resetApp()
          props.navigation.navigate({ routeName: "Login" })
        }
      })
    }
  }

  render() {
    const { navigation } = this.props
    return <HomeNavigator navigation={navigation} />
  }
}

export default HomeStackWithAuth
