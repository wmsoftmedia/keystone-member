import { actions } from "react-redux-form/native"
import { connect } from "react-redux"

import { NUTRITION_TRACKER_FORM } from "constants"

export const withTrackerSubmit = Component =>
  connect(
    null,
    dispatch => ({
      submitTracker: () => {
        dispatch(actions.submit(NUTRITION_TRACKER_FORM))
      }
    })
  )(Component)
