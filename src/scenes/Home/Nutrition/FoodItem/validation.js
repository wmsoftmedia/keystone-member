export const isValid = value =>
  value !== null &&
  (value === "" ||
    !!String(value).match(
      /^((0|[1-9]\d{0,4})|((0|[1-9]\d{0,4}|[1-9]{0,1})[.,]\d{1,4}))$/
    ))
