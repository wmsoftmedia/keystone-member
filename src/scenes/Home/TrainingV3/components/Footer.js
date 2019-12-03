import styled, { View, Text, TouchableOpacity } from "glamorous-native"
import { compose, setPropTypes, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { WorkoutIcon, HistoryIcon, PlanIcon, HeartHistoryIcon } from "kui/icons"
import PropTypes from "prop-types"
import { Row } from "kui/components"
import colors from "kui/colors"
import fonts from "kui/fonts"

export const TrainingScenes = {
  HISTORY: "history",
  WORKOUTS: "workouts",
  PLANS: "plans",
  EXERCISES: "exercises"
}

const tabs = [
  {
    id: TrainingScenes.HISTORY,
    label: "History",
    icon: HistoryIcon,
    disabled: false
  },
  {
    id: TrainingScenes.PLANS,
    label: "Plans",
    icon: PlanIcon,
    disabled: false
  },
  {
    id: TrainingScenes.WORKOUTS,
    label: "Workouts",
    icon: WorkoutIcon
  },
  {
    id: TrainingScenes.EXERCISES,
    label: "Exercises",
    icon: HeartHistoryIcon
  }
]

const TouchableItem = styled(p => <TouchableOpacity {...p} />)(({ disabled }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "stretch",
  opacity: disabled ? 0.3 : 1
}))

const ItemText = styled(Text)(({ selected }) => ({
  fontFamily: fonts.montserrat,
  color: selected ? colors.white : colors.white60,
  fontSize: 12,
  lineHeight: 16,
  textAlign: "center"
}))

const ItemIcon = ({ icon: IconComponent, selected }) =>
  !!IconComponent && <IconComponent color={selected ? colors.white : colors.white60} />

const Footer = ({ scene, onChange }) => (
  <Row backgroundColor={colors.darkBlue80} paddingVertical={12}>
    {tabs.map((tab, i) => (
      <TouchableItem key={i} disabled={tab.disabled} onPress={() => onChange(tab.id)}>
        <View alignItems="center">
          <ItemIcon icon={tab.icon} selected={tab.id === scene} />
          <ItemText paddingTop={4} selected={tab.id === scene}>
            {tab.label}
          </ItemText>
        </View>
      </TouchableItem>
    ))}
  </Row>
)

const enhanced = compose(
  setPropTypes({
    scene: PropTypes.oneOf(Object.values(TrainingScenes)).isRequired
  }),
  withNavigation,
  withHandlers({
    onChange: props => value => {
      if (value === TrainingScenes.HISTORY) {
        props.navigation.replace("HistoryScene")
      } else if (value === TrainingScenes.WORKOUTS) {
        props.navigation.replace("WorkoutsScene")
      } else if (value === TrainingScenes.PLANS) {
        props.navigation.replace("PlansScene")
      } else if (value === TrainingScenes.EXERCISES) {
        props.navigation.replace("ExercisesScene")
      }
    }
  })
)

export default enhanced(Footer)
