import React from "react"
import _ from "lodash/fp"

import { modalNavigationOptions } from "navigation/utils"
import SaveButton from "scenes/Home/Profile/SettingsForm/SaveButton"
import Logout from "scenes/Home/Logout"
import Privacy from "scenes/Home/Profile/Privacy"
import Profile from "scenes/Home/Profile"
import Settings from "scenes/Home/Profile/Settings"
import SettingsForm from "scenes/Home/Profile/SettingsForm"

export const profileNavigator = {
  ProfileScreen: {
    screen: Profile,
    path: "/home/profile",
    navigationOptions: () => ({
      ...modalNavigationOptions,
      title: "Profile",
      headerRight: <Logout />
    })
  },
  PrivacyScreen: {
    screen: Privacy,
    path: "/home/profile/privacy-policy",
    navigationOptions: () => ({
      ...modalNavigationOptions,
      title: "Privacy & Legal"
    })
  },
  ProfileSettings: {
    screen: Settings,
    path: "/home/profile/settings",
    navigationOptions: {
      title: "Profile Settings"
    }
  },
  ProfileSettingsForm: {
    screen: props => {
      const params = _.getOr({}, "navigation.state.params", props)
      return <SettingsForm {...params} />
    },
    path: "/home/profile/settings/update",
    navigationOptions: ({ navigation }) => {
      const title = _.getOr("Update Settings", "state.params.title", navigation)
      return {
        title,
        headerRight: <SaveButton navigation={navigation} />
      }
    }
  }
}
