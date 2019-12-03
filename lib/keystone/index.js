import moment from "moment"
import numeral from "numeral"

import fuzzy from "fuzzy"
import _ from "lodash/fp"
import uuidv4 from "uuid/v4"

import {
  DATE_FORMAT_GRAPHQL,
  DATETIME_FORMAT_GRAPHQL,
  DATE_FORMAT_LIST,
  DATE_SHORT
} from "./constants"

/** NUMBERS */

export const numOr = (x, z = 0) => +x || z

export const formatFloat = (num, suffix = "") => numeral(num).format("0.0") + suffix

export const formatNum = (num, suffix = "") => numeral(num).format("0,0") + suffix

export const formatCals = (cals, suffix = " cal") => numeral(cals).format("0,0") + suffix

export const formatSteps = (n, suffix = " steps") => numeral(n).format("0,0") + suffix

export const round = x => Math.round(x * 10) / 10

export const macros = (macros = { protein: 0, fat: 0, carbs: 0 }) => {
  const p = toNumber(getOr("", "protein", macros) || 0)
  const f = toNumber(getOr("", "fat", macros) || 0)
  const c = toNumber(getOr("", "carbs", macros) || 0)
  return {
    protein: round(isFinite(p) ? p : 0),
    fat: round(isFinite(f) ? f : 0),
    carbs: round(isFinite(c) ? c : 0)
  }
}

/** STRINGS */

export const titleCase = str =>
  str
    .split(" ")
    .map(w => w.substr(0, 1).toUpperCase() + w.substr(1).toLowerCase())
    .join(" ")

/** NAVIGATION (NATIVE) */

export const getNavigationParam = (navigation, key) =>
  getOr(null, `state.params.${key}`, navigation)

export const getNavigationDate = navigation =>
  getNavigationParam(navigation, "date") || today()

export const trim = _.trim

/** DATE & TIME */

export const now = () => moment()

export const formatTime = (time, formatOut = "HH:mm", formatIn = "HH:mm:ss") =>
  moment(time, formatIn).format(formatOut)

export const today = (format = DATE_FORMAT_GRAPHQL) => moment().format(format)
export const yesterday = (format = DATE_FORMAT_GRAPHQL) =>
  moment()
    .subtract(1, "day")
    .format(format)

export const subtractDays = (date, days = 1, format = DATE_FORMAT_GRAPHQL) =>
  moment(date)
    .subtract(days, "day")
    .format(format)

export const isToday = date => {
  return moment().isSame(moment(date), "day")
}

export const sortMoments = (d1, d2) => {
  if (d1.isAfter(d2)) {
    return 1
  } else if (d2.isAfter(d1)) {
    return -1
  }

  return 0
}

export const isFutureDay = date => {
  return moment(date).diff(moment(), "days") >= 0
}

export const isFutureDate = isFutureDay

export const isPastDate = date => {
  return moment(date).diff(moment(), "days") < 0
}

export const isSameDate = firstDate => secondDate => {
  return moment(firstDate).isSame(moment(secondDate))
}

export const daysToNumbers = days => {
  if (!days || days.length === 0) {
    return []
  }
  return days.map(d =>
    moment()
      .day(d)
      .day()
  )
}

export const lastNDaysFrom = (n = 30, from = moment()) =>
  _.rangeRight(0, n).map(x =>
    moment(from)
      .subtract(x, "days")
      .format(DATE_FORMAT_GRAPHQL)
  )

export const nextNDaysFrom = (n = 30, from = moment()) =>
  _.range(0, n).map(x =>
    moment(from)
      .add(x, "days")
      .format(DATE_FORMAT_GRAPHQL)
  )

export const calculateEndDate = (startDate, duration) =>
  moment(startDate)
    .add(duration, "weeks")
    .format("YYYY-MM-DD")

export const isThisWeek = date => moment(date).isSame(moment(), "w")

export const isLastWeek = date =>
  moment()
    .subtract(1, "w")
    .isSame(date, "w")

export const isNextWeek = date =>
  moment()
    .add(1, "w")
    .isSame(date, "w")

export const isBeforeThisMonth = date =>
  moment(date).isBefore(
    moment()
      .subtract(2, "w")
      .startOf("w")
  )

