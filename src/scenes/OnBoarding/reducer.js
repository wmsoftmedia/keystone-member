import { ON_BOARDING_SET } from "scenes/OnBoarding/actions"

const initialState = {
  showWelcome: true
}

const onBoardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_BOARDING_SET:
      return { ...state, [action.name]: action.index }
    default:
      return state
  }
}

export default onBoardingReducer
