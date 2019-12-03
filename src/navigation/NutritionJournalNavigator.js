import { getDate } from "native"
import { withProps } from "recompose"
import React from "react"
import _ from "lodash/fp"

import { BookIcon } from "kui/icons"
import { IconButton } from "kui/components/Button"
import { modalNavigationOptions } from "navigation/utils"
import { routes } from "navigation/routes"
import DayPlan from "scenes/Home/NutritionJournal/DayPlan"
import Guide from "scenes/Home/NutritionJournal/Guide"
import Meal from "scenes/Home/NutritionJournal/Meal"
import NavigationDatePicker from "components/NavigationDatePicker"
import Portion from "scenes/Home/NutritionJournal/Portion"
import Source from "scenes/Home/NutritionJournal/Source"

const withDate = withProps(({ navigation }) => ({ date: getDate(navigation) }))

export const nutritionJournalRoutes = {
  NutritionJournal: {
    screen: withDate(DayPlan),
    path: "/nutrition/journal/:date",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      return {
        title: "Nutrition Journal",
        headerTitle: (
          <NavigationDatePicker
            navigation={navigation}
            date={date}
            pickerProps={{ allowFutureDates: true }}
          />
        )
      }
    }
  },
  NutritionJournalMeal: {
    screen: props => {
      const params = _.getOr({}, "navigation.state.params", props)
      return <Meal {...params} />
    },
    path: "/nutrition/journal/:date/meal",
    navigationOptions: ({ navigation }) => {
      const title = _.getOr("Meal", "state.params.title", navigation)
      return {
        title,
        headerRight: (
          <IconButton onPress={() => navigation.navigate(routes.NutritionJournalGuide)}>
            <BookIcon />
          </IconButton>
        )
      }
    }
  },
  NutritionJournalSource: {
    screen: props => {
      const params = _.getOr({}, "navigation.state.params", props)
      return <Source {...params} />
    },
    path: "/nutrition/journal/:date/source",
    navigationOptions: props => {
      const title = _.getOr("Source", "navigation.state.params.title", props)
      return {
        ...modalNavigationOptions,
        title
      }
    }
  },
  NutritionJournalGuide: {
    screen: Guide,
    path: "/nutrition/journal/day",
    navigationOptions: () => ({
      ...modalNavigationOptions,
      title: "Portions Guide"
    })
  },
  NutritionJournalPortion: {
    screen: props => {
      const params = _.getOr({}, "navigation.state.params", props)
      return <Portion {...params} />
    },
    path: "/nutrition/journal/:date/source/portion",
    navigationOptions: () => ({
      title: "Select number of portions"
    })
  }
}
