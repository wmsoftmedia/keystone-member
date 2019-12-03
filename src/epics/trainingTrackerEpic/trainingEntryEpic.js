import { flatMap, debounceTime } from "rxjs/operators"
import { of } from "rxjs"
import { ofType } from "redux-observable"

const mkSubmitIntent = () => {
  return of({ type: "workout/addIntent", intent: "submit" }).pipe(debounceTime(2000))
}

export default action$ => {
  return action$.pipe(
    ofType("workout/update"),
    flatMap(mkSubmitIntent)
  )
}

const mkForceSubmitIntent = () => {
  return of({ type: "workout/addIntent", intent: "forceSubmit" })
}

export const pushWithForce = action$ => {
  return action$.pipe(
    ofType("workout/forceUpdate"),
    flatMap(mkForceSubmitIntent)
  )
}
