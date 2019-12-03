import { compose } from "recompose"

import _ from "lodash/fp"

export const floatNormalizer = _.replace(",", ".")

export const positiveNormalizer = _.replace("-", "")

export const numberNormalizer = previousValue => value => {
  if (value) {
    return String(value).match(
      /^((0|[1-9]\d{0,4})|((0|[1-9]\d{0,4}|[1-9]{0,1})[.,]\d{0,4}))$/
    )
      ? String(value)
      : previousValue
  }

  return String(value)
}

export const positiveFloatNormalizer = compose(
  positiveNormalizer,
  floatNormalizer
)
