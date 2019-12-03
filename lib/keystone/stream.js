import { Observable, from, combineLatest } from "rxjs"
import { debounceTime, pluck, distinctUntilChanged, map } from "rxjs/operators"
import { mapPropsStreamWithConfig } from "recompose"

const rxjsConfig = {
  fromESObservable: ({ subscribe }) => new Observable(subscribe),
  toESObservable: stream => stream
}

export const debounceTermProp = (debounce = 300) => {
  const searchTermPipe = props$ => {
    const term$ = props$.pipe(
      pluck("term"),
      distinctUntilChanged(),
      debounceTime(debounce)
    )

    const pass$ = props$.pipe(map(({ term, ...rest }) => rest))

    const projection = (props, term) => ({
      ...props,
      data: { ...props.data, loading: true },
      term
    })

    return combineLatest(pass$, term$, projection)
  }

  return mapPropsStreamWithConfig(rxjsConfig)(searchTermPipe)
}
