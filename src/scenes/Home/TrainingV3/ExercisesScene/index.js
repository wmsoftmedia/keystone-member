import { View } from "glamorous-native"
import { compose, withState, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"

import ExerciseLookup from "scenes/Home/ExerciseLookup"
import ExerciseDirectory from "scenes/Home/ExerciseDirectory"
import { Screen } from "components/Background"
import { Switch } from "kui/components/Switch"
import Footer, { TrainingScenes } from "scenes/Home/TrainingV3/components/Footer"

const tabs = ["HISTORY", "DIRECTORY"]

const ExercisesScene = props => {
  const { tab, onSetTab } = props
  return (
    <Screen>
      <View paddingHorizontal={20}>
        <Switch values={tabs} onChange={onSetTab} value={tab} />
      </View>
      <View flex={1} marginTop={16}>
        {tab == 0 && <ExerciseLookup />}
        {tab == 1 && <ExerciseDirectory />}
      </View>
      <View>
        <Footer scene={TrainingScenes.EXERCISES} />
      </View>
    </Screen>
  )
}

const enhanced = compose(
  withNavigation,
  withMappedNavigationParams(),
  withState("tab", "setTab", 0),
  withHandlers({
    onSetTab: ({ setTab, navigation }) => tab => {
      navigation.setParams({
        title: tab === 0 ? "Exercise History" : "Exercise Directory"
      })
      setTab(tab)
    }
  })
)

export default enhanced(ExercisesScene)
