import React from "react"
import moment from "moment"

import { DATE_FORMAT } from "keystone/constants"
import { getDate } from "native"
import { isToday } from "keystone"
import NavigationDatePicker from "components/NavigationDatePicker"
import SaveButton from "scenes/Home/Feelings/SaveButton"
import Tracker from "scenes/Home/Feelings/Tracker"
import Trends, { ShowTipsButton } from "scenes/Home/Feelings/Trends"

export const feelingRoutes = {
  FeelingTrends: {
    screen: ({ navigation, ...rest }) => {
      return <Trends date={getDate(navigation)} {...rest} />
    },
    path: "/feelings/trends",
    navigationOptions: ({ navigation }) => ({
      title: "Feeling Trends",
      headerRight: <ShowTipsButton navigation={navigation} />
    })
  },
  FeelingsTracker: {
    screen: ({ navigation, ...rest }) => <Tracker date={getDate(navigation)} {...rest} />,
    path: "/feelings/tracker",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      const title = isToday(date) ? "Today" : moment(date).format(DATE_FORMAT)
      return {
        title,
        headerTitle: <NavigationDatePicker navigation={navigation} date={date} />,
        headerRight: <SaveButton navigation={navigation} />
      }
    }
  }
}
