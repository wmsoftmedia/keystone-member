import { actions } from "react-redux-form/native"
import { debounceTime, map, filter, flatMap } from "rxjs/operators"
import { of, merge, concat } from "rxjs"
import { ofType } from "redux-observable"

import { NUTRITION_TRACKER_FORM } from "constants"
import { cals } from "keystone"
import { getParentPath } from "epics/nutritionTrackerEpic/utils"
import _ from "lodash/fp"

const isMacroChange = path =>
  path.includes("macros.protein") ||
  path.includes("macros.carbs") ||
  path.includes("macros.fat") ||
  path.includes("macros.cals")

const isLabelChange = path => path.includes("label")

const calculateMacros = (action, store) => {
  const macroPath = getParentPath(action.model)

  const macros = _.getOr({ protein: 0, carbs: 0, fat: 0 }, macroPath, store)

  const cal = macros.cals || cals(macros)

  const cal$ = of(actions.change(`${getParentPath(macroPath)}.cals`, cal))
  return concat(cal$, of(actions.submit(NUTRITION_TRACKER_FORM)))
}

export default (action$, state$) => {
  const changeActions$ = action$.pipe(ofType("rrf/change"))

  const labelChange = changeActions$.pipe(
    filter(action => isLabelChange(action.model)),
    map(() => actions.submit(NUTRITION_TRACKER_FORM)),
    debounceTime(1000)
  )

  const macrosChange = changeActions$.pipe(
    filter(action => isMacroChange(action.model)),
    flatMap(action => calculateMacros(action, state$.value))
  )

  return merge(labelChange, macrosChange)
}
