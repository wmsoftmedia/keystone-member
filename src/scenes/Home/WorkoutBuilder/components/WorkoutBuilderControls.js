import { compose, withHandlers, lifecycle, branch } from "recompose"
import { connect } from "react-redux"
import _ from "lodash/fp"

import { genUuid } from "keystone"
import { DEFAULT_SET_TYPE } from "../common"
import { UPDATE_WORKOUT_BUILDER } from "../redux/actions"

export const withQueries = withHandlers({
  isInitialized: ({ workoutBuilderModel: model }) => () => {
    return model && !!model.id
  },
  workout: ({ workoutBuilderModel: model }) => (withId = false) => {
    if (!model) return undefined
    return withId ? { ...model.info, id: model.id } : { ...model.info }
  },
  sets: ({ workoutBuilderModel: model }) => () => {
    if (!model) return []
    return model.sets || []
  },
  set: ({ workoutBuilderModel: model }) => id => {
    if (!model) return undefined
    return (model.sets || []).find(s => s.id === id)
  },
  rounds: ({ workoutBuilderModel: model }) => parentId => {
    if (!model || !parentId) return []
    return (model.rounds || []).filter(r => r.parentId === parentId)
  },
  round: ({ workoutBuilderModel: model }) => id => {
    if (!model) return undefined
    return (model.rounds || []).find(r => r.id === id)
  },
  exercises: ({ workoutBuilderModel: model }) => parentId => {
    if (!model || !parentId) return []
    return (model.exercises || []).filter(e => e.parentId === parentId)
  },
  exercise: ({ workoutBuilderModel: model }) => id => {
    if (!model) return undefined
    return (model.exercises || []).find(e => e.id === id)
  },
  allCustomExercises: ({ workoutBuilderModel: model }) => () => {
    if (!model) return []
    return _.uniqBy("exerciseId", (model.exercises || []).filter(e => e.is_custom))
  }
})

