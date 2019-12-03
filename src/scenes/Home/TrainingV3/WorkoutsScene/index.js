import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet } from "react-native"
import { View } from "glamorous-native"
import { compose, withState, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { routes } from "navigation/routes"
import { today } from "keystone"
import { Switch } from "kui/components/Switch"
import { FloatButton } from "kui/components/Button"
import { Show } from "kui/components/Animation"
import { AddIcon } from "kui/icons"
import { gradients } from "kui/colors"
import { confirm } from "native"
import { withErrorHandler } from "hoc"
import CoachWorkouts from "scenes/Home/TrainingV3/WorkoutsScene/wrappers/CoachWorkouts"
import Footer, { TrainingScenes } from "scenes/Home/TrainingV3/components/Footer"
import MemberWorkouts from "scenes/Home/TrainingV3/WorkoutsScene/wrappers/MemberWorkouts"
import withWorkoutTemplateDelete from "graphql/mutation/workout/deleteWorkoutTemplate"

const tabs = ["MY WORKOUTS", "COACH WORKOUTS"]

const WorkoutsScene = ({ tab, setTab, onClick, onAddWorkout, onEdit, onDelete }) => (
  <View flex={1}>
    <LinearGradient colors={gradients.bg1} style={StyleSheet.absoluteFill} />
    <View flex={1}>
      <View paddingHorizontal={20}>
        <Switch values={tabs} onChange={setTab} value={tab} />
      </View>
      <View flex={1} paddingTop={16}>
        {tab === 0 && (
          <MemberWorkouts
            onClick={onClick}
            editable={true}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        {tab === 1 && <CoachWorkouts onClick={onClick} />}
      </View>
      <Show
        visible={tab === 0}
        style={{
          position: "absolute",
          width: 52,
          height: 52,
          right: 20,
          bottom: 20
        }}
      >
        <FloatButton onPress={onAddWorkout}>
          <AddIcon />
        </FloatButton>
      </Show>
    </View>

    <View>
      <Footer scene={TrainingScenes.WORKOUTS} />
    </View>
  </View>
)

const enhanced = compose(
  withState("tab", "setTab", 1),
  withWorkoutTemplateDelete,
  withNavigation,
  withErrorHandler,
  withHandlers({
    onClick: ({ navigation }) => item => {
      navigation.navigate(routes.WorkoutScene, {
        workoutName: item.name,
        workoutId: item.id,
        date: today()
      })
    },
    onEdit: ({ navigation }) => item => {
      navigation.navigate(routes.WorkoutBuilderScene, { workoutId: item.id })
    },
    onDelete: ({ deleteWorkoutTemplate }) => item => {
      confirm(
        () => {
          deleteWorkoutTemplate(item.id)
        },
        "This workout template will be permanently deleted.",
        "Delete workout template?",
        "Delete Forever",
        "Cancel"
      )
    },
    onAddWorkout: ({ navigation }) => () => {
      navigation.navigate("WorkoutBuilderScene")
    }
  })
)

export default enhanced(WorkoutsScene)
