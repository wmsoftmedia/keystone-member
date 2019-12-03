import _ from "lodash/fp"
import {
  UPDATE_WORKOUT_BUILDER,
  FORCE_UPDATE_WORKOUT_BUILDER,
  RESET_WORKOUT_BUILDER
} from "./actions"

import { emptyWorkout } from "scenes/Home/WorkoutBuilder/common"

const initialState = {
  model: {
    id: null,
    ...emptyWorkout
  }
}

const trainingReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_WORKOUT_BUILDER:
    case FORCE_UPDATE_WORKOUT_BUILDER:
      return {
        ...state,
        ...(action.silentUpdate ? {} : { timestamp: Date.now() }),
        ...action.value
      }
    case RESET_WORKOUT_BUILDER:
      return {
        ...initialState,
        ...(action.silentUpdate ? {} : { timestamp: Date.now() })
      }
    default:
      return state
  }
}

export default trainingReducer
