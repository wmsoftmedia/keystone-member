import { Field, reduxForm } from "redux-form"
import { Text, View } from "glamorous-native"
import { compose } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { PrimaryButton, SecondaryButton } from "kui/components/Button"
import { ReduxFormField } from "kui/components/Input"
import { validateEmail, validateRequired } from "form-helpers"
import colors from "kui/colors"

const ForgotPasswordForm = props => {
  const { handleSubmit, submitting, navigation } = props
  const isSubmitDisabled = submitting

  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <View width={"100%"} alignItems="center" justifyContent="center">
        <Text textAlign="center" color={colors.white} fontSize={28} lineHeight={36}>
          Reset password
        </Text>
        <Text
          marginTop={12}
          textAlign="center"
          color={colors.white50}
          fontSize={12}
          lineHeight={16}
          maxWidth={372}
          paddingHorizontal={20}
        >
          Password reset link will be sent to the email address specified below. Please,
          be patient - it may take a few minutes for the email to arrive.
        </Text>
        <Field
          width={320}
          marginTop={24}
          name="email"
          keyboardType="email-address"
          validate={[validateRequired, validateEmail]}
          placeholder="Email address"
          compact={false}
          component={ReduxFormField}
        />
        <PrimaryButton
          width={320}
          label={submitting ? "REQUESTING..." : "RESET PASSWORD"}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          loading={submitting}
        />
        <SecondaryButton
          width={320}
          marginTop={16}
          label={"CANCEL"}
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  )
}

export default compose(
  withNavigation,
  reduxForm({ form: "forgotPasswordForm" })
)(ForgotPasswordForm)
