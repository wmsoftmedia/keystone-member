import _ from "lodash/fp"
import { genUuid } from "keystone"

import {
  emptyWorkout,
  specNameBySynonym,
  defaultSpecs
} from "scenes/Home/WorkoutBuilder/common"

export const modelDecoder = (data, initModel) => {
  const nodes = data && data.nodes
  const edges = data && data.edges
  if (!nodes || !edges) return null

  const model = _.cloneDeep(initModel || emptyWorkout)

  const roundsRest = []

  nodes.reduce((workout, n, index) => {
    const inEdges = edges.filter(e => e[1] === index)
    if (n.nodetype === "Set") {
      inEdges.forEach(edge => {
        const type = _.getOr("Normal", "set_type.setType", n)
        const specs = defaultSpecs(type)
        if (n.notes) {
          specs.notes = { value: n.notes }
        }
        const timeout = _.getOr(null, "[2].timeout", edge)
        if (timeout) {
          specs.timeout = { value: timeout.value, unit: timeout.unit }
        }

        _.getOr([], "[2].constraints", edge).reduce((specs, o) => {
          if (o.TimeLimit) {
            specs.timeLimit = { value: o.TimeLimit.value, unit: o.TimeLimit.unit }
          }
        }, specs)

        _.getOr([], "[2].targets", edge).reduce((specs, o) => {
          if (o.Rounds) {
            specs.rounds = { value: o.Rounds.value, unit: o.Rounds.unit }
          }
        }, specs)

        workout.sets.push({ id: n.id, type, index: n.index || 0, specs })
      })
    } else if (n.nodetype === "Round" && inEdges.length) {
      inEdges.forEach(edge => {
        const parent = _.getOr(null, `[${edge[0]}]`, nodes)
        if (parent) {
          const parentType = _.getOr(null, "set_type.setType", parent)

          const specs = {}

          const specName = specNameBySynonym(parentType, "timeout")
          const timeout = _.getOr(null, "[2].timeout", edge)
          if (timeout && specName) {
            specs[specName] = { value: timeout.value, unit: timeout.unit }
          } else if (timeout) {
            roundsRest.push({
              id: genUuid(),
              type: "rest",
              parentId: n.id,
              value: timeout.value
            })
          }

          _.getOr([], "[2].constraints", edge).reduce((specs, o) => {
            const specName = specNameBySynonym(parentType, "timeLimit")
            if (o.TimeLimit && specName) {
              specs[specName] = { value: o.TimeLimit.value, unit: o.TimeLimit.unit }
            }
          }, specs)

          workout.sets = workout.sets.map(set =>
            set.id === parent.id ? { ...set, specs: { ...set.specs, ...specs } } : set
          )

          workout.rounds.push({
            id: n.id,
            parentId: parent.id,
            index: n.index || 0
          })
        }
      })
    } else if (n.nodetype === "Exercise" && inEdges.length) {
      inEdges.forEach(edge => {
        const targets = _.getOr([], "[2].targets", edge)
        const exercise = {
          id: genUuid(),
          type: "exercise",
          name: n.name,
          exerciseId: n.id,
          parentId: _.getOr(null, `[${edge[0]}].id`, nodes),
          is_custom: n.is_custom,
          index: n.index || 0
        }
        targets.reduce((exercise, t) => {
          if (t.Load) {
            exercise.loadValue = t.Load.value
            exercise.loadUnit = _.getOr(false, "Load.unit.RMP", t)
              ? "% 1RM"
              : t.Load.unit === "BWP"
              ? "% BW"
              : t.Load.unit
          } else if (t.Calories) {
            exercise.effortValue = t.Calories.value
            exercise.effortUnit = t.Calories.unit
          } else if (t.Repetitions) {
            exercise.effortValue = t.Repetitions.value
            exercise.effortUnit = t.Repetitions.unit
          } else if (t.Distance) {
            exercise.effortValue = t.Distance.value
            exercise.effortUnit = t.Distance.unit
          } else if (t.Duration) {
            exercise.effortValue = t.Duration.value
            exercise.effortUnit = t.Duration.unit
          } else if (t.Tempo) {
            exercise.tempoValue = t.Tempo
          }
          return exercise
        }, exercise)

        workout.exercises.push(exercise)

        const timeout = _.getOr([], "[2].timeout", edge)
        if (timeout) {
          workout.exercises.push({
            id: genUuid(),
            type: "rest",
            parentId: _.getOr(null, `[${edge[0]}].id`, nodes),
            value: timeout.value
          })
        }
      })
    }

    return workout
  }, model)

  model.exercises = [...model.exercises, ...roundsRest]
  return model
}

export const metaDecoder = model => {
  return {}
}
