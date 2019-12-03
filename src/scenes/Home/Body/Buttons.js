import { TouchableOpacity, StyleSheet } from "react-native"
import { actions } from "react-redux-form/native"
import { compose } from "recompose"
import { connect } from "react-redux"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"

import { MEASUREMENTS_TRACKER_FORM } from "constants"
import { TextButton } from "kui/components/Button"
import colors from "kui/colors"

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12 }
})

export const SaveButton = ({ onPress, color = colors.white }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons color={color} name={"ios-checkmark"} size={42} />
    </TouchableOpacity>
  )
}

const enhanced = compose(
  connect(
    state => {
      const form = state.formsRoot.forms.measurementsTracker.$form
      const { pristine } = form
      return {
        pristine
      }
    },
    dispatch => ({
      saveMeasurements: () => dispatch(actions.submit(MEASUREMENTS_TRACKER_FORM))
    })
  )
)

export const SaveTrackerButton = enhanced(props => {
  const { saveMeasurements, pristine } = props
  return !pristine ? <TextButton label="SAVE" onPress={saveMeasurements} /> : null
})
