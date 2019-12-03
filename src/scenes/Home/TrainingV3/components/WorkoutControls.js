import { compose, withHandlers, lifecycle, branch } from "recompose"
import { connect } from "react-redux"
import _ from "lodash/fp"

import { getOr } from "keystone"

import { UPDATE_TRAINING, UPDATE_TRAINING_TIMER } from "../redux/actions"

const nodeIndex = (model, node, parentId) => {
  const id = _.getOr(null, "id", node) || node || ""

  return _.getOr([], "nodes", model).reduce((acc, n, i) => {
    const parentEdge = _.getOr([], "edges", model).find(e => e[1] === i)
    const thisParentId = _.getOr(null, `nodes[${parentEdge && parentEdge[0]}].id`, model)
    if (n.id === id && (!parentId || thisParentId === parentId)) {
      return i
    } else {
      return acc
    }
  }, 1)
}

const parseValues = values => {
  return values
    ? _.isArray(values)
      ? values.reduce((a, v) => ({ ...a, ...v }), {})
      : values
    : []
}

const parseNode = (model, node, edge) => {
  const edgeData = _.getOr({}, "[2]", edge)
  const parentInd = _.getOr(-1, "[0]", edge)
  return {
    ...node,
    parentId: _.getOr(null, `nodes[${parentInd}].id`, model),
    constraints: parseValues(edgeData.constraints),
    timeout: parseValues(edgeData.timeout),
    targets: parseValues(edgeData.targets),
    edgeMeta: edgeData.meta || {}
  }
}

const parentEdge = (model, node, sourceId, edgeIndex) => {
  const nodeInd = nodeIndex(model, node, sourceId)
  const srcInd = nodeIndex(model, sourceId)
  const edges = _.getOr([], "edges", model).filter(
    e =>
      (!sourceId || _.getOr(null, "[0]", e) === srcInd) &&
      _.getOr(null, "[1]", e) === nodeInd
  )
  return _.getOr(undefined, `[${edgeIndex || 0}]`, edges)
}

const nodeById = (model, id) => {
  return _.getOr([], "nodes", model).find(n => n.id === id)
}

const nodesByTypes = (model, type) => {
  return _.getOr([], "nodes", model).filter(n => n.nodetype === type)
}

const nodeChildren = (model, node) => {
  if (!node) return []

  const nodeInd = nodeIndex(model, node)

  const edges = _.getOr([], "edges", model).filter(
    e => _.getOr(null, "[0]", e) === nodeInd
  )
  return edges.reduce((acc, e) => {
    const _node = _.getOr(null, `nodes[${e[1]}]`, model)
    return _node ? [...acc, _node] : acc
  }, [])
}

const nodeSuccessors = (model, node, type) => {
  if (!node) return []

  const nodeInd = nodeIndex(model, node)

  const edges = _.getOr([], "edges", model).filter(
    e => _.getOr(null, "[0]", e) === nodeInd
  )
  const successors = edges.reduce((acc, e) => {
    const _node = _.getOr(null, `nodes[${e[1]}]`, model)
    return _node ? [...acc, _node, ...nodeSuccessors(model, _node)] : acc
  }, [])

  return type ? successors.filter(n => n.nodetype === type) : successors
}

