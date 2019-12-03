import { debounceTime } from "rxjs/operators"
import { partition, merge } from "rxjs"

import foodEntryEpic from "./foodEntryEpic"
import macroEntryEpic from "./macroEntryEpic"
import waterEntryEpic from "./waterEntryEpic"

const foodEpic = (action$, store) => {
  const foodEntry$ = foodEntryEpic(action$, store)
  const macroEntry$ = macroEntryEpic(action$, store)
  const waterEntry$ = waterEntryEpic(action$, store)

  const out$ = merge(foodEntry$, macroEntry$)

  const [submitAction$, rest$] = partition(out$, isSubmitAction)

  return merge(rest$, submitAction$.pipe(debounceTime(1000)), waterEntry$)
}

const isSubmitAction = action =>
  action.type === "rrf/addIntent" && action.intent.type === "submit"

export default foodEpic
