import { TouchableOpacity, StyleSheet } from "react-native"
import { actions } from "react-redux-form/native"
import { connect } from "react-redux"
import { withHandlers, compose } from "recompose"
import React from "react"

import { getOr } from "keystone"
import { STEPS_FORM } from "scenes/Home/Training/StepTracker/StepForm"
import Text from "kui/components/Text"

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12 }
})

const SaveButton = ({ onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text variant="button1">SAVE</Text>
  </TouchableOpacity>
)

const enhanced = compose(
  connect(
    state => {
      const form = getOr(
        { pristine: true, valid: true },
        "formsRoot.forms.stepTracker.$form",
        state
      )
      const value = getOr(null, "formsRoot.forms.stepTracker.steps.value", state)

      return {
        canSave: !form.pristine && form.valid && value
      }
    },
    dispatch => ({
      saveSteps: () => dispatch(actions.submit(STEPS_FORM))
    })
  ),
  withHandlers({
    onPress: props => compose(props.saveSteps)
  })
)

export default enhanced(props =>
  props.canSave ? <SaveButton onPress={props.onPress} /> : null
)
