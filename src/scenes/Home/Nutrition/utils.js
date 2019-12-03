import "symbol-observable"
import { combineLatest, from } from "rxjs"
import { pluck, distinctUntilChanged, debounceTime } from "rxjs/operators"
import { mapPropsStreamWithConfig } from "recompose"

const rxjsConfig = {
  fromESObservable: from,
  toESObservable: stream => stream
}

import { NUTRITION_TRACKER_FORM } from "constants"

export const getProfileForMetric = tracker => {
  if (
    !tracker ||
    !tracker.nodes ||
    tracker.nodes.length === 0 ||
    !tracker.nodes[0].profileBody
  ) {
    return null
  }
  const profile = tracker.nodes[0]
  try {
    return JSON.parse(profile.profileBody)
  } catch (e) {
    return null
  }
}

export const debounceTermProp = (debounce = 300) => {
  const searchTermPipe = props$ => {
    const term$ = props$.pipe(
      pluck("term"),
      distinctUntilChanged(),
      debounceTime(debounce)
    )

    const pass$ = props$.map(({ term, ...rest }) => rest)

    const projection = (props, term) => ({
      ...props,
      data: { ...props.data, loading: true },
      term
    })

    return combineLatest(pass$, term$, projection)
  }

  return mapPropsStreamWithConfig(rxjsConfig)(searchTermPipe)
}

/* Tracker Cache helpers */

export const getMealItemAddress = (index, mealIndex) =>
  `${NUTRITION_TRACKER_FORM}.meals[${mealIndex}].entries[${index}]`

export const mealLabelByIndex = index => `Meal ${index + 1}`
