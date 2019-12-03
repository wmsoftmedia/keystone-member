import React from "react"
import { routes } from "navigation/routes"
import {
  WorkoutScene,
  SetScene,
  ExercisesSelector,
  TimeSelector,
  ExerciseForm,
  SpecsForm
} from "scenes/Home/WorkoutBuilder"
import { View } from "glamorous-native"
import { modalNavigationOptions } from "navigation/utils"
import { HeaderBackButton } from "react-navigation-stack"
import _ from "lodash/fp"

export const workoutBuilderRoutes = {
  [routes.WorkoutBuilderScene]: {
    screen: WorkoutScene,
    path: "/workout-builder/workout",
    navigationOptions: props => {
      const params = _.getOr({}, "navigation.state.params", props)
      return {
        title: params.title ? params.title : "Edit Workout",
        ...(params.onBackAction
          ? {
              headerLeft: (
                <View marginTop={-2}>
                  <HeaderBackButton onPress={params.onBackAction} tintColor="#ffffff" />
                </View>
              )
            }
          : {})
      }
    }
  },
  [routes.SetBuilderScene]: {
    screen: SetScene,
    path: "/workout-builder/set",
    navigationOptions: props => {
      const params = _.getOr({}, "navigation.state.params", props)
      return {
        title: params.title ? params.title : "Set"
      }
    }
  },
  [routes.ExercisesSelector]: {
    screen: ExercisesSelector,
    path: "/workout-builder/exercises-selector",
    navigationOptions: {
      title: "Select exercises"
    }
  },
  [routes.ExerciseForm]: {
    screen: ExerciseForm,
    path: "/workout-builder/exercise-form",
    navigationOptions: ({ navigation }) => {
      return {
        ...modalNavigationOptions,
        title: _.getOr("Create exercise", "state.params.title", navigation)
      }
    }
  },
  [routes.SpecsForm]: {
    screen: SpecsForm,
    path: "/workout-builder/specs-form",
    navigationOptions: ({ navigation }) => {
      return {
        ...modalNavigationOptions,
        title: _.getOr("Specs", "state.params.title", navigation)
      }
    }
  },
  [routes.TimeSelector]: {
    screen: TimeSelector,
    path: "/workout-builder/time-selector",
    navigationOptions: ({ navigation }) => {
      return {
        ...modalNavigationOptions,
        title: _.getOr("Select time", "state.params.title", navigation)
      }
    }
  }
}

ExerciseForm
