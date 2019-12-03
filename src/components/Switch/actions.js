export const SWITCH_SET = "SWITCH_SET"

export const setSwitch = key => value => {
  return {
    type: SWITCH_SET,
    name: key,
    index: value
  }
}

export default {
  set: setSwitch
}
