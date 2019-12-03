import { compose } from "recompose"
import { connect } from "react-redux"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { withApollo } from "react-apollo"
import React from "react"

import AuthNavigator from "navigation/AuthNavigator"
import HomeNavigator from "navigation/HomeNavigator"

const rootRoutes = {
  Home: HomeNavigator,
  Login: AuthNavigator
}

const createRouterConfig = (signedIn = false) => ({
  mode: "modal",
  initialRouteName: signedIn ? "Home" : "Login",
  headerMode: "none"
})

const createRootNavigator = isSignedIn =>
  createAppContainer(createSwitchNavigator(rootRoutes, createRouterConfig(isSignedIn)))

const mapDispatchToProps = (dispatch, ownProps) => {
  const { client } = ownProps
  return {
    resetApp: () =>
      setTimeout(() => {
        client.resetStore().then(() => {
          dispatch({ type: "@keystone/RESET_APP" })
        })
      }, 2000)
  }
}

export default compose(
  withApollo,
  connect(
    null,
    mapDispatchToProps
  )
)(props => {
  const { isSignedIn, authFailurePublisher, resetApp } = props
  const RootNavigator = createRootNavigator(isSignedIn)
  return <RootNavigator screenProps={{ authFailurePublisher, resetApp }} />
})
