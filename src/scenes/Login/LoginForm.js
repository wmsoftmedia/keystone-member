import { Field, getFormValues, reduxForm } from "redux-form"
import { View } from "glamorous-native"
import { compose } from "recompose"
import { connect } from "react-redux"
import React from "react"

import { PrimaryButton } from "kui/components/Button"
import { ReduxFormField } from "kui/components/Input"
import { validateEmail, validateRequired } from "form-helpers"

class LoginForm extends React.Component {
  render() {
    const { submitting, handleSubmit } = this.props
    return (
      <View flex={1}>
        <Field
          name="email"
          placeholder="Email address"
          keyboardType="email-address"
          validate={[validateRequired, validateEmail]}
          compact={false}
          component={ReduxFormField}
        />
        <Field
          name="password"
          placeholder="Password"
          secureTextEntry
          validate={[validateRequired]}
          compact={false}
          component={ReduxFormField}
        />
        <PrimaryButton
          label={submitting ? "VERIFYING..." : "LOGIN"}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </View>
    )
  }
}

const LOGIN_FORM = "loginForm"

const mapStateToProps = (state, ownProps) => {
  const values = getFormValues(LOGIN_FORM)(state)
  return {
    initialValues: {
      email: values ? values.email : "",
      password: ""
    },
    onSubmit: ownProps.submit,
    onSubmitSuccess: ownProps.onSubmitSuccess
  }
}

export default compose(
  connect(mapStateToProps),
  reduxForm({ form: "loginForm" })
)(LoginForm)
