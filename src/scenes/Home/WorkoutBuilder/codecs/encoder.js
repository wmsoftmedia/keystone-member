import _ from "lodash/fp"
import { genUuid } from "keystone"
import { specsByScope } from "scenes/Home/WorkoutBuilder/common"

const genEmptyWorkout = () => {
  return {
    nodes: [
      {
        nodetype: "Root",
        id: genUuid(),
        name: null,
        notes: null
      },
      {
        nodetype: "Iteration",
        id: genUuid(),
        index: 0,
        notes: null
      },
      {
        nodetype: "Stage",
        id: genUuid(),
        index: 0,
        name: "",
        notes: null
      }
    ],
    node_holes: [],
    edge_property: "directed",
    edges: [
      [
        0,
        1,
        {
          constraints: [],
          targets: [],
          timeout: null,
          index: 0,
          meta: null
        }
      ],
      [
        1,
        2,
        {
          constraints: [],
          targets: [],
          timeout: null,
          index: 0,
          meta: null
        }
      ]
    ]
  }
}

const encodeSet = (workout, parentIndex, set, index, roundTime, colRounds) => {
  const position =
    workout.nodes.push({
      nodetype: "Set",
      id: set.id,
      index: index,
      notes: _.getOr(null, "specs.notes.value", set),
      set_type: {
        setType: set.type
      },
      meta: null
    }) - 1

  const constraints = []
  const targets = []

  const timeLimit = _.getOr(0, "specs.timeLimit.value", set)
  if (timeLimit) {
    constraints.push({
      TimeLimit: {
        type: "Value",
        value: timeLimit,
        unit: "sec"
      }
    })
  }

  const numRoundsByTime =
    timeLimit > 0 && roundTime > 0 ? Math.ceil(timeLimit / roundTime) : 0
  const rounds = _.getOr(0, "specs.rounds.value", set)

  const numRounds = numRoundsByTime
    ? _.max([numRoundsByTime, colRounds])
    : _.max([rounds, colRounds])

  if (numRounds) {
    targets.push({
      Rounds: {
        type: "Value",
        value: numRounds,
        unit: "round"
      }
    })
  }

  const _timeout = _.getOr(null, "specs.timeout", set)
  const timeout =
    _timeout && _timeout.value
      ? {
          type: "Value",
          value: _timeout.value,
          unit: "sec"
        }
      : null

  workout.edges.push([
    parentIndex,
    position,
    {
      constraints,
      targets,
      timeout,
      index: index,
      meta: null
    }
  ])

  return position
}

const encodeRound = (workout, parentIndex, round, index, isCycleSet) => {
  const position =
    workout.nodes.push({
      nodetype: "Round",
      id: round.id,
      index: index,
      notes: null
    }) - 1

  const constraints = []

  const timeLimit = round.specs && round.specs.timeLimit
  if (timeLimit && timeLimit.value) {
    constraints.push({
      TimeLimit: {
        type: "Value",
        value: timeLimit.value,
        unit: "sec"
      }
    })
  }

  if (isCycleSet) {
    constraints.push({
      Predicate: {
        type: "Value",
        value: index + 1,
        unit: "min"
      }
    })
  }

  const _timeout = round.specs && round.specs.timeout
  const timeout =
    _timeout && _timeout.value
      ? {
          type: "Value",
          value: _timeout.value,
          unit: "sec"
        }
      : null

  workout.edges.push([
    parentIndex,
    position,
    {
      constraints,
      targets: [],
      timeout,
      index: index,
      meta: null
    }
  ])
  return position
}

const encodeExercise = (workout, parentIndex, exercise, index) => {
  const position =
    workout.nodes.push({
      nodetype: "Exercise",
      id: exercise.exerciseId,
      name: exercise.name,
      is_custom: !!exercise.is_custom,
      notes: null
    }) - 1

  const targets = []

  if (exercise && exercise.effortUnit && exercise.effortValue) {
    if (exercise.effortUnit === "cals") {
      targets.push({
        Calories: {
          type: "Value",
          value: exercise.effortValue,
          unit: exercise.effortUnit
        }
      })
    } else if (exercise.effortUnit === "reps") {
      targets.push({
        Repetitions: {
          type: "Value",
          value: exercise.effortValue,
          unit: exercise.effortUnit
        }
      })
    } else if (exercise.effortUnit === "meters") {
      targets.push({
        Distance: {
          type: "Value",
          value: exercise.effortValue,
          unit: exercise.effortUnit
        }
      })
    } else if (["sec", "min"].indexOf(exercise.effortUnit) !== -1) {
      targets.push({
        Duration: {
          type: "Value",
          value:
            parseInt(exercise.effortValue) * (exercise.effortUnit === "min" ? 60 : 1),
          unit: "sec"
        }
      })
    }
  }

  if (exercise && exercise.loadUnit && exercise.loadValue) {
    const value = exercise.loadUnit === "BW" ? 1 : exercise.loadValue

    const unit =
      exercise.loadUnit === "% BW"
        ? "BWP"
        : exercise.loadUnit === "% 1RM"
        ? { RMP: 1 }
        : exercise.loadUnit

    targets.push({
      Load: {
        type: "Value",
        value: value,
        unit: unit
      }
    })
  }

  if (exercise && exercise.tempoValue) {
    targets.push({
      Tempo: "" + exercise.tempoValue
    })
  }

  workout.edges.push([
    parentIndex,
    position,
    {
      constraints: [],
      targets,
      timeout: null,
      index: index,
      meta: null
    }
  ])
  return position
}

export const modelEncoder = model => {
  const workout = genEmptyWorkout()
  const stageIndex = workout.nodes.length - 1
  const sets = model.sets || []

  sets.forEach((set, setIndex) => {
    const roundSpecs = specsByScope(set.specs, "round")
    const setRounds = (model.rounds || []).filter(r => r.parentId === set.id)

    const colRounds = setRounds.length
    const roundTime =
      (_.getOr(0, "timeout.value", roundSpecs) || 0) +
      (_.getOr(0, "timeLimit.value", roundSpecs) || 0)

    const setPosition = encodeSet(
      workout,
      stageIndex,
      set,
      setIndex,
      roundTime,
      colRounds
    )
    setRounds.forEach((round, roundIndex) => {
      const _round = {
        ...round,
        specs: { ...round.specs, ...roundSpecs }
      }

      const isCycleSet = ["EMOM", "TABATA"].indexOf(set.type) !== -1
      const rpos = encodeRound(workout, setPosition, _round, roundIndex, isCycleSet)

      const exercises = (model.exercises || []).filter(e => e.parentId === round.id)
      let exercisesCount = 0
      exercises.forEach((exercise, exerciseIndex) => {
        if (exercise.type === "rest" && exerciseIndex > 0) {
          const lastIndex = _.findLastIndex(
            n =>
              n.nodetype ===
              (exerciseIndex === exercises.length - 1 ? "Round" : "Exercise"),
            workout.nodes
          )
          const lastEdge = _.findLastIndex(e => e[1] === lastIndex, workout.edges)

          if (lastEdge !== -1) {
            workout.edges[lastEdge][2].timeout = {
              type: "Value",
              unit: "sec",
              value: exercise.value
            }
          }
        } else if (exercise.type === "exercise") {
          encodeExercise(workout, rpos, exercise, exercisesCount)
          exercisesCount++
        }
      })
    })
  })
  return workout
}

export const metaEncoder = model => {
  return {}
}
