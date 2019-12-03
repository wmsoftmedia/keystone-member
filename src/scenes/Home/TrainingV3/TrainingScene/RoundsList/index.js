import { View, TouchableOpacity } from "glamorous-native"
import { withHandlers, withProps, compose, withState, lifecycle } from "recompose"
import { defaultProps } from "recompose"
import { ScrollView } from "react-native"

import { withNavigation } from "react-navigation"
import React from "react"
import _ from "lodash/fp"
import moment from "moment"

import { withSettings } from "hoc"
import withWorkoutControls from "scenes/Home/TrainingV3/components/WorkoutControls"
import { AddIcon, DeleteIcon, PlayIcon } from "kui/icons"
import { PrimaryButton, ProgressButton } from "kui/components/Button"
import InfoMessage from "components/InfoMessage"
import { Row } from "kui/components"
import { confirm } from "native"
import { targetValue } from "scenes/Home/TrainingV3/utils"
import Card from "kui/components/Card"
import ExercisesList from "scenes/Home/TrainingV3/TrainingScene/RoundsList/ExercisesList"
import SetHeader from "scenes/Home/TrainingV3/TrainingScene/RoundsList/SetHeader"
import Pause from "scenes/Home/TrainingV3/TrainingScene/RoundsList/Pause"
import Text from "kui/components/Text"
import colors from "kui/colors"

const StartButton = props => {
  const { label, onPress, onLongPress, setTimer, ...rest } = props
  const { totalTime, time } = setTimer || { totalTime: 0, time: 0 }
  const _time = totalTime - time
  const utcTime = totalTime && moment.utc(_time * 1000)
  const timeValue =
    (totalTime && (_time < 3600 ? utcTime.format("m:ss") : utcTime.format("HH:mm:ss"))) ||
    ""

  return totalTime ? (
    <ProgressButton
      value={time}
      maxValue={totalTime}
      onPress={onPress}
      onLongPress={onLongPress}
      renderLabel={() => {
        return (
          <Row centerY spread paddingHorizontal={16}>
            <PlayIcon size={24} />
            <Text variant="button1">{label}</Text>
            <Text variant="body1">{timeValue}</Text>
          </Row>
        )
      }}
      {...rest}
    />
  ) : (
    <PrimaryButton
      label={label}
      onPress={onPress}
      onLongPress={onLongPress}
      marginBottom={20}
      {...rest}
    />
  )
}

const Round = props => {
  return (
    <View marginBottom={12}>
      <Row centerY spread marginBottom={8}>
        <Text variant="caption2">
          {props.roundIndex + 1}/{props.colRounds}
        </Text>
        {props.canDeleteRound && (
          <TouchableOpacity onPress={() => props.onDelRound(props.roundIndex)}>
            <DeleteIcon />
          </TouchableOpacity>
        )}
      </Row>
      <ExercisesList
        set={props.set}
        exercises={props.exercises}
        round={props.round}
        colRounds={props.colRounds}
        setTimeout={props.setTimeout}
        roundIndex={props.roundIndex}
        converter={props.converter}
        canEditExercise={props.canEditExercise}
        onDoneChange={props.onDoneChange}
      />
    </View>
  )
}

const RoundsList = props => {
  const { set, sequenceMeta, canAddRound, exercisesCount, roundTime } = props
  const isStarted = !sequenceMeta.done && sequenceMeta.started

  const timerId = sequenceMeta.timerId || ""
  const curr = sequenceMeta.curr || ""
  const next = sequenceMeta.next || ""
  const totalTime = _.getOr(0, `[${timerId}].totalTime`, sequenceMeta)
  const time = _.getOr(0, `[${timerId}].time`, sequenceMeta)
  const pauseType = curr === "rest" ? "rest" : "exercise"

  const title = pauseType === "rest" ? "Rest!" : curr
  const subtitle = next
    ? next === "rest"
      ? "Rest is coming up!"
      : 'Next exercise: "' + next + '"'
    : ""

  return props.rounds.length > 0 ? (
    <View flex={1}>
      <SetHeader set={set} exercisesCount={exercisesCount} roundTime={roundTime} />
      <ScrollView
        ref={props.setScrollView}
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: isStarted ? 116 : 0 }}
      >
        <StartButton
          setTimer={props.setTimer}
          label={sequenceMeta.done ? "REPLAY SET" : "PLAY SET"}
          onPress={sequenceMeta.done ? props.onResetSet : props.onStartSet}
          onLongPress={props.onResetSet}
          marginBottom={20}
        />

        {props.rounds.map((round, i) => (
          <Round
            key={i}
            round={round}
            roundIndex={i}
            exercises={props.roundExercises[round.id] || []}
            colRounds={props.colRounds}
            set={set}
            setTimeout={props.colRounds - 1 === i ? props.setTimeout : 0}
            canEditExercise={props.canEditExercise}
            canDeleteRound={props.canDeleteRound}
            onDoneChange={props.onDoneChange}
            onDelRound={props.onDelRound}
            converter={props.converter}
          />
        ))}
        {canAddRound && (
          <TouchableOpacity onPress={props.onAddRound} paddingBottom={24}>
            <Card color="rgba(0, 49, 94, 0.5)" padding={16} elevated={false}>
              <Row centerXY>
                <AddIcon size={24} color={colors.darkBlue30} />
                <Text variant="button1">ADD ONE MORE ROUND</Text>
              </Row>
            </Card>
          </TouchableOpacity>
        )}
      </ScrollView>
      {isStarted && (
        <View position="absolute" bottom={0} width="100%">
          <Pause
            onResume={props.onStartSet}
            type={pauseType}
            title={title}
            subtitle={subtitle}
            time={time}
            totalTime={totalTime}
            onClose={props.onCloseSet}
          />
        </View>
      )}
    </View>
  ) : (
    <InfoMessage
      title={"Empty Set"}
      subtitle={`This set does not contain any exercises.`}
    />
  )
}

