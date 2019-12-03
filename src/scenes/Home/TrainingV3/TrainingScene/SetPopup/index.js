import { compose, withHandlers, withProps, lifecycle, withState, branch } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import { useKeepAwake } from "expo-keep-awake"
import { withNavigation } from "react-navigation"
import { View } from "glamorous-native"
import React from "react"
import _ from "lodash/fp"

import { withSettings } from "hoc"
import withWorkoutControls from "scenes/Home/TrainingV3/components/WorkoutControls"
import { withWeightSequence } from "scenes/Home/TrainingV3/TrainingScene/SetPopup/builder"
import { withCircuitSequence } from "scenes/Home/TrainingV3/TrainingScene/SetPopup/builder"
import Footer from "scenes/Home/TrainingV3/TrainingScene/SetPopup/Footer"
import Rest from "scenes/Home/TrainingV3/TrainingScene/SetPopup/Rest"
import Round from "scenes/Home/TrainingV3/TrainingScene/SetPopup/Round"
import Ready from "scenes/Home/TrainingV3/TrainingScene/SetPopup/Ready"
import Exercise from "scenes/Home/TrainingV3/TrainingScene/SetPopup/Exercise"
import { ModalScreen } from "components/Background"
import colors from "kui/colors"

const componentByType = type =>
  type === "round"
    ? Round
    : type === "exercise"
    ? Exercise
    : type === "rest"
    ? Rest
    : type === "ready"
    ? Ready
    : null

const SetPopup = props => {
  const { sequence, position, sequenceMeta, sequenceType, converter } = props
  useKeepAwake()

  const screen = _.getOr(null, `[${position}]`, sequence)
  const screenType = (screen && screen.type) || ""
  const screenColor =
    screenType === "rest"
      ? colors.green60
      : screenType === "ready"
      ? colors.darkBlue90
      : colors.blue70
  const nextScreenLabel = _.getOr("", `[${position + 1}].exercises[0].name`, sequence)

  const Component = componentByType(screenType)

  return (
    <ModalScreen gradient={false} backgroundColor={screenColor}>
      {!!Component && (
        <View flex={1}>
          <View flex={1}>
            <Component
              screen={screen}
              sequenceMeta={sequenceMeta}
              nextScreenLabel={nextScreenLabel}
              roundIndex={screen && screen.roundIndex}
              converter={converter}
              exercisesLeft={screen && screen.exercisesLeft}
              updateSequenceMeta={props.updateSequenceMeta}
              onComplit={props.onComplitClick}
              {...(sequenceType === "circuit"
                ? { moveForwardAuto: true, autoPlay: true }
                : {})}
            />
          </View>
          {screenType !== "ready" && (
            <Footer
              isLast={position === sequence.length - 1}
              onComplit={props.onComplitClick}
              onBack={props.onBackClick}
            />
          )}
        </View>
      )}
    </ModalScreen>
  )
}

const extractSequenceMeta = (sequence, position) => {
  const meta = {}
  const timerId = _.getOr("", `[${position}].timer.id`, sequence)
  if (timerId) {
    meta.timerId = timerId
  }

  const curr = _.getOr("", `[${position}]`, sequence)

  if (curr && curr.type === "rest") {
    meta.curr = "rest"
  } else if (curr && curr.type === "round") {
    meta.curr = _.getOr("", `exercises[0].name`, curr)
  } else if (curr && curr.type === "exercise") {
    meta.curr = _.getOr("", `item.name`, curr)
  }

  const next = _.getOr("", `[${position + 1}]`, sequence)
  if (next && next.type === "rest") {
    meta.next = "rest"
  } else if (next && next.type === "round") {
    meta.next = _.getOr("", `exercises[0].name`, next)
  } else if (next && next.type === "exercise") {
    meta.next = _.getOr("", `item.name`, next)
  }

  return meta
}

const enhance = compose(
  withMappedNavigationParams(),
  withNavigation,
  withSettings,
  withWorkoutControls({
    shouldComponentUpdate: (props, nextProps) => {
      return props.setId !== nextProps.setId
    }
  }),
  withState("position", "setPosition", 0),
  withProps(props => {
    const set = props.sets().find(s => s.id === props.setId) || {}
    const setType = _.getOr("", "type.setType", set)
    return {
      set,
      sequenceMeta: props.metaValue("sequence", props.setId) || {},
      sequenceType: setType === "EMOM" || setType === "TABATA" ? "circuit" : "weight",
      colRounds: props.rounds(props.setId).length,
      converter: { weightConverter: props.weightConverter, weightUnit: props.weightUnit }
    }
  }),
  branch(
    props => props.sequenceType === "circuit",
    withCircuitSequence,
    withWeightSequence
  ),
  withHandlers({
    updateSequenceMeta: ({ set, sequenceMeta, setMetaValue }) => meta => {
      setMetaValue("sequence", { ...sequenceMeta, ...meta }, set.id)
    },
    onBackClick: props => () => {
      props.navigation.goBack()
    },
    onComplitClick: props => () => {
      const { set, sequence, position, setMetaValue, sequenceMeta, navigation } = props
      const currentItem = sequence[position]

      if (currentItem.type === "round") {
        currentItem.exercises.map((e, i) => {
          props.onDoneChange(currentItem.roundId, currentItem.roundIndex, e.id, i)(true)
        })
      } else if (currentItem.type === "exercise") {
        props.onDoneChange(
          currentItem.roundId,
          currentItem.roundIndex,
          currentItem.item.id,
          currentItem.exerciseIndex
        )(true)
      }

      if (sequence.length === 0 || position === sequence.length - 1) {
        setMetaValue("sequence", { ...sequenceMeta, done: true }, set.id)
        navigation.goBack()
      } else {
        const nextItem = sequence[position + 1]
        props.setPosition(position + 1)

        const meta = extractSequenceMeta(sequence, position + 1)

        setMetaValue(
          "sequence",
          {
            ...sequenceMeta,
            ...meta,
            ...{
              roundIndex: nextItem.roundIndex,
              position: position + 1,
              type: nextItem.type
            }
          },
          set.id
        )
      }
    }
  }),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return (
        this.props.setId != nextProps.setId || this.props.position != nextProps.position
      )
    },
    componentDidUpdate(prevProps) {
      const { position } = this.props
      if (position !== prevProps.position) {
        const type = _.getOr("", `sequence.[${position}].type`, this.props)
        const roundIndex = _.getOr("", `sequence.[${position}].roundIndex`, this.props)

        const title =
          type === "rest"
            ? "Take a rest now"
            : "Set " + (roundIndex + 1) + "/" + this.props.colRounds
        this.props.navigation.setParams({ title })
      }
    },
    componentDidMount() {
      const position = _.getOr(0, `sequenceMeta.position`, this.props)
      this.props.setPosition(position)
      const roundIndex = _.getOr("", `sequenceMeta.roundIndex`, this.props)
      const title =
        _.getOr("", `sequenceMeta.type`, this.props) === "rest"
          ? "Take a rest now"
          : "Set " + (roundIndex + 1) + "/" + this.props.colRounds
      this.props.navigation.setParams({ title })

      const meta = extractSequenceMeta(this.props.sequence, position)
      if (_.keys(meta).length > 0) {
        this.props.setMetaValue(
          "sequence",
          { ...this.props.sequenceMeta, ...meta },
          this.props.setId
        )
      }
    }
  })
)

export default enhance(SetPopup)
