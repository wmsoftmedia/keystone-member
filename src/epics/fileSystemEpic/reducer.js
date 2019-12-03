import { CLEAR_IMAGE_STORAGE } from "./actions"

const fileSystemReducer = (state = {}, action) => {
  switch (action.type) {
    case CLEAR_IMAGE_STORAGE:
      return state
    default:
      return state
  }
}

export default fileSystemReducer
