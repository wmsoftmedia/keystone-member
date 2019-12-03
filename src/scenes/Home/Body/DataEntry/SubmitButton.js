import { actions } from "react-redux-form/native"
import { compose } from "recompose"
import { connect } from "react-redux"
import React from "react"

import { BODY_TRACKER_FORM } from "constants"
import { TextButton } from "kui/components/Button"

const enhanced = compose(
  connect(
    state => {
      const form = state.formsRoot.forms.bodyTracker.$form
      const { pristine, valid } = form
      return {
        canSubmit: valid && !pristine
      }
    },
    dispatch => ({
      onSubmit: () => dispatch(actions.submit(BODY_TRACKER_FORM))
    })
  )
)

export const SaveDataEntryButton = enhanced(props => {
  const { onSubmit, canSubmit } = props
  return canSubmit ? <TextButton label="SAVE" onPress={onSubmit} /> : null
})
