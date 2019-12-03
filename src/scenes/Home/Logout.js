import { Alert, NetInfo } from "react-native"
import { TouchableOpacity } from "glamorous-native"
import { connect } from "react-redux"
import { withApollo } from "react-apollo"
import { withNavigation } from "react-navigation"
import React, { Component } from "react"

import { LogoutIcon } from "kui/icons"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { onSignOut } from "auth"
import { unauth } from "ApolloContainer"
import { sendDeviceId } from "deviceId"

class Logout extends Component {
  logout = () => {
    const { navigation, client, resetApp } = this.props
    const handleLogout = async () => {
      const logoutCleanup = () => {
        onSignOut(client)
          .then(() => {
            navigation.navigate({ routeName: "Login" })
            resetApp()
          })
          .catch(e => console.warn("Logout failed", e.message))
      }

      try {
        await sendDeviceId(client, false)
      } catch (error) {
        logErrorWithMemberId(memberId => {
          console.error(`MId:{${memberId}}, ${error}`)
        })
      } finally {
        unauth()
        logoutCleanup()
      }
    }

    NetInfo.isConnected.fetch().then(online => {
      if (!online) {
        const title = "Could not sign out"
        const message = "A network connection is required to sign out"
        const options = [{ text: "Okay" }]
        Alert.alert(title, message, options)
      } else {
        const title = "Logout?"
        const message = "Are you sure you would like logout?"
        const options = [{ text: "Cancel" }, { text: "Logout", onPress: handleLogout }]
        Alert.alert(title, message, options)
      }
    })
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        opacity={1}
        paddingVertical={5}
        paddingHorizontal={10}
        onPress={this.logout}
        alignItems="center"
        justifyContent="center"
      >
        <LogoutIcon />
      </TouchableOpacity>
    )
  }
}

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

export default withNavigation(
  withApollo(
    connect(
      null,
      mapDispatchToProps
    )(Logout)
  )
)
