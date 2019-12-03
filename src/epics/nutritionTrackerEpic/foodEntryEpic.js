import { actions } from "react-redux-form/native"
import { filter, map, flatMap } from "rxjs/operators"
import { of, merge, concat } from "rxjs"
import { ofType } from "redux-observable"

import { NUTRITION_TRACKER_FORM } from "constants"
import { servingToNutritionFacts } from "keystone/food"
import { toNumber } from "keystone"
import _ from "lodash/fp"

import { getParentPath } from "./utils"

const hasServing = path => {
  const passed =
    !path.includes("myFoodForm") &&
    (path.includes(".servingAmount") || path.includes(".servingUnit"))

  return passed
}

const getServing = (action, store) => {
  const entry = getParentPath(action.model)

  const rawServingAmount = toNumber(_.getOr("0", entry + ".servingAmount", store))
  const servingAmount = isFinite(rawServingAmount) ? toNumber(rawServingAmount) : 0

  const servingUnit = _.getOr("", entry + ".servingUnit", store)
  const servings = _.getOr([], entry + ".servings", store)
  const serving = servings.find(s => s.description === servingUnit)
  const macros = servingToNutritionFacts(serving, servingAmount)
  const cal = macros.cals

  return { entry, cal, macros }
}

const updateCalsMacros = results => {
  const { entry, cal, macros } = results

  const cal$ = of(actions.change(`${entry}.cals`, cal))
  const macro$ = of(actions.change(`${entry}.macros`, macros))

  return concat(merge(cal$, macro$), of(actions.submit(NUTRITION_TRACKER_FORM)))
}

export default (action$, state$) => {
  return action$.pipe(
    ofType("rrf/change"),
    filter(action => hasServing(action.model, state$.value)),
    map(action => getServing(action, state$.value)),
    flatMap(updateCalsMacros)
  )
}
