import { View } from "glamorous-native"
import { compose, withState, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { withErrorHandler } from "hoc"
import Footer, { TrainingScenes } from "scenes/Home/TrainingV3/components/Footer"
import PlansList from "scenes/Home/TrainingV3/PlansScene/PlansList"
import { Switch } from "kui/components/Switch"
import { Screen } from "components/Background"

const tabs = ["ACTIVE", "COMPLETED"]

const PlansScene = props => {
  const { tab, setTab, onClick } = props
  return (
    <Screen>
      <View paddingHorizontal={20}>
        <Switch values={tabs} onChange={setTab} value={tab} />
      </View>
      <View flex={1} marginTop={16}>
        <PlansList tab={props.tab} date={props.date} onClick={onClick} />
      </View>
      <View>
        <Footer scene={TrainingScenes.PLANS} />
      </View>
    </Screen>
  )
}

const enhanced = compose(
  withState("tab", "setTab", 0),
  withNavigation,
  withErrorHandler,
  withHandlers({
    onClick: ({ date, navigation }) => item => {
      navigation.navigate("PlanScene", {
        assignedPlanId: item.id,
        assignedPlanName: item.name,
        date
      })
    }
  })
)

export default enhanced(PlansScene)
