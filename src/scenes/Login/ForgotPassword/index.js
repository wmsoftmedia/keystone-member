import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { View } from "glamorous-native"
import React from "react"

import { forgotPassword } from "auth"
import ForgotPasswordForm from "scenes/Login/ForgotPassword/ForgotPasswordForm"
import colors, { gradients } from "kui/colors"

class ForgotPassword extends React.Component {
  handleSubmitSuccess = res => {
    const alert =
      res.status === "error"
        ? {
            title: "Cannot reset password",
            text: "Cannot reset password. Please try again.",
            action: [{ text: "Close" }]
          }
        : {
            title: "Almost there!",
            text:
              "A reset email has been sent. Please check your email to finish password reset.",
            action: [
              {
                text: "Log In",
                onPress: () => {
                  Keyboard.dismiss()
                  this.props.navigation.navigate("Login")
                }
              }
            ]
          }
    Alert.alert(alert.title, alert.text, alert.action)
  }

  render() {
    const { state } = this.props.navigation

    return (
      <View backgroundColor={colors.darkBlue90} flex={1}>
        <LinearGradient colors={gradients.bg1} style={StyleSheet.absoluteFill} />
        <KeyboardAvoidingView behavior="padding" flex={1}>
          <ForgotPasswordForm
            initialValues={{ email: state.params ? state.params.email : "" }}
            onSubmit={formData => forgotPassword(formData.email)}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
        </KeyboardAvoidingView>
      </View>
    )
  }
}

export default ForgotPassword
