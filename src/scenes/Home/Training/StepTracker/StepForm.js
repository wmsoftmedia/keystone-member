import { Form, actions } from "react-redux-form/native"
import { View } from "glamorous-native"
import { compose, withHandlers, toClass } from "recompose"
import { connect } from "react-redux"
import _ from "lodash/fp"
import React from "react"

import { withMemberId } from "hoc"
import IncrementalField from "components/form/IncrementalField"
import MobileSteps from "scenes/Home/Training/StepTracker/MobileSteps"
import saveSteps from "graphql/mutation/steps/upsertSteps"

export const STEPS_FORM = "formsRoot.stepTracker"

const commaNormalizer = _.replace(",", "")
const pointNormalizer = _.replace(".", "")
const negNormalizer = _.replace("-", "")
const inputNormalizer = compose(
  negNormalizer,
  commaNormalizer,
  pointNormalizer
)

const styles = {
  form: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end"
  }
}

const loadFormData = ({ dispatch, steps }) => {
  dispatch(
    actions.load(STEPS_FORM, {
      steps
    })
  )
}

const withRRFLoader = component =>
  class extends toClass(component) {
    constructor(props) {
      super(props)
      loadFormData(props)
    }
  }

const withRRFInit = compose(
  connect(),
  withRRFLoader
)

const enhance = compose(
  withMemberId,
  saveSteps,
  withRRFInit,
  withHandlers({
    onSetSteps: props => steps =>
      props.dispatch(actions.change(`${STEPS_FORM}.steps`, steps)),
    saveSteps: props => form => props.upsertSteps(form.steps, props.interval)
  })
)

export default enhance(props => (
  <Form style={styles.form} model={STEPS_FORM} onSubmit={props.saveSteps}>
    <View height={36}>
      <IncrementalField model=".steps" step={500} parser={inputNormalizer} />
    </View>
    {props.canCopyData && (
      <MobileSteps steps={props.mobileSteps} onSetSteps={props.onSetSteps} />
    )}
  </Form>
))
