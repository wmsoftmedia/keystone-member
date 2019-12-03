import { compose, lifecycle, withHandlers, withProps, withStateHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import styled, { TouchableOpacity } from "glamorous-native"

import { CheckIcon, OverviewIcon } from "kui/icons"
import { Screen } from "components/Background"
import { confirm } from "native"
import { setName } from "scenes/Home/TrainingV3/common"
import { today } from "keystone"
import { withLoader } from "hoc/withLoader"
import FooterNavigation from "scenes/Home/TrainingV3/TrainingScene/FooterNavigation"
import NoData from "components/NoData"
import RoundsList from "scenes/Home/TrainingV3/TrainingScene/RoundsList"
import _ from "lodash/fp"
import colors from "kui/colors"
import withSaveWorkout from "graphql/mutation/workout/saveWorkout"
import withWorkoutControls from "scenes/Home/TrainingV3/components/WorkoutControls"
import withWorkoutModel from "scenes/Home/TrainingV3/components/WorkoutModel"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "center"
})

export const TrainingTitleActions = props => (
  <Container key="done" onPress={props.onFinish}>
    <CheckIcon color={colors.white} />
  </Container>
)

const WorkoutOverviewButton = ({ disabled, onOverviewClick }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    opacity={disabled ? 0.5 : 1}
    disabled={disabled}
    onPress={onOverviewClick}
  >
    <OverviewIcon color={colors.white} />
  </TouchableOpacity>
)

const TrainingScene = props => {
  restTimer = props.modelTimer("global")
  return props.workout ? (
    <Screen>
      <RoundsList
        set={props.set}
        nextLabel={props.lastSet ? "FINISH" : props.nextLabel}
        moveNext={props.lastSet ? props.onFinish : props.moveNext}
      />
      {/* <TimerView
        restTimer={restTimer}
        setId={props.currentSet}
        roundIndex={props.roundIndex}
        updateModelTimer={props.updateModelTimer}
        moveToRound={props.moveToRound}
      /> */}
      <FooterNavigation
        movePrev={!props.firstSet && props.movePrev}
        moveNext={props.lastSet ? props.onFinish : props.moveNext}
        titleComponent={<WorkoutOverviewButton onOverviewClick={props.onOverviewClick} />}
        prevLabel={props.prevLabel}
        nextLabel={props.lastSet ? "FINISH" : props.nextLabel}
      />
    </Screen>
  ) : (
    <NoData
      color={colors.white}
      padding={18}
      message="We're unable to load the workout at the moment. Please, try again later."
    />
  )
}

const enhanced = compose(
  withWorkoutModel(),
  withWorkoutControls(),
  withLoader({
    color: colors.white,
    backgroundColor: colors.blue8,
    message: "Loading workout...",
    loaderProp: "modelLoading"
  }),
  withNavigation,
  withSaveWorkout,
  withStateHandlers(
    props => {
      const sets = props.sets()
      return {
        currentSet: sets.length > 0 && sets[0].id
      }
    },
    {
      setCurrentSet: () => currentSet => ({ currentSet })
    }
  ),
  withProps(props => {
    const { currentSet } = props
    const sets = props.sets()
    const set = sets.find(s => s.id === currentSet)
    const workout = props.workout()
    const setIndex = _.findIndex(s => s.id === currentSet, sets)
    const prevSet = _.getOr("", `[${setIndex - 1}]`, sets)
    const prevExCnt = props.exercises(prevSet && prevSet.id).length
    const nextSet = _.getOr("", `[${setIndex + 1}]`, sets)
    const nextExCnt = props.exercises(nextSet && nextSet.id).length
    return {
      set,
      roundIndex: props.metaValue("roundIndex", set && set.id) || 0,
      title: _.getOr("", `[${setIndex}].name`, sets),
      prevLabel: setName(_.getOr("", `type.setType`, prevSet), prevExCnt).toUpperCase(),
      nextLabel: setName(_.getOr("", `type.setType`, nextSet), nextExCnt).toUpperCase(),
      workout: workout && {
        ...workout,
        modelTimer: props.modelTimer(workout.id)
      },
      firstSet: setIndex === 0,
      lastSet: setIndex == sets.length - 1
    }
  }),
  withHandlers({
    movePrev: ({ currentSet, setCurrentSet, sets }) => () => {
      const setsList = sets()
      const index = _.findIndex(s => s.id === currentSet, setsList)
      if (index > 0) {
        setCurrentSet(setsList[index - 1].id)
      }
    },
    moveNext: ({ currentSet, setCurrentSet, sets }) => () => {
      const setsList = sets()
      const index = _.findIndex(s => s.id === currentSet, setsList)
      if (index !== -1 && index < setsList.length - 1) {
        setCurrentSet(setsList[index + 1].id)
      }
    },
    moveToRound: ({ setCurrentSet, setMetaValue }) => (setId, roundIndex) => {
      setCurrentSet(setId)
      setMetaValue("roundIndex", roundIndex, setId)
    },
    onFinish: props => () => {
      const cb = () => {
        const { navigation, model, workoutTemplate } = props
        navigation.navigate("TrainingRateScene", { model, workoutTemplate })
        props.updateModelTimers({ play: false, action: Date.now() })

        props.updateModelTimer("global", {
          play: false,
          time: 0,
          totalTime: 0,
          action: Date.now()
        })
      }
      confirm(cb, "Are you sure?", "Finish Workout")
    },
    onOverviewClick: ({ navigation, workoutTemplate }) => () => {
      workoutTemplate &&
        navigation.push("OverviewScene", {
          workoutId: workoutTemplate.id,
          preview: true,
          date: today(),
          title: "Workout overview"
        })
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const modelTimerPrev = _.getOr(null, "workout.modelTimer", prevProps)
      const modelTimerCurr = _.getOr(null, "workout.modelTimer", this.props)
      if (modelTimerCurr && !_.isEqual(modelTimerPrev, modelTimerCurr)) {
        this.props.navigation.setParams({
          onFinish: this.props.onFinish,
          workout: this.props.workout,
          updateModelTimer: this.props.updateModelTimer
        })
      }
    },
    componentDidMount() {
      this.props.navigation.setParams({
        onFinish: this.props.onFinish,
        workout: this.props.workout,
        updateModelTimer: this.props.updateModelTimer
      })
    }
  })
)

export default enhanced(TrainingScene)
