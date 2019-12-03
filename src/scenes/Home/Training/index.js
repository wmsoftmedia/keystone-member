import { createStackNavigator } from "react-navigation-stack"
import React from "react"

import { getDate } from "native"

import { headerStyle, headerTitleStyle } from "../../../styles"
import DismissModal from "../Nutrition/buttons/DismissModal"
import NavigationDatePicker from "../../../components/NavigationDatePicker"
import SaveStepsButton from "./StepTracker/SaveButton"
import StepTracker from "./StepTracker"
import colors from "../../../colors"

export const StepNavigator = createStackNavigator(
  {
    StepTracker: {
      screen: ({ navigation, ...rest }) => (
        <StepTracker {...rest} {...navigation.state.params} date={getDate(navigation)} />
      ),
      path: "/steps",
      navigationOptions: ({ navigation }) => {
        const date = getDate(navigation)
        return {
          headerTitleStyle,
          headerLeft: <DismissModal />,
          headerStyle: { ...headerStyle, backgroundColor: colors.blue6 },
          headerTintColor: colors.headerFg2,
          headerBackTitle: null,
          headerTitle: <NavigationDatePicker navigation={navigation} date={date} />,
          headerRight: <SaveStepsButton navigation={navigation} />
        }
      }
    }
  },
  { initialRouteName: "StepTracker", headerMode: "float" }
)

export default TrainingNavigator
