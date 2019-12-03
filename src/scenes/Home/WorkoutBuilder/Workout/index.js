import React from "react"
import { compose, withHandlers, withState } from "recompose"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import _ from "lodash/fp"

import { Screen } from "components/Background"
import { routes } from "navigation/routes"
import { today } from "keystone"
import withControls from "scenes/Home/WorkoutBuilder/components/WorkoutBuilderControls"
import withModel from "scenes/Home/WorkoutBuilder/components/WorkoutBuilderModel"
import WorkoutForm from "./WorkoutForm"
import WorkoutInfo from "./WorkoutInfo"

const WorkoutScene = props => {
  const { view, onSaveForm, onSave, onStart, onAddSet, onClick } = props
  const workout = props.workout()
  return (
    <Screen>
      {view === "form" ? (
        <WorkoutForm workout={workout} onSaveWorkout={onSaveForm} />
      ) : view === "info" && props.isInitialized() ? (
        <React.Fragment>
          <WorkoutInfo
            onSave={onSave}
            onStart={onStart}
            onClick={onClick}
            onAddSet={onAddSet}
          />
        </React.Fragment>
      ) : null}
    </Screen>
  )
}

const enhanced = compose(
  withMappedNavigationParams(),
  withNavigation,
  withModel(),
  withControls(),
  withState("view", "setView", ({ isInitialized }) =>
    !isInitialized() ? "form" : "info"
  ),
  withHandlers({
    onSaveForm: ({ updWorkout, setView }) => workout => {
      updWorkout(workout)
      setView("info")
    },
    onSave: ({ navigation, updWorkout }) => () => {
      updWorkout()
      navigation.goBack()
    },
    onStart: ({ navigation, workout }) => () => {
      const workoutInfo = workout(true)
      navigation.navigate(routes.WorkoutScene, {
        workoutName: workoutInfo.name,
        workoutId: workoutInfo.id,
        date: today()
      })
    },
    onClick: ({ navigation, setView }) => () => {
      setView("form")
      navigation.setParams({
        onBackAction: () => {
          setView("info")
          navigation.setParams({ onBackAction: null })
        }
      })
    },
    onAddSet: ({ navigation }) => () => {
      navigation.navigate(routes.SetBuilderScene, { title: "Set 1" })
    }
  })
)

export default enhanced(WorkoutScene)
