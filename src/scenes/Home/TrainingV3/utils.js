import { getOr } from "keystone"
import _ from "lodash/fp"

export const formatUnit = unit => {
  if (unit instanceof Object) {
    return "% " + (unit["RM"] || 1) + "RM"
  }
  switch (unit) {
    case "meters":
      return "m"
    case "BWP":
      return "% BW"
    default:
      return unit
  }
}

const targetConvertValue = (target = {}, converter) => {
  const conv = converter && target.unit === "kg" ? converter.weightConverter : v => v

  switch ((target.type || "").toLowerCase()) {
    case "value":
      const value = conv(target.value || 0)
      return { printValue: `${value}`, value }
    case "range":
      if (!target.start && !target.end) {
        return { printValue: "∞", value: 0 }
      }

      if (!target.end) {
        const value = conv(target.start || 0)
        return { printValue: `${value}+`, value }
      }

      if (!target.start) {
        const value = conv(target.end || 0)
        return { printValue: `max ${value}`, value }
      }

      return {
        printValue: `${conv(target.start || 0)}-${conv(target.end || 0)}`,
        value: target.end || 0
      }
    default:
      return { printValue: "0", value: 0 }
  }
}

export const targetValue = (item, targetName, round, converter) => {
  const target = getOr({}, "targets." + targetName, item)

  if (_.isObject(target)) {
    const type = (target.type || "").toLowerCase()

    const conv = converter && target.unit === "kg" ? converter.weightConverter : v => v

    switch (type) {
      case "value":
        return {
          ...target,
          printValue:
            target.unit === "BW" && +target.value === 1 ? "" : conv(target.value)
        }

      case "range":
        return {
          ...target,
          ...targetConvertValue(target, converter)
        }

      case "sequence":
        const roundsNum = getOr(0, "sequence.length", target)
        const index = Math.min(round, roundsNum - 1)
        const seqValue = getOr({}, `sequence.${index}`, target)
        return {
          ...target,
          ...targetConvertValue(seqValue, converter)
        }

      case "progression":
        const start = targetConvertValue(getOr({}, "start", target), converter).value
        if (getOr(null, "end.value", target)) {
          const step = conv(getOr(1, "step", target))
          const progressionValue = conv(start + step * round)
          const end = targetConvertValue(getOr({}, "end", target), converter).value

          const finalValue =
            step > 0 ? Math.min(progressionValue, end) : Math.max(progressionValue, end)

          return {
            ...target,
            value: finalValue,
            printValue: `${finalValue}`
          }
        } else {
          const step = conv(getOr(0, "step", target))
          const progressionValue = Math.max(start + step * round, Math.abs(step))

          return {
            ...target,
            value: progressionValue,
            printValue: `${progressionValue}`
          }
        }

      default:
        return undefined
    }
  } else if (target) {
    return {
      value: target,
      printValue: target,
      unit: ""
    }
  }
  return undefined
}
