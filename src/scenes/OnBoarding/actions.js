export const ON_BOARDING_SET = "ON_BOARDING_SET"

export const setOnBoarding = key => value => {
  return {
    type: ON_BOARDING_SET,
    name: key,
    index: value
  }
}

export default {
  set: setOnBoarding
}