export const withModelQueries = withHandlers({
  nodeById: ({ model }) => (id, parentId) => {
    if (!model) return []
    const node = nodeById(model, id)
    return parseNode(model, node, parentEdge(model, node, parentId))
  },
  workout: props => () => {
    if (!props.model) return undefined
    const root = _.getOr(undefined, "[0]", nodesByTypes(props.model, "Root"))

    return (
      root && {
        ...parseNode(props.model, root, parentEdge(props.model, root)),
        duration: _.getOr(0, "workoutTemplate.duration", props)
      }
    )
  },
  iterations: ({ model }) => () => {
    if (!model) return []
    const iterations = nodesByTypes(model, "Iteration")
    return iterations.map(iteration =>
      parseNode(model, iteration, parentEdge(model, iteration))
    )
  },
  stages: ({ model }) => weekId => {
    if (!model) return []

    const stages = weekId
      ? nodeSuccessors(model, weekId, "Stage")
      : nodeSuccessors(
          model,
          _.getOr(0, "[0].id", nodesByTypes(model, "Iteration")),
          "Stage"
        )
    return stages.map(stage => parseNode(model, stage, parentEdge(model, stage)))
  },
  sets: ({ model }) => weekId => {
    if (!model) return []
    const sets = weekId
      ? nodeSuccessors(model, weekId, "Set")
      : nodeSuccessors(
          model,
          _.getOr(0, "[0].id", nodesByTypes(model, "Iteration")),
          "Set"
        )

    return sets.map((set, index) => {
      const { set_type, ...rest } = parseNode(model, set, parentEdge(model, set))
      return {
        ...rest,
        type: set_type,
        name: `SET ${String.fromCharCode(65 + index)}`,
        setLetter: String.fromCharCode(65 + index)
      }
    })
  },
  rounds: ({ model }) => (setId, expand = true) => {
    if (!model || !setId) return []

    const rawRounds = nodeSuccessors(model, setId, "Round")

    if (!expand) {
      return rawRounds.map(round => parseNode(model, round, parentEdge(model, round)))
    }

    const set = parseNode(model, nodeById(model, setId), parentEdge(model, setId))

    const rndCnt =
      Math.abs(_.getOr(0, `meta.numRounds`, set)) ||
      Math.abs(_.getOr(0, `targets.Rounds.value`, set)) ||
      Math.abs(_.getOr(0, `targets.Rounds.start`, set)) ||
      rawRounds.length

    const rounds = rawRounds.map(round =>
      parseNode(model, round, parentEdge(model, round))
    )

    const isCycleSet = getOr(false, "[0].constraints.Predicate", rounds)

    if (rounds.length > 0 && rounds.length < rndCnt) {
      if (isCycleSet) {
        return [...Array(rndCnt)].map((_, i) => rounds[i % rounds.length])
      } else {
        return rounds.concat(Array(rndCnt - rounds.length).fill(_.last(rounds)))
      }
    } else if (rounds.length > rndCnt) {
      return rounds.slice(0, rndCnt)
    } else {
      return rounds
    }
  },
  exercises: ({ model }) => parentId => {
    if (!model || !parentId) return []
    const exercises = nodeSuccessors(model, parentId, "Exercise")
    return exercises.map((ex, i) => {
      const c = exercises.slice(0, i).filter(e => e.id === ex.id).length
      return parseNode(model, ex, parentEdge(model, ex, parentId, c))
    })
  },
  metaValue: ({ model, modelMeta }) => (key, nodeId) => {
    if (!model) return
    const node = nodeById(model, nodeId)
    return node ? _.getOr(undefined, `meta.${key}`, node) : modelMeta[key]
  },
  edgeMetaValue: ({ model }) => (key, parentId, nodeId, nodeIndex = 0) => {
    if (!model) return
    const node = nodeById(model, nodeId)
    if (node) {
      const l = nodeSuccessors(model, parentId, node.nodetype)
      const c = l.slice(0, nodeIndex).filter(e => e.id === nodeId).length
      const edge = parentEdge(model, nodeId, parentId, c)
      return _.getOr(undefined, `[2].meta.${key}`, edge)
    }
  },

  roundMetaValue: ({ model }) => (key, roundIndex, nodeId) => {
    if (!model) return
    const node = nodeById(model, nodeId)

    const round = _.getOr([], `meta.rounds`, node).find(r => r.index === roundIndex)

    return _.getOr(undefined, `${key}`, round)
  },
  edgeRoundMetaValue: ({ model }) => (
    key,
    roundIndex,
    parentId,
    nodeId,
    nodeIndex = 0
  ) => {
    if (!model) return
    const node = nodeById(model, nodeId)
    if (node) {
      const es = nodeSuccessors(model, parentId, node.nodetype)
      const c = es.slice(0, nodeIndex).filter(e => e.id === nodeId).length
      const edge = parentEdge(model, nodeId, parentId, c)
      const round = _.getOr([], `[2].meta.rounds`, edge).find(r => r.index === roundIndex)
      return _.getOr(undefined, `${key}`, round)
    }
  },
  modelTimer: ({ model, modelMeta }) => (id, _model) => {
    if (!model || !id) return {}
    const node = nodeById(_model || model, id)
    if (node) {
      return _.cloneDeep(_.getOr({}, "meta.timer", node))
    } else {
      return _.cloneDeep(_.getOr({}, `timers.${id}`, _model || modelMeta))
    }
  }
})

