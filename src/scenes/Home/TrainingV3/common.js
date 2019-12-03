import moment from "moment"

import {
  AmrapIcon,
  EmomIcon,
  SetIcon,
  SupersetIcon,
  GiantsetIcon,
  MultisetIcon,
  PyramidIcon,
  TabataIcon
} from "kui/icons"
import { convertWeight as _convertWeight } from "keystone"
import _ from "lodash/fp"

export const SetTypes = {
  NORMAL: 0,
  AMRAP: 1,
  EMOM: 2,
  PYRAMID: 3,
  TABATA: 4,
  properties: {
    0: {
      name: "STRAIGHT SET",
      label: "Weight training",
      canEditExercise: true,
      icon: GiantsetIcon
    },
    1: {
      name: "AMRAP",
      label: "Weight training",
      canEditExercise: true,
      icon: AmrapIcon
    },
    2: {
      name: "EMOM",
      label: "Circuit training",
      canEditExercise: true,
      icon: EmomIcon
    },
    3: {
      name: "PYRAMID",
      label: "Weight training",
      canEditExercise: true,
      icon: PyramidIcon
    },
    4: {
      name: "TABATA",
      label: "Circuit training",
      canEditExercise: false,
      icon: TabataIcon
    }
  }
}

export const setName = (type, exercisesCount) => {
  switch (type) {
    case "Normal":
      switch (exercisesCount) {
        case 1:
          return "Set"
        case 2:
          return "Super Set"
        case 3:
          return "Giant Set"
        default:
          return "Multi Set"
      }
    default:
      return type
  }
}

export const setIcon = (type, exercisesCount) => {
  if (type === "Normal") {
    switch (exercisesCount) {
      case 1:
        return SetIcon
      case 2:
        return SupersetIcon
      case 3:
        return GiantsetIcon
      default:
        return MultisetIcon
    }
  } else {
    const typeInfo = SetTypes.properties[SetTypes[type && type.toUpperCase()] || 0]
    return typeInfo.icon
  }
}

export const setComponentByType = setType => {
  const _setType = setType && setType.toUpperCase()
  return SetTypes[_setType] !== undefined && SetTypes.properties[SetTypes[_setType]]
}

export const formatDifficulty = diff => {
  switch (diff) {
    case "easy":
      return "EASY"
    case "medium":
      return "MODERATE"
    case "hard":
    case "difficult":
    case "advanced":
      return "ADVANCED"
    default:
      return null
  }
}

export const formatDuration = duration => {
  if (+duration >= 3600) {
    return moment.utc(+duration * 1000).format("H[h] mm[m] ss[s]")
  } else if (+duration >= 60) {
    return moment.utc(+duration * 1000).format("m[m] ss[s]")
  } else {
    return moment.utc(+duration * 1000).format("s[s]")
  }
}

export const convertWeight = (weightUnit, unit, value) => {
  if (value && (unit === "kg" || unit === "lbs") && unit !== weightUnit) {
    return _convertWeight(weightUnit, unit, weightUnit === "kg", value)
  } else {
    return value
  }
}

export const isRoundDone = (node, roundIndex) => {
  const r = _.getOr([], "meta.rounds", node).find(r => r.index === roundIndex)
  return r && r.done
}

export const difficultyVariant = {
  Easy: { name: "Easy", variant: "completed" },
  Moderate: { name: "Medium", variant: "medium" },
  Hard: { name: "Hard", variant: "hard" }
}