// This fn should be renamed to hasDay or something...
export const hasToday = (days, day = moment().day()) => days.includes(day)

export const isCurrent = ({ days }, day = moment().day()) => {
  if (!days || days.length === 0) {
    return false
  }

  return hasToday(daysToNumbers(days), day)
}

export const shortDate = date => moment(date).format(DATE_SHORT)
export const formattedDate = date => moment(date).format(DATE_FORMAT_LIST)

export const gqlDate = date => moment(date).format(DATE_FORMAT_GRAPHQL)
export const gqlDatetime = date => moment(date).format(DATETIME_FORMAT_GRAPHQL)

export const datePickerFormat = date => moment(date).format("dddd, MMMM Do YYYY")

/** NUTRITION */
// TODO: move this section to food.js (and update references in code)

export const cals = ({ protein = 0, fat = 0, carbs = 0 }) =>
  +protein * 4 + +fat * 9 + +carbs * 4

export const macroCals = (macro, value) => (macro === "fat" ? value * 9 : value * 4)

export const emptyTotals = Object.freeze({
  cals: 0,
  protein: 0,
  fat: 0,
  carbs: 0
})

export const mealTotals = (meals = []) => {
  const entries = [].concat.apply([], meals.filter(m => m.entries).map(m => m.entries))
  const totals = entries.reduce(
    (acc, { cals, macros }) => ({
      cals: acc.cals + numOr(cals),
      protein: acc.protein + numOr(macros.protein),
      fat: acc.fat + numOr(macros.fat),
      carbs: acc.carbs + numOr(macros.carbs)
    }),
    emptyTotals
  )
  return {
    cals: round(totals.cals),
    protein: round(totals.protein),
    fat: round(totals.fat),
    carbs: round(totals.carbs)
  }
}

/** TRAINING **/

export const formatReps = reps => {
  const [from, to] = reps
  const amrap = "AMRAP"
  const min = from === Infinity ? amrap : from
  const max = to === Infinity ? amrap : to
  if (!min || !max) {
    return "--"
  }
  if (from === Infinity && to !== Infinity) {
    return `MAX ${max}`
  }
  if (from === Infinity) {
    return amrap
  }
  if (to === Infinity) {
    return `${min}+`
  }
  if (from && to) {
    return `${min}-${max}`
  }
  return min
}

/** WEIGHT CONVERSIONS **/

export const getWeightUnit = user => {
  const weightSetting = user.settings.nodes.find(
    ({ setting }) => setting.key === "weight_unit"
  )
  if (weightSetting) {
    return weightSetting.value
  } else {
    console.warn("Weight unit setting not found. Falling back to kg")
    return "kg"
  }
}

export const convertWeight = _.curry((originUnit, reqUnit, shouldRound, value) => {
  if (originUnit === reqUnit) {
    return shouldRound ? round(value) : value
  }

  if (reqUnit === "kg") {
    return shouldRound ? round(value / 2.20462262185) : value / 2.20462262185 // lbs to kg
  } else if (reqUnit === "lbs") {
    return shouldRound ? round(value * 2.20462262185) : value * 2.20462262185 // kg to lbs
  } else {
    console.warn("Unknown weight unit")
    return value
  }
})

/** HEIGHT CONVERSIONS **/

export const getHeightUnit = user => {
  const heightSetting = user.settings.nodes.find(
    ({ setting }) => setting.key === "height_unit"
  )
  if (heightSetting) {
    return heightSetting.value
  } else {
    console.warn("Height unit setting not found. Falling back to cm")
    return "cm"
  }
}

export const convertHeight = _.curry((originUnit, reqUnit, shouldRound, value) => {
  if (originUnit === reqUnit) {
    return shouldRound ? round(value) : value
  }

  if (reqUnit === "cm") {
    return shouldRound ? round(value * 30.48) : value * 30.48 // feet to cm
  } else if (reqUnit === "feet") {
    return shouldRound ? round(value / 30.48) : value / 30.48 // cm to feet
  } else {
    console.warn("Unknown height unit")
    return value
  }
})

