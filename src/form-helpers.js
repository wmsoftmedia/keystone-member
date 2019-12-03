import { LayoutAnimation } from "react-native"
import { actions } from "react-redux-form/native"

const animate = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

export const fieldArrayPush = (fields, value, animated = true) => {
  if (animated === true) animate()
  fields.push(value)
}

export const fieldArrayInsert = (fields, index, value, animated = true) => {
  if (animated === true) animate()
  fields.insert(index, value)
}

export const fieldArrayRemove = (fields, index, animated = true) => {
  if (animated === true) animate()
  fields.remove(index)
}

export const fieldArrayPushDelayed = (fields, value, animated, delay = 250) =>
  setTimeout(() => {
    fieldArrayPush(fields, value, animated)
  }, delay)

export const fieldArrayReplaceAt = (fields, index, newValue, animated = true) => {
  fieldArrayRemove(fields, index, animated)
  fieldArrayInsert(fields, index, newValue, animated)
}

// React Redux Form

export const push = dispatch => (path, value, animated = true) => {
  if (animated) animate()
  dispatch(actions.push(path, value))
}

export const remove = dispatch => (path, index, animated = true) => {
  if (animated) animate()
  dispatch(actions.remove(path, index))
}

export const replaceAt = dispatch => (path, value, animated = true) => {
  if (animated) animate()
  dispatch(actions.push(path, value))
}

// Common Validations

export const validateRequired = value => (value ? undefined : "Required")

export const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i.test(value)
    ? "Invalid email address"
    : undefined
