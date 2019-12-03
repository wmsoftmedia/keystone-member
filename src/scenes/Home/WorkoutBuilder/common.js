import _ from "lodash/fp"

export const emptyWorkout = {
  sets: [],
  rounds: [],
  exercises: [],
  info: { name: "", duration: 0, difficulty: "Moderate" }
}

export const setTypes = [
  {
    value: "Normal",
    name: "Normal set",
    label: "Weight training",
    description: "Straight set of one or many exercises in each round.",
    specs: ["rounds", "timeLimit", "timeout", "notes"]
  },
  {
    value: "EMOM",
    name: "EMOM",
    label: "Circuit training",
    description:
      "Back-to-back intervals with one or many exercises in each interval. Each round is time-limited.",
    specs: ["rounds", "timeLimit", "timeout", "roundTimeLimit", "notes"]
  },
  {
    value: "TABATA",
    name: "TABATA",
    label: "Circuit training",
    description:
      "Back-to-back intervals with fixed rest period (e.g. 45 sec on, 25 sec off).",
    specs: [
      "rounds",
      "timeLimit",
      "timeout",
      "roundTabataTimeLimit",
      "roundTabataTimeout",
      "notes"
    ]
  }
]

export const DEFAULT_SET_TYPE = setTypes[0].value

export const setSpecs = {
  rounds: {
    type: "rounds",
    label: "Rounds",
    defaultValue: 0,
    defaultUnit: "round",
    scope: "set",
    editable: false
  },
  timeLimit: {
    type: "time",
    label: "Time limit",
    defaultValue: 0,
    defaultUnit: "sec",
    scope: "set",
    editable: true
  },
  timeout: {
    type: "time",
    label: "Rest",
    defaultValue: 0,
    defaultUnit: "sec",
    scope: "set",
    editable: false
  },
  notes: {
    type: "text",
    label: "Notes",
    defaultValue: "",
    scope: "set",
    editable: true
  },
  roundTimeLimit: {
    type: "time",
    label: "Round duration",
    defaultValue: 60,
    defaultUnit: "sec",
    synonym: "timeLimit",
    scope: "round",
    editable: true
  },
  roundTabataTimeLimit: {
    type: "time",
    label: "Round duration",
    defaultValue: 45,
    defaultUnit: "sec",
    synonym: "timeLimit",
    scope: "round",
    editable: true
  },
  roundTabataTimeout: {
    type: "time",
    label: "Rest duration",
    defaultValue: 15,
    defaultUnit: "sec",
    synonym: "timeout",
    scope: "round",
    editable: true
  }
}

export const specsString = (set, skip = []) => {
  if (!set || !set.specs) return ""
  const values = _.keys(set.specs).reduce((acc, k) => {
    if (skip.indexOf(k) !== -1) {
      return acc
    }
    if (k === "rounds") {
      const value = _.getOr(0, `specs.${k}.value`, set)
      return value ? [...acc, "x" + value] : acc
    } else if (k === "timeLimit") {
      const value = _.getOr(0, `specs.${k}.value`, set)
      const min = Math.floor(value / 60)
      const sec = value % 60
      const formatedValue = (min ? min + " min" : "") + (sec ? " " + sec + " sec" : "")
      return formatedValue ? [...acc, formatedValue] : acc
    } else if (k === "timeout") {
      const value = _.getOr(0, `specs.${k}.value`, set)
      const min = Math.floor(value / 60)
      const sec = value % 60
      const formatedValue = (min ? min + " min" : "") + (sec ? " " + sec + " sec" : "")
      return formatedValue ? [...acc, formatedValue + " rest"] : acc
    } else {
      return acc
    }
  }, [])
  return values.join(", ")
}

export const defaultSpecs = type => {
  const setType = setTypes.find(st => st.value === type)
  return _.getOr([], "specs", setType || {}).reduce((acc, s) => {
    const spec = setSpecs[s]
    return spec && spec.defaultValue
      ? {
          ...acc,
          [s]: {
            value: spec.defaultValue,
            ...(spec.defaultUnit ? { unit: spec.defaultUnit } : {})
          }
        }
      : acc
  }, {})
}

export const specsByScope = (specs, scope) =>
  _.keys(specs || {}).reduce((acc, s) => {
    return _.getOr("", `${s}.scope`, setSpecs) === scope
      ? { ...acc, [_.getOr("", `${s}.synonym`, setSpecs) || s]: specs[s] }
      : acc
  }, {})

export const specNameBySynonym = (type, synonym) => {
  const setType = setTypes.find(st => st.value === type)
  return _.getOr([], "specs", setType || {}).find(
    s => _.getOr(null, `${s}.synonym`, setSpecs) === synonym
  )
}