export const withMutations = withHandlers({
  updWorkout: props => (data, silentUpdate) => {
    const { dispatch, workoutBuilderModel: model, isInitialized } = props
    if (!model) return
    const newModel = !isInitialized()
      ? { ...model, id: genUuid(), info: { ...model.info, ...data } }
      : { ...model, info: { ...model.info, ...data } }
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model: newModel }, silentUpdate })
  },
  addSet: ({ dispatch, workoutBuilderModel: model }) => (data, silentUpdate) => {
    if (!model) return undefined
    const newSet = { id: genUuid(), type: DEFAULT_SET_TYPE, specs: [], ...data }
    model.sets = [...model.sets, newSet]
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
    return newSet
  },
  updSet: ({ dispatch, workoutBuilderModel: model }) => (id, data, silentUpdate) => {
    if (!model || !id) return
    model.sets = (model.sets || []).map(set =>
      set.id === id ? { ...set, ...data } : set
    )
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
  },
  updSets: ({ dispatch, workoutBuilderModel: model }) => (sets, silentUpdate) => {
    if (!model) return
    model.sets = sets
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
  },
  delSet: ({ dispatch, workoutBuilderModel: model }) => (id, silentUpdate) => {
    if (!model || !id) return
    const set = (model.sets || []).find(s => s.id === id)
    if (set) {
      const delIds = (model.rounds || []).filter(r => r.parentId === id).map(r => r.id)
      const newModel = {
        ...model,
        sets: (model.sets || []).filter(s => s.id !== id),
        exercises: (model.exercises || []).filter(e => delIds.indexOf(e.parentId) === -1),
        rounds: (model.rounds || []).filter(r => r.parentId !== id)
      }
      dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model: newModel }, silentUpdate })
    }
  },
  cloneSet: ({ dispatch, workoutBuilderModel: model }) => (id, silentUpdate) => {
    if (!model || !id) return
    const set = (model.sets || []).find(s => s.id === id)
    if (set) {
      const newSet = { ...set, id: genUuid() }
      const newRE = (model.rounds || [])
        .filter(r => r.parentId === id)
        .reduce(
          (acc, r) => {
            const newRound = { ...r, parentId: newSet.id, id: genUuid() }
            return {
              rounds: [...acc.rounds, newRound],
              exercises: (model.exercises || [])
                .filter(e => e.parentId === r.id)
                .map(e => ({ ...e, parentId: newRound.id, id: genUuid() }))
            }
          },
          { rounds: [], exercises: [] }
        )

      const newModel = {
        ...model,
        sets: [...model.sets, newSet],
        rounds: [...model.rounds, ...newRE.rounds],
        exercises: [...model.exercises, ...newRE.exercises]
      }

      dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model: newModel }, silentUpdate })
    }
  },
  moveSet: ({ dispatch, workoutBuilderModel: model }) => (from, to, silentUpdate) => {
    if (!model) return
    const sets = [...model.sets]
    sets.splice(to, 0, sets.splice(from, 1)[0])
    dispatch({
      type: UPDATE_WORKOUT_BUILDER,
      value: { model: { ...model, sets } },
      silentUpdate
    })
  },
  addRound: ({ dispatch, workoutBuilderModel: model }) => (data, silentUpdate) => {
    if (!model) return undefined
    const newRound = { id: genUuid(), ...data }
    model.rounds = [...model.rounds, newRound]
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
    return newRound
  },
  updRound: ({ dispatch, workoutBuilderModel: model }) => (id, data, silentUpdate) => {
    if (!model) return
    model.rounds = (model.rounds || []).map(round =>
      round.id === id ? { ...round, ...data } : round
    )
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
  },
  delRound: ({ dispatch, workoutBuilderModel: model }) => (id, silentUpdate) => {
    if (!model || !id) return
    const newModel = {
      ...model,
      rounds: (model.rounds || []).filter(r => r.id !== id),
      exercises: (model.exercises || []).filter(e => e.parentId !== id)
    }
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model: newModel }, silentUpdate })
  },
  cloneRound: ({ dispatch, workoutBuilderModel: model }) => (id, silentUpdate) => {
    if (!model || !id) return
    const round = (model.rounds || []).find(r => r.id === id)
    if (round) {
      const newRound = { ...round, id: genUuid() }
      newExercises = (model.exercises || [])
        .filter(e => e.parentId === id)
        .map(e => ({ ...e, parentId: newRound.id, id: genUuid() }))
      const newModel = {
        ...model,
        rounds: [...model.rounds, newRound],
        exercises: [...model.exercises, ...newExercises]
      }
      dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model: newModel }, silentUpdate })
    }
  },
  addExercise: ({ dispatch, workoutBuilderModel: model }) => (data, silentUpdate) => {
    if (!model) return undefined
    const newExercise = { id: genUuid(), ...data }
    model.exercises = [...model.exercises, newExercise]
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
    return newExercise
  },
  addExercises: props => (roundId, items, rewrite, silentUpdate) => {
    const { dispatch, workoutBuilderModel: model } = props
    if (!model) return undefined
    const newExercises = items.map(data => ({ id: genUuid(), ...data }))

    model.exercises = rewrite
      ? [...model.exercises.filter(e => e.parentId !== roundId), ...newExercises]
      : [...model.exercises, ...newExercises]
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
    return newExercises
  },
  updExercise: ({ dispatch, workoutBuilderModel: model }) => (id, data, silentUpdate) => {
    if (!model) return
    model.exercises = (model.exercises || []).map(exercise =>
      exercise.id === id ? { ...exercise, ...data } : exercise
    )
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model }, silentUpdate })
  },
  delExercise: ({ dispatch, workoutBuilderModel: model }) => (id, silentUpdate) => {
    if (!model || !id) return
    const newModel = {
      ...model,
      exercises: (model.exercises || []).filter(e => e.id !== id)
    }
    dispatch({ type: UPDATE_WORKOUT_BUILDER, value: { model: newModel }, silentUpdate })
  },
  moveExercise: props => (setId, fromRound, from, toRound, to, silentUpdate) => {
    const { dispatch, workoutBuilderModel: model } = props

    if (!model) return
    const rounds = (model.rounds || []).filter(r => r.parentId === setId)
    const restRounds = (model.rounds || []).filter(r => r.parentId !== setId)
    const exercisesMap = rounds.map(r =>
      (model.exercises || []).filter(e => e.parentId === r.id)
    )

    const restExercisesMap = restRounds.map(r =>
      (model.exercises || []).filter(e => e.parentId === r.id)
    )
    const toRoundId = _.getOr(null, `[${toRound}].id`, rounds)
    const movedItem = _.getOr(undefined, `[${fromRound}][${from}]`, exercisesMap)
    const result =
      toRoundId && movedItem
        ? exercisesMap.map((el, i) => {
            if (i === fromRound && i === toRound) {
              el.splice(to, 0, el.splice(from, 1)[0])
              return el
            } else if (i === toRound) {
              el.splice(to, 0, { ...movedItem, parentId: toRoundId })
              return el
            } else if (i === fromRound) {
              el.splice(from, 1)
              return el
            } else {
              return el
            }
          })
        : exercisesMap

    dispatch({
      type: UPDATE_WORKOUT_BUILDER,
      value: {
        model: {
          ...model,
          exercises: [..._.flatten(restExercisesMap), ..._.flatten(result)]
        }
      },
      silentUpdate
    })
  }
})

const defaultConfig = {
  shouldComponentUpdateCheck: true,
  shouldComponentUpdate: null
}

export default conf => {
  const config = { ...defaultConfig, ...conf }
  return compose(
    connect((state, props) => {
      const workoutBuilderModelTimestamp = _.getOr(0, "workoutBuilder.timestamp", state)
      return {
        workoutBuilderModel: _.getOr(undefined, "workoutBuilder.model", state),
        workoutBuilderModelTimestamp,
        //modelLoading: !workoutBuilderModelTimestamp,
        workoutBuilderModelLoading: false
      }
    }),
    branch(
      () => config.shouldComponentUpdateCheck,
      lifecycle({
        shouldComponentUpdate(nextProps) {
          return (
            this.props.workoutBuilderModelTimestamp !=
              nextProps.workoutBuilderModelTimestamp ||
            (!!config.shouldComponentUpdate &&
              config.shouldComponentUpdate(this.props, nextProps))
          )
        }
      })
    ),
    withQueries,
    withMutations
  )
}
