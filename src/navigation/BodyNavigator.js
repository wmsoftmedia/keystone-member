import { createStackNavigator } from "react-navigation-stack"
import React from "react"
import moment from "moment"

import { DATE_FORMAT } from "keystone/constants"
import { SaveButton, SaveTrackerButton } from "scenes/Home/Body/Buttons"
import { SaveDataEntryButton } from "scenes/Home/Body/DataEntry/SubmitButton"
import { getDate, horizontalTransitionConfig } from "native"
import { isToday } from "keystone"
import Chart from "scenes/Home/Body/Chart"
import DataEntry from "scenes/Home/Body/DataEntry"
import Day, { MassAssignButton } from "scenes/Home/Body/Day"
import NavigationDatePicker from "components/NavigationDatePicker"
import Parts from "scenes/Home/Body/Tracker/Parts"
import Timeline, { AddDayButton } from "scenes/Home/Body/Timeline"
import Tracker from "scenes/Home/Body/Tracker"

export const bodyRoutes = {
  BodyTracker: {
    screen: ({ navigation, ...rest }) => <Tracker date={getDate(navigation)} {...rest} />,
    path: "/body/tracker",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      const title = isToday(date) ? "Today" : moment(date).format(DATE_FORMAT)
      return {
        title,
        headerTitle: <NavigationDatePicker navigation={navigation} date={date} />,
        headerBackTitle: "Back",
        headerRight: <SaveTrackerButton navigation={navigation} />
      }
    }
  },
  BodyTrackerParts: {
    screen: ({ navigation, ...rest }) => {
      const { measurement } = navigation.state.params
      return <Parts date={getDate(navigation)} measurement={measurement} {...rest} />
    },
    path: "/body/tracker/parts",
    navigationOptions: ({ navigation }) => {
      const { measurement } = navigation.state.params
      const title = measurement.label
      return {
        title,
        headerRight: <SaveButton onPress={() => navigation.goBack(null)} />
      }
    }
  },
  BodyTimeline: {
    screen: Timeline,
    path: "/body/timeline",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      return {
        title: "Progress Timeline",
        headerRight: <AddDayButton navigation={navigation} date={date} />
      }
    }
  },
  BodyDay: {
    screen: ({ navigation }) => {
      const { params } = navigation.state
      return <Day date={getDate(navigation)} {...params} />
    },
    path: "/body/day",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      return {
        headerTitle: <NavigationDatePicker navigation={navigation} date={date} />,
        headerRight: <MassAssignButton navigation={navigation} date={date} />
      }
    }
  },
  BodyChart: {
    screen: ({ navigation, ...rest }) => {
      const { params } = navigation.state
      return <Chart {...rest} {...params} />
    },
    path: "/body/day/chart",
    navigationOptions: ({ navigation }) => {
      const { title } = navigation.state.params
      return {
        title: title || "Body Chart"
      }
    }
  },
  BodyDataEntry: {
    screen: ({ navigation, ...rest }) => {
      const { params } = navigation.state
      return <DataEntry {...rest} {...params} />
    },
    path: "/body/day/dataEntry",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      return {
        headerTitle: <NavigationDatePicker navigation={navigation} date={date} />,
        headerRight: <SaveDataEntryButton navigation={navigation} date={date} />
      }
    }
  }
}

const BodyNavigator = createStackNavigator(bodyRoutes, {
  mode: "screen",
  initialRouteName: "BodyTimeline",
  headerMode: "float",
  transitionConfig: horizontalTransitionConfig
})

export default BodyNavigator
