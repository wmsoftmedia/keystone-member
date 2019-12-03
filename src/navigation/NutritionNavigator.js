import { withProps } from "recompose"
import React from "react"
import moment from "moment"

import { DATE_FORMAT } from "keystone/constants"
import { FoodBasketContent } from "scenes/Home/Nutrition/components/Footer/FoodBasket"
import { IconButton } from "kui/components/Button"
import { ProgressIcon } from "kui/icons"
import { getDate } from "native"
import { isToday } from "keystone"
import { modalNavigationOptions } from "navigation/utils"
import { routes } from "navigation/routes"
import Achievements from "scenes/Home/Nutrition/Achievements"
import BarcodeNotFound from "scenes/Home/Nutrition/components/BarcodeNotFound"
import Basket from "scenes/Home/Nutrition/components/Basket"
import DayPlan from "scenes/Home/Nutrition/Tracker/DayPlan"
import FoodItem from "scenes/Home/Nutrition/FoodItem"
import FoodScanner from "scenes/Home/Nutrition/components/FoodScanner"
import KitchenDaySubmitButton from "scenes/Home/Nutrition/Kitchen/NewDay/HeaderSubmitButton"
import KitchenFoodSubmitButton from "scenes/Home/Nutrition/Kitchen/NewFood/HeaderSubmitButton"
import KitchenMealSubmitButton from "scenes/Home/Nutrition/Kitchen/NewMeal/HeaderSubmitButton"
import KitchenRecipeSubmitButton from "scenes/Home/Nutrition/Kitchen/NewRecipe/HeaderSubmitButton"
import ManageFood from "scenes/Home/Nutrition/Kitchen/ManageFood"
import MealSearch from "scenes/Home/Nutrition/MealSearch"
import NavigationDatePicker from "components/NavigationDatePicker"
import NewDay from "scenes/Home/Nutrition/Kitchen/NewDay"
import NewFood from "scenes/Home/Nutrition/Kitchen/NewFood"
import NewMeal from "scenes/Home/Nutrition/Kitchen/NewMeal"
import NewRecipe from "scenes/Home/Nutrition/Kitchen/NewRecipe"
import OptionScreen from "scenes/Home/Nutrition/Kitchen/NewRecipe/OptionScreen"
import ProfilePreview from "scenes/Home/Nutrition/components/ProfilePreview"
import Tips from "scenes/Home/Nutrition/Tips"
import TipsFullContent from "scenes/Home/Nutrition/Tips/FullContent"
import TipsGeneral from "scenes/Home/Nutrition/Tips/GeneralTips"
import TipsHunger from "scenes/Home/Nutrition/Tips/HungerManagements"
import TipsSource from "scenes/Home/Nutrition/Tips/Source"
import Tracker from "scenes/Home/Nutrition/Tracker"
import Trends from "scenes/Home/Nutrition/Trends"
import _ from "lodash/fp"

const withDate = withProps(({ navigation }) => ({ date: getDate(navigation) }))

// Kitchen Routes
// ----------------------------------------------------------------------------

const kitchenRoutes = {
  [routes.KitchenRoot]: {
    screen: ManageFood,
    path: "/nutrition/kitchen/manage",
    navigationOptions: () => ({
      title: "Kitchen"
    })
  },
  [routes.KitchenMeal]: {
    screen: NewMeal,
    path: "/nutrition/kitchen/meal",
    navigationOptions: {
      ...modalNavigationOptions,
      title: "My Meal",
      headerRight: <KitchenMealSubmitButton />
    }
  },
  [routes.KitchenFood]: {
    screen: NewFood,
    path: "/nutrition/kitchen/food",
    navigationOptions: {
      ...modalNavigationOptions,
      title: "My Food",
      headerRight: <KitchenFoodSubmitButton />
    }
  },
  [routes.KitchenRecipe]: {
    screen: NewRecipe,
    path: "/nutrition/kitchen/recipe",
    navigationOptions: {
      ...modalNavigationOptions,
      title: "My Recipe",
      headerRight: <KitchenRecipeSubmitButton />
    }
  },
  KitchenRecipeNotes: {
    screen: OptionScreen,
    path: "/nutrition/kitchen/recipe/notes",
    navigationOptions: {
      title: "Recipe Details"
    }
  },
  [routes.KitchenDay]: {
    screen: NewDay,
    path: "/nutrition/kitchen/day",
    navigationOptions: {
      title: "My Day",
      headerRight: <KitchenDaySubmitButton />
    }
  }
}

// Routes
// ----------------------------------------------------------------------------

