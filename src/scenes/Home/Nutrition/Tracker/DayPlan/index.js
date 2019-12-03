import { View } from "glamorous-native"
import { compose, withHandlers, withProps, withStateHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { Screen } from "components/Background"
import { Switch } from "kui/components/Switch"
import { routes } from "navigation/routes"
import CoachPlans from "scenes/Home/Nutrition/Tracker/DayPlan/CoachPlans"
import MyDays from "scenes/Home/Nutrition/Tracker/DayPlan/MyDays"

const COACH_PLANS_TAB = "FROM COACH"
const DAYS_TAB = "MY OWN"
const TABS = [DAYS_TAB, COACH_PLANS_TAB]
const DEFAULT_TAB_INDEX = 0

const DayPlans = props => {
  const { tabIndex, setTabIndex, isPlansTab, isDaysTab } = props
  const { date, onSelect, openKitchen } = props
  return (
    <Screen>
      <View paddingHorizontal={20} paddingBottom={8}>
        <Switch values={TABS} value={tabIndex} onChange={setTabIndex} />
      </View>
      <View flex={1}>
        {isPlansTab && (
          <CoachPlans date={date} onSelect={onSelect} goToKitchen={openKitchen} />
        )}
        {isDaysTab && <MyDays onSelect={onSelect} goToKitchen={openKitchen} />}
      </View>
    </Screen>
  )
}

const enhance = compose(
  withNavigation,
  withHandlers({
    openKitchen: ({ navigation }) => () => navigation.navigate(routes.KitchenDay)
  }),
  withStateHandlers(
    { tab: TABS[DEFAULT_TAB_INDEX], tabIndex: DEFAULT_TAB_INDEX },
    { setTabIndex: () => tabIndex => ({ tabIndex, tab: TABS[tabIndex] }) }
  ),
  withProps(props => ({
    isDaysTab: props.tab === DAYS_TAB,
    isPlansTab: props.tab === COACH_PLANS_TAB
  }))
)

export default enhance(DayPlans)