export const feetToFtIn = (value, shouldRound) => {
  return value
    ? {
        ft: Math.floor(value),
        in: shouldRound ? round((value % 1) * 12) : (value % 1) * 12
      }
    : { ft: 0, in: 0 }
}

export const ftInToFeet = (object, shouldRound) => {
  const value = object ? +(object.ft || 0) + (object.in || 0) / 12 : 0
  return shouldRound ? Math.round(100 * value) / 100 : value
}

export const feetToIn = (value, shouldRound) => {
  return value ? (shouldRound ? round(value * 12) : value * 12) : value
}

export const inToFeet = (value, shouldRound) => {
  return value ? (shouldRound ? round(value / 12) : value / 12) : value
}

/** TEMPERATURE CONVERSIONS **/

export const getTemperatureUnit = user => {
  const tempSetting = user.settings.nodes.find(
    ({ setting }) => setting.key === "temperature_unit"
  )
  if (tempSetting) {
    return tempSetting.value
  } else {
    console.warn("Temperature unit setting not found. Falling back to celsius")
    return "celsius"
  }
}

export const convertTemperature = _.curry((originUnit, reqUnit, shouldRound, value) => {
  if (originUnit === reqUnit) {
    return shouldRound ? round(value) : value
  }

  if (reqUnit === "celsius") {
    return shouldRound ? round((value - 32) / 1.8) : (value - 32) / 1.8 // fahrenheit to celsius
  } else if (reqUnit === "fahrenheit") {
    return shouldRound ? round(value * 1.8 + 32) : value * 1.8 + 32 // celsius to fahrenheit
  } else {
    console.warn("Unknown temperature unit")
    return value
  }
})

/** VISUAL **/

export const rowElevationForIndex = (index, cols, elevationStep = 5) => {
  return (Math.floor(index / cols) + 1) * elevationStep
}

export const nextTick = f => setTimeout(f, 0)

export const getSupersetIndex = i => String.fromCharCode(97 + i).toUpperCase()

/** GraphQL **/

export const genMutationId = () => +Date.now()

export const genUuid = () => uuidv4()

export const readQuerySafe = (store, params) => {
  try {
    const data = store.readQuery(params)
    return { error: null, data }
  } catch (error) {
    return { error, data: null }
  }
}

export const readFragmentSafe = (store, params) => {
  try {
    const data = store.readFragment(params)
    return { error: null, data }
  } catch (error) {
    return { error, data: null }
  }
}

export const applyCacheUpdates = (store, payload) => variables => updates =>
  updates.map(f => f(variables)(store, payload))

/** COLLECTIONS **/

export const createDateSections = records => {
  const thisWeek = records.filter(m => isThisWeek(m.date))
  const lastWeek = records.filter(m => isLastWeek(m.date))
  const nextWeek = records.filter(m => isNextWeek(m.date))
  const before = records.filter(m => isBeforeThisMonth(m.date))

  const createSection = (title, data) => ({ title, data })

  let sections = []
  if (thisWeek.length > 0) {
    const label = "This Week"
    sections.push(createSection(label, thisWeek))
  }
  if (lastWeek.length > 0) {
    const label = "Last Week"
    sections.push(createSection(label, lastWeek))
  }
  if (before.length > 0) {
    const label = "Before"
    sections.push(createSection(label, before))
  }
  if (nextWeek.length > 0) {
    const label = "Next Week"
    sections.push(createSection(label, nextWeek))
  }

  return sections
}

export const weekOfMonth = date => {
  let weekInYearIndex = date.week()
  if (date.year() !== date.weekYear()) {
    weekInYearIndex =
      date
        .clone()
        .subtract(1, "week")
        .week() + 1
  }
  const weekIndex =
    weekInYearIndex -
    moment(date)
      .startOf("month")
      .week() +
    1
  return weekIndex
}

/** OBJECTS **/

export const getOr = _.getOr
export const toNumber = _.toNumber
export const isFinite = _.isFinite
export const omitBy = _.omitBy
export const omit = _.omit
export const pick = _.pick
export const mapValues = _.mapValues

export const filterFuzzy = (needle, items, extract = el => el.name) => {
  if (needle.length === 0) return items
  return fuzzy.filter(needle, items, { extract }).map(el => el.original)
}
