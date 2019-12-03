import { actions } from "react-redux-form/native"
import { debounceTime, map, filter } from "rxjs/operators"
import { ofType } from "redux-observable"

import { WATER_TRACKER_FORM } from "../../scenes/Home/Nutrition/Tracker/WaterTracker/constants"

const isWaterChange = path => {
  return path.includes("water")
}

export default (action$, store) => {
  const changeActions$ = action$.pipe(ofType("rrf/change"))

  const labelChange = changeActions$.pipe(
    filter(action => isWaterChange(action.model)),
    map(() => actions.submit(WATER_TRACKER_FORM)),
    debounceTime(1000)
  )

  return labelChange
}
