import { createStackNavigator } from "react-navigation-stack"

import { verticalTransitionConfig } from "native"
import ReportScreen from "scenes/Home/Report/ReportScreen"

const ReportNavigator = createStackNavigator(
  {
    ReportScreen: {
      screen: ReportScreen,
      path: "/report",
      navigationOptions: () => ({
        headerTitle: "Progress Report",
        headerRight: null
      })
    }
  },
  {
    initialRouteName: "ReportScreen",
    mode: "modal",
    headerMode: "screen",
    transitionConfig: verticalTransitionConfig
  }
)

export default ReportNavigator
