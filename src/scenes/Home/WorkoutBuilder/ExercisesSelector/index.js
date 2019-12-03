import React from "react"
import { compose, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"

import { Screen } from "components/Background"
import ExerciseDirectory from "scenes/Home/ExerciseDirectory"

const ExercisesSelector = ({ selected = [], onSaveSelect }) => {
  return (
    <Screen>
      <ExerciseDirectory
        selectable={true}
        selected={selected}
        onSaveSelect={onSaveSelect}
      />
    </Screen>
  )
}

const enhanced = compose(
  withMappedNavigationParams(),
  withNavigation,
  withHandlers({
    onSaveSelect: ({ navigation, onExercisesSelect }) => items => {
      onExercisesSelect && onExercisesSelect(items)
      navigation.goBack()
    }
  })
)

export default enhanced(ExercisesSelector)
