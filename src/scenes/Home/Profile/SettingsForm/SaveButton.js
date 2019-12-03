import { actions } from "react-redux-form/native"
import { compose } from "recompose"
import { connect } from "react-redux"
import React from "react"
import _ from "lodash/fp"

import { PROFILE_SETTINGS_FORM } from "constants"
import { TextButton } from "kui/components/Button"

const enhance = compose(
  connect(
    state => {
      const form = _.getOr({}, "formsRoot.forms.profileSettings.$form", state)
      const { pristine, valid } = form
      return { show: valid && !pristine }
    },
    dispatch => ({
      onSubmit: () => dispatch(actions.submit(PROFILE_SETTINGS_FORM))
    })
  )
)

const SaveButton = props => {
  const { onSubmit, show } = props
  return show ? <TextButton label="SAVE" onPress={onSubmit} paddingRight={20} /> : null
}

export default enhance(SaveButton)
