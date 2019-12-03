import { Form, actions } from "react-redux-form/native"
import { View } from "glamorous-native"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"

import { MEASUREMENTS_TRACKER_FORM } from "constants"
import { round } from "keystone"
import MeasurementFields from "scenes/Home/Body/Tracker/MeasurementFields"

class TrackerForm extends React.Component {
  render() {
    const { measurements, onSubmit, onChange } = this.props
    return (
      <View flex={1}>
        <Form
          model={MEASUREMENTS_TRACKER_FORM}
          onSubmit={onSubmit}
          onChange={onChange}
          style={{ flex: 1 }}
        >
          <MeasurementFields measurements={measurements} />
        </Form>
      </View>
    )
  }
}

const partsSum = parts =>
  parts.reduce((a, { value = 0 }) => +a + parseFloat(+value || 0), 0)

const updateMeasurementTotals = dispatch => (measurement, i) => {
  const { parts } = measurement
  if (parts && parts.length > 0) {
    const sum = round(partsSum(parts))
    const targetField = `${MEASUREMENTS_TRACKER_FORM}.measurements[${i}].value`
    dispatch(actions.change(targetField, sum.toString()))
  }
}

const mapStateToProps = state => {
  const { measurements } = state.formsRoot.measurementsTracker
  return { measurements }
}

const mapDispatchToProps = (dispatch, { onSubmit, navigation }) => {
  return {
    onSubmit: form => {
      dispatch(
        actions.submit(
          MEASUREMENTS_TRACKER_FORM,
          onSubmit(form)
            .then(res => {
              dispatch(actions.setPristine(MEASUREMENTS_TRACKER_FORM))
              return res
            })
            .catch(e => {
              console.error(e)
              dispatch(actions.setDirty(MEASUREMENTS_TRACKER_FORM))
            })
        )
      )
      navigation.goBack()
    },
    onSubmitFailed: f => {
      console.error(f.$form.errors)
      dispatch(actions.setDirty(MEASUREMENTS_TRACKER_FORM))
    },
    onChange: ({ measurements }) => {
      measurements.forEach(updateMeasurementTotals(dispatch))
    }
  }
}

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TrackerForm)
)
