import { compose, withProps } from "recompose"
import _ from "lodash/fp"

const READY_INTERVAL = 5

export const withCircuitSequence = compose(
  withProps(props => {
    const set = _.getOr({}, "set", props)
    const setTimeout = _.getOr(0, "timeout.value", set)

    const rounds = props.rounds(set.id)
    const sequence = rounds.reduce(
      (racc, round, roundIndex) => {
        const roundTimeout = _.getOr(0, "timeout.value", round)
        const exercises = props.exercises(round.id)
        const timeLimit = _.getOr(0, "constraints.TimeLimit.value", round)

        const _roundId = roundIndex + "-" + round.id

        const roundItem = {
          type: "round",
          timer: { id: "round-" + _roundId, totalTime: timeLimit },
          exercises,
          roundId: round.id,
          roundIndex
        }

        const rest =
          roundIndex === rounds.length - 1 && setTimeout
            ? {
                type: "rest",
                timer: { id: "rest-" + _roundId, totalTime: setTimeout },
                roundId: round.id,
                roundIndex
              }
            : roundTimeout
            ? {
                type: "rest",
                timer: { id: "rest-" + _roundId, totalTime: roundTimeout },
                roundId: round.id,
                roundIndex
              }
            : null

        return [...racc, roundItem, ...(rest ? [rest] : [])]
      },
      [{ type: "ready", timer: { id: "ready-0", totalTime: READY_INTERVAL } }]
    )

    return { sequence }
  })
)

export const withWeightSequence = compose(
  withProps(props => {
    const set = _.getOr({}, "set", props)
    const setTimeout = _.getOr(0, "timeout.value", set)

    const rounds = props.rounds(set.id)
    const sequence = rounds.reduce((racc, round, ri) => {
      const roundTimeout = _.getOr(0, "timeout.value", round)
      const exercises = props.exercises(round.id)

      const rest =
        ri === rounds.length - 1 && setTimeout
          ? {
              type: "rest",
              timer: { id: ri + "-" + round.id, totalTime: setTimeout },
              roundId: round.id,
              roundIndex: ri
            }
          : roundTimeout
          ? {
              type: "rest",
              timer: { id: ri + "-" + round.id, totalTime: roundTimeout },
              roundId: round.id,
              roundIndex: ri
            }
          : null

      const exercisesSequence = exercises.reduce((eacc, exercise, ei) => {
        return [
          ...eacc,
          {
            type: "exercise",
            item: exercise,
            exercisesLeft: exercises.length - ei,
            exerciseIndex: ei,
            roundId: round.id,
            roundIndex: ri
          }
        ]
      }, [])

      return [...racc, ...exercisesSequence, ...(rest ? [rest] : [])]
    }, [])

    return { sequence }
  })
)
