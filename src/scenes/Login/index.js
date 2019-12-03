import { Alert, Keyboard, StatusBar, StyleSheet } from "react-native"
import { KeyboardAvoidingView } from "react-native"
import { Image, View } from "glamorous-native"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import jwtDecode from "jwt-decode"

import { SecondaryButton } from "kui/components/Button"
import { authenticate, onSignIn } from "auth"
import { codeToMessage } from "errors"
import { sendDeviceId } from "deviceId"
import KeyboardDismissingView from "components/KeyboardDismissingView"
import LoginForm from "scenes/Login/LoginForm"
import Version from "components/Version"
import colors, { gradients } from "kui/colors"
import logo from "images/keystone-hf-logo.png"

const failedLoginHandler = (message, forgotCallback) => {
  Alert.alert("Cannot Login", message, [
    { text: "Forgot Password", onPress: forgotCallback },
    { text: "Try Again" }
  ])
}

const unauthorizedHandler = () => {
  Alert.alert("Unauthorized", "Only authorized members are allowed access.")
}

const authenticationSuccessHandler = async (token, memberId, navigation, client) => {
  onSignIn(token, memberId)
    .then(() => {
      sendDeviceId(client, true)
      navigation.navigate("Home")
    })
    .catch(e => Alert.alert("Error Occured", e.message))
}

class SignIn extends React.Component {
  UNSAFE_componentWillMount() {
    StatusBar.setHidden(false)
    StatusBar.setBarStyle("light-content")
  }

  handleForgotPassClick = () => {
    Keyboard.dismiss()
    this.props.navigation.navigate("ForgotPassword")
  }

  handleSignIn = ({ email, password }) => {
    return authenticate(email, password)
  }

  handleSignInSuccess = res => {
    const token = res.token
    if (token) {
      const { role, person_id } = jwtDecode(token)
      if (role !== "keystone_member") {
        unauthorizedHandler()
      } else {
        authenticationSuccessHandler(
          token,
          person_id,
          this.props.navigation,
          this.props.client
        )
      }
    } else {
      const message = codeToMessage(res.additionalCode)
      failedLoginHandler(message, () => this.handleForgotPassClick())
    }
  }

  render() {
    return (
      <View
        flex={1}
        backgroundColor={colors.darkBlue90}
        paddingVertical={20}
        paddingHorizontal={40}
      >
        <LinearGradient colors={gradients.bg1} style={StyleSheet.absoluteFill} />
        <KeyboardAvoidingView flex={1} behavior="padding">
          <KeyboardDismissingView>
            <View flex={0.8} alignItems="center" justifyContent="center">
              <Image maxHeight={72} width="100%" source={logo} resizeMode="contain" />
            </View>
          </KeyboardDismissingView>
          <LoginForm
            submit={this.handleSignIn}
            onSubmitSuccess={this.handleSignInSuccess}
          />
          <View justifyContent={"center"} alignItems={"center"}>
            <SecondaryButton
              labelProps={{ color: colors.white50 }}
              onPress={this.handleForgotPassClick}
              label={"FORGOT PASSWORD?"}
            />
          </View>
        </KeyboardAvoidingView>
        <Version color={colors.white50} />
      </View>
    )
  }
}

export default SignIn
