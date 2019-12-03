import _ from "lodash/fp"

import {
  UPDATE_TRAINING,
  FORCE_UPDATE_TRAINING,
  UPDATE_TRAINING_TIMER,
  RESET_TRAINING
} from "./actions"

const initialState = {}

const trainingReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TRAINING:
    case FORCE_UPDATE_TRAINING:
      return {
        ...state,
        ...(action.silentUpdate ? {} : { timestamp: Date.now() }),
        ...action.value
      }
    case UPDATE_TRAINING_TIMER:
      const nodes = _.getOr([], "model.nodes", state).map(node => {
        const nodeId = _.getOr({}, "id", node)
        if (nodeId === action.value.id) {
          const { timer, ...rest } = _.getOr({}, "meta", node)
          node.meta = { ...rest, timer: action.value.timer }
        }
        return node
      })

      state.model && (state.model.nodes = nodes)
      return { ...state, ...(action.silentUpdate ? {} : { timestamp: Date.now() }) }
    case RESET_TRAINING:
      return initialState
    default:
      return state
  }
}

export default trainingReducer
