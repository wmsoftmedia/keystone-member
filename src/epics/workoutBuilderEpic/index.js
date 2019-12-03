import { debounceTime, tap } from "rxjs/operators"
import { partition, merge } from "rxjs"
import * as Sentry from "sentry-expo"
import _ from "lodash/fp"

import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { saveMemberWorkoutTemplate } from "graphql/mutation/workout/saveMemberWorkout"
import workoutBuilderPush from "epics/workoutBuilderEpic/workoutBuildeEpic"
import { pushWithForce } from "epics/workoutBuilderEpic/workoutBuildeEpic"
import { modelEncoder } from "scenes/Home/WorkoutBuilder/codecs"

const persistEffect = client => workoutBuilder => {
  const hasData = !!_.getOr(false, "model", workoutBuilder) === true
  if (!hasData) {
    return
  }
  const workoutTemplate = {
    id: workoutBuilder.model.id,
    name: _.getOr("", "model.info.name", workoutBuilder),
    model: JSON.stringify(modelEncoder(workoutBuilder.model)),
    difficulty: _.getOr("", "model.info.difficulty", workoutBuilder),
    duration: Math.ceil(_.getOr(0, "model.info.duration", workoutBuilder) / 60),
    notes: _.getOr("", "model.info.notes", workoutBuilder)
  }

  saveMemberWorkoutTemplate(client)(workoutTemplate)
    .then(result => {
      //console.log("saveMemberWorkoutTemplate.result", result)
    })
    .catch(e => {
      console.warn(e)
      logErrorWithMemberId(memberId => {
        Sentry.captureException(
          new Error(
            `MId:{${memberId}}, Scope:{workoutBuilderEpic.saveMemberWorkoutTemplate}, ${_.toString(
              e
            )}`
          )
        )
      })
    })
}

const isSubmitAction = action =>
  action.type === "workoutBuilder/addIntent" && action.intent === "submit"

const workoutBuilderEpic = (action$, state$, deps) => {
  const workoutBuilderEntry$ = workoutBuilderPush(action$, state$)
  const workoutBuilderForceSave$ = pushWithForce(action$)
  const [submitAction$, rest$] = partition(workoutBuilderEntry$, isSubmitAction)
  return merge(
    rest$,
    submitAction$.pipe(
      debounceTime(2000),
      tap(() => persistEffect(deps.apolloClient)(state$.value.workoutBuilder))
    ),
    workoutBuilderForceSave$.pipe(
      tap(() => persistEffect(deps.apolloClient)(state$.value.workoutBuilder))
    )
  )
}

export default workoutBuilderEpic
