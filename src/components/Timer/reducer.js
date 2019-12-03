import { TIMER_UPDATE, TIMER_UPDATE_ALL, TIMER_RESET } from "./actions"

const initialState = {}

const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case TIMER_UPDATE:
      return { ...state, [action.value.id]: action.value }
    case TIMER_UPDATE_ALL:
      return Object.keys(state).reduce((acc, key) => {
        acc[key] = { ...acc[key], ...action.value }
        return acc
      }, state)
    case TIMER_RESET:
      return {}
    default:
      return state
  }
}

export default timerReducer
