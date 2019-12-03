import { SWITCH_SET } from "./actions"

const initialState = {}

const switchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_SET:
      return { ...state, [action.name]: action.index }
    default:
      return state
  }
}

export default switchReducer