export const nutritionRoutes = {
  NutritionTracker: {
    screen: withDate(Tracker),
    path: "/nutrition/tracker/:date",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      const title = isToday(date) ? "Today" : moment(date).format(DATE_FORMAT)
      return {
        title,
        headerTitle: (
          <NavigationDatePicker
            navigation={navigation}
            date={date}
            pickerProps={{ allowFutureDates: true }}
          />
        ),
        headerRight: (
          <IconButton onPress={() => navigation.navigate(routes.NutritionTrends)}>
            <ProgressIcon />
          </IconButton>
        )
      }
    }
  },
  [routes.NutritionProfile]: {
    screen: props => {
      const { navigation } = props
      const profile = _.getOr(null, "state.params.profile", navigation)
      return <ProfilePreview {...props} profile={profile} />
    },
    path: "/nutrition/tracker/:date/profile",
    navigationOptions: () => {
      return {
        ...modalNavigationOptions,
        title: "Nutrition Profile"
      }
    }
  },
  [routes.FoodItem]: {
    screen: props => {
      const { navigation } = props
      const params = _.getOr({}, "state.params", navigation)
      return <FoodItem {...props} {...params} />
    },
    path: "/nutrition/tracker/:date/item",
    navigationOptions: ({ navigation }) => {
      const title = _.getOr("Food Item", "state.params.item.label", navigation)
      return {
        ...modalNavigationOptions,
        title
      }
    }
  },
  [routes.MealSearch]: {
    screen: MealSearch,
    path: "/nutrition/mealPlans",
    navigationOptions: {
      title: "Meals"
    }
  },
  [routes.NutritionDayPlans]: {
    screen: props => {
      const { navigation } = props
      const params = _.getOr({}, "state.params", navigation)
      return <DayPlan {...props} {...params} />
    },
    path: "/nutrition/tracker/:date/plans",
    navigationOptions: () => {
      return {
        title: "Day Plans"
      }
    }
  },
  [routes.FoodScanner]: {
    screen: props => {
      const {
        state: { params }
      } = props.navigation
      return (
        <FoodScanner
          navigation={props.navigation}
          onSearchComplete={params.onSearchComplete}
          onSearchError={params.onSearchError}
        />
      )
    },
    path: "/nutrition/tracker/:date/:basket/scanner",
    navigationOptions: {
      title: "Scan Barcode"
    }
  },
  [routes.FoodSearchRoot]: {
    screen: Basket,
    path: "/nutrition/tracker/:date/search",
    navigationOptions: ({ navigation }) => {
      const title = _.getOr("Food Search", "state.params.mealName", navigation)
      return { title }
    }
  },
  [routes.FoodBasket]: {
    screen: props => {
      const { navigation } = props
      const params = _.getOr(null, "state.params", navigation)
      return <FoodBasketContent {...props} {...params} />
    },
    path: "/nutrition/tracker/:date/basket",
    navigationOptions: () => {
      return {
        ...modalNavigationOptions,
        title: "Selected Items"
      }
    }
  },
  NutritionTrends: {
    screen: withDate(Trends),
    path: "/nutrition/progress",
    navigationOptions: () => ({
      title: "Nutrition Progress"
    })
  },
  BarcodeNotFound: {
    screen: BarcodeNotFound,
    path: "/nutrition/barcodes",
    navigationOptions: {
      title: "Add to Keystone"
    }
  },
  // Kitchen
  ...kitchenRoutes,
  NutritionTips: {
    screen: Tips,
    path: "/nutrition/tips",
    navigationOptions: {
      title: "Tips"
    }
  },
  NutritionGeneralTips: {
    screen: TipsGeneral,
    path: "/nutrition/tips/general",
    navigationOptions: {
      title: "General Tips"
    }
  },
  NutritionHungerManagement: {
    screen: TipsHunger,
    path: "/nutrition/tips/hunger",
    navigationOptions: {
      title: "Hunger Management"
    }
  },
  NutritionTipsFullContent: {
    screen: props => {
      const params = _.getOr({}, "navigation.state.params", props)
      return <TipsFullContent {...params} />
    },
    path: "/nutrition/tips/full",
    navigationOptions: props => {
      const title = _.getOr("Tips", "navigation.state.params.screenTitle", props)
      return {
        ...modalNavigationOptions,
        title
      }
    }
  },
  NutritionTipsSource: {
    screen: props => {
      const { navigation } = props
      const params = _.getOr({}, "state.params", navigation)
      return <TipsSource {...params} />
    },
    path: "/nutrition/tips/full",
    navigationOptions: props => {
      const title = _.getOr("Source", "navigation.state.params.screenTitle", props)
      return { title }
    }
  },
  NutritionAchievements: {
    screen: Achievements,
    path: "/nutrition/achievements",
    navigationOptions: {
      title: "Achievements"
    }
  }
}
