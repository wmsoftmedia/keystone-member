import { debounceTime, tap } from "rxjs/operators"
import { partition, merge } from "rxjs"
import * as Sentry from "sentry-expo"
import _ from "lodash/fp"

import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { saveWorkoutSessionMutation } from "graphql/mutation/workout/saveWorkout"
import trainingEntryEpic from "epics/trainingTrackerEpic/trainingEntryEpic"
import { pushWithForce } from "epics/trainingTrackerEpic/trainingEntryEpic"

const persistEffect = client => workoutState => {
  const hasData = !!_.getOr(false, "model", workoutState) === true
  if (!hasData) {
    return
  }

  saveWorkoutSessionMutation(client)(workoutState)
    .then(result => {
      // console.log("saveWorkoutSessionMutation.result: ", result)
    })
    .catch(e => {
      console.warn(e)
      logErrorWithMemberId(memberId => {
        Sentry.captureException(
          new Error(
            `MId:{${memberId}}, Scope:{trainingTrackerEpic.saveWorkoutSessionMutation}, ${_.toString(
              e
            )}`
          )
        )
      })
    })
}

const isSubmitAction = action =>
  action.type === "workout/addIntent" && action.intent === "submit"

const trainingEpic = (action$, state$, deps) => {
  const workoutEntry$ = trainingEntryEpic(action$, state$)
  const workoutForceSave$ = pushWithForce(action$)
  const [submitAction$, rest$] = partition(workoutEntry$, isSubmitAction)
  return merge(
    rest$,
    submitAction$.pipe(
      debounceTime(2000),
      tap(() => persistEffect(deps.apolloClient)(state$.value.training))
    ),
    workoutForceSave$.pipe(
      tap(() => persistEffect(deps.apolloClient)(state$.value.training))
    )
  )
}

export default trainingEpic
