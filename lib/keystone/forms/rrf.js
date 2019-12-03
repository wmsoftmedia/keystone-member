const coerceValue = value => {
  if (typeof value === "string" || typeof value === "number") {
    return `${value}`
  }
  return ""
}

export const inputPropsMapper = {
  value: props =>
    !props.defaultValue && !props.hasOwnProperty("value")
      ? coerceValue(props.viewValue)
      : props.value,
  onChange: props => val => {
    const normalize = props.normalize || (a => a)
    const normalizedValue = normalize(val, props.modelValue)
    props.onChange(normalizedValue || "")
  },
  onFocus: ({ onFocus }) => onFocus,
  onBlur: ({ onBlur }) => onBlur,
  focused: props => {
    return props.fieldValue.focus
  }
}
