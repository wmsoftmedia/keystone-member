import { SET_LOADING, SET_ERROR, RESET } from "./actions"

const initialState = {
  error: null,
  isLoading: false,
  isSaved: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: action.status }
    case SET_ERROR:
      return { ...state, error: action.error }
    case RESET:
      return { ...initialState }
    default:
      return state
  }
}
