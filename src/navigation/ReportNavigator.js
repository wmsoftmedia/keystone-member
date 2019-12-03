import { modalNavigationOptions } from "navigation/utils"
import { routes } from "navigation/routes"
import ReportScreen from "scenes/Home/Report/ReportScreen"

export const reportRoutes = {
  [routes.ReportScreen]: {
    screen: ReportScreen,
    path: "/report",
    navigationOptions: {
      ...modalNavigationOptions,
      title: "Progress Report"
    }
  }
}

export default reportRoutes
