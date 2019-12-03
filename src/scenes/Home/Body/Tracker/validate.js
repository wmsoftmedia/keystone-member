export const normalizeMeasurementField = (value, previousValue) => {
  if (value) {
    return value.match(/^(?!0)+\d+[.,]{0,1}\d{0,2}$/) ? value : previousValue
  }

  return value
}
