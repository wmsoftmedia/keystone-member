import { compose, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { Screen } from "components/Background"
import { withErrorHandler } from "hoc"
import Footer, { TrainingScenes } from "scenes/Home/TrainingV3/components/Footer"
import WorkoutHistoryList from "scenes/Home/TrainingV3/HistoryScene/WorkoutHistoryList"
import withWorkoutSessionDelete from "graphql/mutation/workout/deleteWorkout"

const HistoryScene = ({ date, onClick, onDelete }) => (
  <Screen>
    <WorkoutHistoryList date={date} onClick={onClick} onDelete={onDelete} />
    <Footer scene={TrainingScenes.HISTORY} />
  </Screen>
)

const enhanced = compose(
  withNavigation,
  withErrorHandler,
  withWorkoutSessionDelete,
  withHandlers({
    onClick: ({ navigation }) => item => {
      navigation.navigate("TrainingScene", {
        workoutSessionId: item.id
      })
    },
    onDelete: ({ deleteWorkoutSession }) => item => {
      deleteWorkoutSession(item.id, item.date)
    }
  })
)

export default enhanced(HistoryScene)
