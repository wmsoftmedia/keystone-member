import React from "react"

import { getDate } from "native"
import { headerStyle, headerTitleStyle } from "styles"
import NavigationDatePicker from "components/NavigationDatePicker"
import SaveButton from "scenes/Home/Training/StepTracker/SaveButton"
import StepTracker from "scenes/Home/Training/StepTracker"

export const stepsNavigator = {
  StepTracker: {
    screen: ({ navigation, ...rest }) => (
      <StepTracker {...rest} {...navigation.state.params} date={getDate(navigation)} />
    ),
    path: "/steps",
    navigationOptions: ({ navigation }) => {
      const date = getDate(navigation)
      return {
        headerTitleStyle,
        headerStyle,
        headerBackTitle: null,
        headerTitle: <NavigationDatePicker navigation={navigation} date={date} />,
        headerRight: <SaveButton navigation={navigation} />
      }
    }
  }
}
