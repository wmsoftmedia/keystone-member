import { createStackNavigator } from "react-navigation-stack"

import ForgotPassword from "scenes/Login/ForgotPassword"
import Login from "scenes/Login"

const AuthNavigator = createStackNavigator(
  { Login, ForgotPassword },
  { initialRouteName: "Login", headerMode: "none" }
)

export default AuthNavigator
