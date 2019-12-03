import { combineForms } from "react-redux-form/native"
import { combineReducers } from "redux"
import { reducer as reduxFormReducer } from "redux-form"

import _ from "lodash/fp"
import kitchenMealReducer from "scenes/Home/Nutrition/Kitchen/NewMeal/reducer"
import onBoardingReducer from "scenes/OnBoarding/reducer"
import fileSystemReducer from "epics/fileSystemEpic/reducer"
import switchReducer from "components/Switch/reducer"
import timerReducer from "components/Timer/reducer"
import trainingReducer from "scenes/Home/TrainingV3/redux/reducer"
import workoutBuilderReducer from "scenes/Home/WorkoutBuilder/redux/reducer"

const rootReducer = (state = {}, action) => {
  return combineReducers({
    form: reduxFormReducer,
    formsRoot: combineForms(
      {
        feelingsTracker: { feelings: [] },
        measurementsTracker: { measurements: [] },
        bodyTracker: {},
        nutritionTracker: { meals: [], isLoading: false, error: null },
        foodSearchTracker: { searchTerm: "" },
        myFoodForm: {},
        waterTracker: {},
        myFoodEntryForm: {},
        stepTracker: {},
        kitchenRecipe: { ingredients: [] },
        kitchenMeal: { items: [] },
        kitchenDay: { meals: [] },
        profileSettings: {},
        onBoardingForm: {}
      },
      "formsRoot"
    ),
    ui: combineReducers({
      switches: switchReducer,
      panels: () => ({})
    }),
    app: combineReducers({
      kitchenMeal: kitchenMealReducer,
      kitchenDay: kitchenMealReducer,
      kitchenRecipe: kitchenMealReducer
    }),
    timer: timerReducer,
    training: trainingReducer,
    workoutBuilder: workoutBuilderReducer,
    onBoarding: onBoardingReducer,
    fileSystem: fileSystemReducer
  })(state, action)
}

export default rootReducer
