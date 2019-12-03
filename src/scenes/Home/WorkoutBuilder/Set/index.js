import React from "react"
import { compose, withHandlers, withState } from "recompose"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"

import withControls from "scenes/Home/WorkoutBuilder/components/WorkoutBuilderControls"
import { SpecsForm } from "scenes/Home/WorkoutBuilder/SpecsForm"
import { defaultSpecs } from "scenes/Home/WorkoutBuilder/common"
import { Screen } from "components/Background"
import RoundList from "./RoundList"

const SetScene = props => {
  const { set, setId, view, onSaveSet, onSaveSpecsForm } = props
  return (
    <Screen>
      {view === "selector" ? (
        <SpecsForm set={set(setId)} onSave={onSaveSpecsForm} variant="inline" />
      ) : (
        <RoundList setId={setId} onSave={onSaveSet} />
      )}
    </Screen>
  )
}

const enhanced = compose(
  withMappedNavigationParams(),
  withNavigation,
  withControls(),
  withState("view", "setView", ({ setId }) => (setId ? "next" : "selector")),
  withState("exercises", "setExercises", []),
  withHandlers({
    onSaveSpecsForm: ({ navigation, addSet, setView }) => form => {
      const newSet = addSet(form)
      navigation.setParams({ setId: newSet.id })
      setView("next")
    },
    onCreateSet: props => type => {
      const { navigation, addSet, setView } = props

      const specs = defaultSpecs(type)

      const newSet = addSet({ type, specs })
      navigation.setParams({ setId: newSet.id })
      setView("next")
    },
    onSaveSet: ({ navigation }) => () => {
      navigation.goBack()
    }
  })
)

export default enhanced(SetScene)