const enhance = compose(
  defaultProps({
    canEditExercise: true,
    canAddRound: true,
    canDeleteRound: true
  }),
  withNavigation,
  withWorkoutControls({
    shouldComponentUpdate: (props, nextProps) => {
      return !_.isEqual(props.set, nextProps.set)
    }
  }),
  withSettings,
  withState("scrollView", "setScrollView", null),
  lifecycle({
    componentDidUpdate(prevProps) {
      const { set, scrollView } = this.props
      if (set && prevProps.set && set.id !== prevProps.set.id) {
        scrollView && scrollView.scrollTo({ x: 0, y: 0, animated: false })
      }
    }
  }),
  withProps(props => {
    const { set } = props
    const rounds = props.rounds(set && set.id)

    const sequenceMeta = props.metaValue("sequence", set && set.id) || {}

    const setType = _.getOr("", "set.type.setType", props)
    const setTimer =
      setType === "TABATA" || setType === "EMOM"
        ? rounds.reduce(
            (acc, round, index) => {
              const timeLimit = _.getOr(0, "constraints.TimeLimit.value", round)
              const timeout = _.getOr(0, "timeout.value", round)
              const metaTime = _.getOr(0, `[${sequenceMeta.timerId}].time`, sequenceMeta)
              const time = sequenceMeta.curr === "rest" ? timeLimit + metaTime : metaTime
              return {
                ...acc,
                time: sequenceMeta.roundIndex === index ? acc.totalTime + time : acc.time,
                totalTime: acc.totalTime + timeLimit + timeout
              }
            },
            { totalTime: 0, time: 0 }
          )
        : { time: 0, totalTime: _.getOr(0, "set.constraints.TimeLimit.value", props) }

    const roundExercises = rounds.reduce((acc, r) => {
      return acc[r.id] ? acc : { ...acc, [r.id]: props.exercises(r.id) }
    }, {})

    const firstRoundId = rounds.length > 0 && rounds[0].id
    const exercisesCount = _.getOr(0, `${firstRoundId}.length`, roundExercises)
    const roundTime =
      setType === "EMOM" ? _.getOr(60, "[0].constraints.TimeLimit.value", rounds) : null

    const setTimeout = _.getOr(0, "timeout.value", set)

    return {
      exercisesCount,
      roundTime,
      setTimeout,
      rounds,
      colRounds: rounds.length,
      roundExercises,
      sequenceMeta,
      setTimer,
      converter: { weightConverter: props.weightConverter, weightUnit: props.weightUnit }
    }
  }),
  withHandlers({
    onAddRound: ({ set, addRound }) => () => {
      addRound(set && set.id, ["load", "effort"])
    },
    onDelRound: ({ set, colRounds, delRound }) => index => {
      if (colRounds > 1) {
        const cb = () => {
          delRound(set && set.id, index)
        }
        confirm(cb, "Are you sure?", "Delete round")
      }
    },
    onDoneChange: props => (roundId, roundIndex, exerciseId, exerciseIndex) => done => {
      const { edgeRoundMetaValue, setEdgeRoundMeta } = props

      const exercises = props.exercises(roundId)

      const exercise =
        _.getOr(null, `[${exerciseIndex}]`, exercises) ||
        _.getOr(null, `[0]`, exercises) ||
        {}

      const keys = ["done"]
      const values = [done]

      if (done) {
        if (!edgeRoundMetaValue("load", roundIndex, roundId, exerciseId, exerciseIndex)) {
          const loadSpec = targetValue(exercise, "Load", roundIndex) || {}
          if (loadSpec.type === "Range" && (loadSpec.start || loadSpec.end)) {
            keys.push("load")
            values.push(loadSpec.start || loadSpec.end)
          }
        }

        if (
          !edgeRoundMetaValue("effort", roundIndex, roundId, exerciseId, exerciseIndex)
        ) {
          const effordSpec =
            targetValue(exercise, "Calories", roundIndex) ||
            targetValue(exercise, "Repetitions", roundIndex) ||
            targetValue(exercise, "Distance", roundIndex) ||
            targetValue(exercise, "Duration", roundIndex) ||
            {}
          if (effordSpec.type === "Range" && (effordSpec.start || effordSpec.end)) {
            keys.push("effort")
            values.push(effordSpec.start || effordSpec.end)
          }
        }
      }

      setEdgeRoundMeta(keys, values, roundIndex, roundId, exerciseId, exerciseIndex)
    }
  }),
  withHandlers({
    onStartSet: props => () => {
      const { set, navigation, onDoneChange, setMetaValue, metaValue } = props
      const sequenceMeta = metaValue("sequence", set && set.id) || {}
      setMetaValue("sequence", { ...sequenceMeta, started: true }, set && set.id)
      navigation.navigate("SetPopup", {
        setId: set && set.id,
        onDoneChange: onDoneChange
      })
    },
    onResetSet: ({ set, navigation, setMetaValue, onDoneChange }) => () => {
      const cb = () => {
        setMetaValue("sequence", { started: true }, set && set && set.id)

        navigation.navigate("SetPopup", {
          setId: set && set.id,
          onDoneChange: onDoneChange
        })
      }
      confirm(cb, "Are you sure?", "Restart Set")
    },
    onCloseSet: ({ set, setMetaValue, metaValue }) => () => {
      const sequenceMeta = metaValue("sequence", set && set.id) || {}
      setMetaValue("sequence", { ...sequenceMeta, started: false }, set && set.id)
    }
  })
)

export default enhance(RoundsList)