export const withModelMutations = withHandlers({
  updateTraining: ({ dispatch }) => (training, silentUpdate) => {
    if (!training && _.isObject(training)) return
    dispatch({ type: UPDATE_TRAINING, value: { ...training }, silentUpdate })
  },
  setMetaValue: ({ model, modelMeta, dispatch }) => (key, value, nodeId) => {
    if (!model) return
    const node = nodeById(model, nodeId)
    if (node) {
      if (_.isArray(key)) {
        node.meta = key.reduce((_acc, _key, _index) => {
          return { ..._acc, [_key]: value[_index] }
        }, node.meta || {})
      } else {
        node.meta = { ...node.meta, [key]: value }
      }
      dispatch({ type: UPDATE_TRAINING, value: { model } })
    } else {
      const newModelMeta = _.isArray(key)
        ? key.reduce((_acc, _key, _index) => {
            return { ..._acc, [_key]: value[_index] }
          }, modelMeta || {})
        : { ...modelMeta, [key]: value }

      dispatch({
        type: UPDATE_TRAINING,
        value: { meta: newModelMeta }
      })
    }
  },
  setEdgeMeta: ({ model, dispatch }) => (key, value, parentId, nodeId, nodeIndex = 0) => {
    if (!model) return

    const node = nodeById(model, nodeId)
    if (node) {
      const es = nodeSuccessors(model, parentId, node.nodetype)
      const c = es.slice(0, nodeIndex).filter(e => e.id === nodeId).length

      const edge = _.getOr(null, "[2]", parentEdge(model, nodeId, parentId, c))
      if (edge) {
        edge.meta = { ...edge.meta, [key]: value }
        dispatch({ type: UPDATE_TRAINING, value: { model } })
      }
    }
  },
  setRoundMeta: props => (key, value, roundIndex, nodeId) => {
    const { model, dispatch } = props
    if (!model && roundIndex >= 0) return

    const node = nodeById(model, nodeId)
    if (node) {
      const index = _.getOr([], "meta.rounds", node).findIndex(
        r => r.index === roundIndex
      )

      if (index !== -1) {
        node.meta.rounds[index] = { ...node.meta.rounds[index], [key]: value }
      } else {
        const rounds = _.getOr([], "meta.rounds", node)

        node.meta = {
          ...node.meta,
          rounds: [...rounds, { index: roundIndex, [key]: value }]
        }
      }

      dispatch({ type: UPDATE_TRAINING, value: { model } })
    }
  },
  setEdgeRoundMeta: props => (
    key,
    value,
    roundIndex,
    parentId,
    nodeId,
    nodeIndex = 0
  ) => {
    const { model, dispatch } = props
    if (!model && roundIndex >= 0) return
    const node = nodeById(model, nodeId)
    if (node) {
      const es = nodeSuccessors(model, parentId, node.nodetype)
      const c = es.slice(0, nodeIndex).filter(e => e.id === nodeId).length

      const edge = _.getOr(null, "[2]", parentEdge(model, nodeId, parentId, c))
      if (edge) {
        const rounds = _.getOr([], "meta.rounds", edge) || []
        let index = rounds.findIndex(r => r.index === roundIndex)

        if (index === -1) {
          edge.meta = {
            ...edge.meta,
            rounds: [...rounds, { index: roundIndex }]
          }
          index = edge.meta.rounds.length - 1
        }

        if (_.isArray(key)) {
          edge.meta.rounds[index] = key.reduce((_acc, _key, _index) => {
            return { ..._acc, [_key]: value[_index] }
          }, edge.meta.rounds[index] || {})
        } else {
          edge.meta.rounds[index] = { ...edge.meta.rounds[index], [key]: value }
        }

        dispatch({ type: UPDATE_TRAINING, value: { model } })
      }
    }
  },
  updateSetDone: ({ model, dispatch, rounds }) => (id, done) => {
    if (!model || !id) return
    const set = nodeById(model, id)
    if (set) {
      set.meta = { ...set.meta, done }
      rounds(id).map((r, roundIndex) => {
        const index = _.getOr([], "meta.rounds", set).findIndex(
          r => r.index === roundIndex
        )

        if (index !== -1) {
          set.meta.rounds[index] = { ...set.meta.rounds[index], done }
        } else {
          const rounds = _.getOr([], "meta.rounds", set)

          set.meta = {
            ...set.meta,
            rounds: [...rounds, { index: roundIndex, done }]
          }
        }

        const rawExercises = nodeSuccessors(model, r.id, "Exercise")
        rawExercises.map((e, ei) => {
          const c = rawExercises.slice(0, ei).filter(ex => e.id === ex.id).length
          const edge = _.getOr(null, "[2]", parentEdge(model, e.id, r.id, c))
          if (edge) {
            const index = _.getOr([], "meta.rounds", edge).findIndex(
              r => r.index === roundIndex
            )

            if (index !== -1) {
              edge.meta.rounds[index] = { ...edge.meta.rounds[index], done }
            } else {
              const rounds = _.getOr([], "meta.rounds", edge)

              edge.meta = {
                ...edge.meta,
                rounds: [...rounds, { index: roundIndex, done }]
              }
            }
          }
        })
      })
      dispatch({ type: UPDATE_TRAINING, value: { model } })
    }
  },
  updateRoundDone: props => (id, roundIndex, done, cascade) => {
    const { model, dispatch } = props
    if (!model || !id) return

    const setRoundDone = (roundIndex, done) => {
      const set = nodeById(model, id)
      if (set) {
        const index = _.getOr([], "meta.rounds", set).findIndex(
          r => r.index === roundIndex
        )

        if (index !== -1) {
          set.meta.rounds[index] = { ...set.meta.rounds[index], done }
        } else {
          const rounds = _.getOr([], "meta.rounds", set)

          set.meta = {
            ...set.meta,
            rounds: [...rounds, { index: roundIndex, done }]
          }
        }

        const rawRounds = nodeSuccessors(model, setId, "Round")
        rawRounds.map(r => {
          const rawExercises = nodeSuccessors(model, r.id, "Exercise")
          rawExercises.map((e, ei) => {
            const c = rawExercises.slice(0, ei).filter(ex => e.id === ex.id).length
            const edge = _.getOr(null, "[2]", parentEdge(model, e.id, r.id, c))
            if (edge) {
              const index = _.getOr([], "meta.rounds", edge).findIndex(
                r => r.index === roundIndex
              )

              if (index !== -1) {
                edge.meta.rounds[index] = { ...edge.meta.rounds[index], done }
              } else {
                const rounds = _.getOr([], "meta.rounds", edge)

                edge.meta = {
                  ...edge.meta,
                  rounds: [...rounds, { index: roundIndex, done }]
                }
              }
            }
          })
        })
      }
    }

    if (cascade) {
      props.rounds(id).map((round, i) => {
        if (done && i <= roundIndex) {
          setRoundDone(i, true)
        } else if (!done && i >= roundIndex) {
          setRoundDone(i, false)
        }
      })
    } else {
      setRoundDone(roundIndex, done)
    }

    dispatch({ type: UPDATE_TRAINING, value: { model } })
  },
  addRound: props => (setId, cloneMeta = []) => {
    const { model, dispatch, rounds } = props
    if (!model || !setId) return

    const set = nodeById(model, setId)
    if (set) {
      const _rounds = rounds(setId)
      set.meta = { ...set.meta, numRounds: _rounds.length + 1 }

      if (cloneMeta && cloneMeta.length > 0) {
        // clone preview exercises round meta to new exercises round meta
        const prevIndex = _rounds.length - 1
        const prevId = _.getOr(null, `[${prevIndex}].id`, _rounds)
        const exercises = nodeSuccessors(model, prevId, "Exercise")

        exercises.map((e, i) => {
          const c = exercises.slice(0, i).filter(ex => e.id === ex.id).length
          const edge = _.getOr(null, "[2]", parentEdge(model, e.id, prevId, c))
          if (edge) {
            const roundMetas = _.getOr([], "meta.rounds", edge)
            const roundMeta = roundMetas.find(r => r.index === prevIndex)
            const newRoundMeta = cloneMeta.reduce((acc, m) => {
              return roundMeta && roundMeta[m] ? { ...acc, [m]: roundMeta[m] } : acc
            }, {})
            edge.meta = {
              ...edge.meta,
              rounds: [...roundMetas, { index: prevIndex + 1, ...newRoundMeta }]
            }
          }
        })
      }
      dispatch({ type: UPDATE_TRAINING, value: { model } })
    }
  },
  delRound: ({ model, dispatch, rounds }) => (setId, index) => {
    if (!model || !setId) return

    const set = nodeById(model, setId)

    if (set) {
      const _rounds = rounds(setId)

      set.meta = {
        ...set.meta,
        numRounds: _rounds.length > 1 ? _rounds.length - 1 : 1
      }

      const delIndex = index >= 0 ? index : _rounds.length - 1

      set.meta = {
        ...set.meta,
        rounds: _.getOr([], "meta.rounds", set).filter(r => {
          r.index !== delIndex
        })
      }

      const rawRounds = nodeSuccessors(model, setId, "Round")
      rawRounds.map(r => {
        const rawExercises = nodeSuccessors(model, r.id, "Exercise")
        rawExercises.map((e, ei) => {
          const c = rawExercises.slice(0, ei).filter(ex => e.id === ex.id).length
          const edge = _.getOr(null, "[2]", parentEdge(model, e.id, r.id, c))
          if (edge) {
            edge.meta = {
              ...edge.meta,
              rounds: _.getOr([], "meta.rounds", edge).filter(r => r.index !== delIndex)
            }
          }
        })
      })

      dispatch({ type: UPDATE_TRAINING, value: { model } })
    }
  },
  updateModelTimer: ({ model, modelMeta, dispatch }) => (id, newTimer, silentUpdate) => {
    if (!model || !id) return
    const node = nodeById(model, id)
    if (node) {
      node.meta = { ...node.meta, timer: newTimer }
      dispatch({
        type: UPDATE_TRAINING_TIMER,
        value: { id, timer: newTimer },
        silentUpdate
      })
    } else {
      modelMeta.timers = {
        ...modelMeta.timers,
        [id]: {
          ..._.getOr({}, `timers.${id}`, modelMeta),
          ...newTimer
        }
      }
      dispatch({ type: UPDATE_TRAINING, value: { modelMeta }, silentUpdate })
    }
  },
  updateModelTimers: ({ model, dispatch }) => (newTimer, silentUpdate) => {
    if (!model) return

    model.nodes = _.getOr([], "nodes", model).map(node => {
      const meta = _.getOr(null, "meta", node) || {}
      if (meta.timer) {
        node.meta = { ...meta, timer: { ...meta.timer, ...newTimer } }
      } else {
        node.meta = { ...meta, timer: { id: node.id, ...newTimer } }
      }
      return node
    })
    dispatch({ type: UPDATE_TRAINING, value: { model }, silentUpdate })
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
      const modelTimestamp = _.getOr(0, "training.timestamp", state)
      return {
        model: _.getOr(undefined, "training.model", state),
        modelMeta: _.getOr({}, "training.meta", state),
        modelTimestamp,
        modelLoading: props.workoutTemplate && !modelTimestamp,
        workoutTemplateName: _.getOr("", "training.workoutTemplate.name", state),
        workoutTemplateId: _.getOr("", "training.workoutTemplate.id", state),
        workoutSessionId: _.getOr(undefined, "training.workoutSessionId", state),
        workoutSessionDate: _.getOr(undefined, "training.date", state)
      }
    }),
    branch(
      () => config.shouldComponentUpdateCheck,
      lifecycle({
        shouldComponentUpdate(nextProps) {
          return (
            this.props.modelTimestamp != nextProps.modelTimestamp ||
            (!!config.shouldComponentUpdate &&
              config.shouldComponentUpdate(this.props, nextProps))
          )
        }
      })
    ),
    withModelQueries,
    withModelMutations
  )
}
