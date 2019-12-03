import { FloatingAction } from "react-native-floating-action"
import { ScrollView, View } from "glamorous-native"
import { compose, withHandlers, withState, withProps } from "recompose"
import { withNavigation, NavigationEvents } from "react-navigation"
import React from "react"
import moment from "moment"
import _ from "lodash/fp"

import { withSettings } from "hoc"
import { OpenExistingIcon, SubmitIcon, StartIcon, DurationIcon } from "kui/icons"
import { FloatButtonAction } from "kui/components/Button"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { difficultyVariant } from "scenes/Home/TrainingV3/common"
import { getOr } from "keystone"
import Label from "kui/components/Label"
import Line from "kui/components/Line"
import NoData from "components/NoData"
import NotesWidget from "scenes/Home/TrainingV3/components/NotesWidget"
import StagesList from "scenes/Home/TrainingV3/OverviewScene/StagesList"
import Text from "kui/components/Text"
import colors from "kui/colors"

const buttonActions = [
  {
    position: 1,
    name: "submit",
    render: () => (
      <FloatButtonAction key="submit" text={"Submit Workout"} Icon={SubmitIcon} />
    )
  },
  {
    position: 3,
    name: "new",
    render: () => <FloatButtonAction key="new" text={"Start New"} Icon={StartIcon} />
  },
  {
    position: 2,
    name: "old",
    render: () => (
      <FloatButtonAction key="old" text={"Open Existing"} Icon={OpenExistingIcon} />
    )
  }
]

const Overview = props => {
  const { model, workoutTemplate, workoutSession } = props

  const _buttonActions = workoutSession
    ? buttonActions
    : buttonActions.filter(a => a.name !== "old")

  const difficulty =
    difficultyVariant[workoutTemplate && workoutTemplate.difficulty] ||
    difficultyVariant["Easy"]

  const duration =
    workoutTemplate && workoutTemplate.duration
      ? workoutTemplate.duration >= 3600
        ? moment.utc(workoutTemplate.duration * 1000).format("H:mm:ss [min]")
        : moment.utc(workoutTemplate.duration * 1000).format("mm:ss [min]")
      : "--"

  return (
    <Screen>
      <NavigationEvents onWillFocus={props.onWillFocus} />
      {!!workoutTemplate ? (
        <View flex={1}>
          <View paddingHorizontal={20}>
            <Row marginTop={20} alignItems="center" justifyContent="space-between">
              <Text variant="body2" flex={1} paddingRight={8}>
                {workoutTemplate.name}
              </Text>
              <Label variant={difficulty.variant} text={difficulty.name} />
            </Row>
            <Row marginTop={12} justifyContent="space-between" alignItems="center">
              <Row alignItems="center">
                <DurationIcon />
                <Text variant="body1" paddingLeft={8}>
                  Duration
                </Text>
              </Row>
              <Text variant="body2">{duration}</Text>
            </Row>
            <Line marginTop={16} marginHorizontal={0} color={colors.darkBlue80} />
          </View>
          <ScrollView
            flex={1}
            paddingHorizontal={20}
            contentContainerStyle={{ paddingBottom: 90, paddingTop: 20 }}
          >
            <NotesWidget notes={workoutTemplate.notes} />
            <StagesList model={model} converter={props.converter} />
          </ScrollView>

          {!props.preview && (
            <FloatingAction
              distanceToEdge={20}
              color={colors.darkBlue50}
              actions={_buttonActions}
              overlayColor={"rgba(3,20,42,0.8)"}
              actionsPaddingTopBottom={4}
              onPressItem={props.onButtonActionPress}
              iconHeight={20}
              iconWidth={20}
            />
          )}
        </View>
      ) : (
        <NoData
          color={colors.white}
          padding={18}
          message="We're unable to load the workout at the moment. Please, try again later."
        />
      )}
    </Screen>
  )
}

const enhanced = compose(
  withNavigation,
  withSettings,
  withState("modalVisible", "setModalVisible", false),
  withProps(props => {
    const workoutData = getOr({}, "data.workoutTemplateById", props)
    const { model, ...workoutTemplate } = workoutData
    const sl = getOr([], "currentMember.workoutSessionsByDate.nodes", props.data)

    const workoutSession =
      workoutTemplate &&
      sl.find(session => getOr("", "workoutTemplate.id", session) === workoutTemplate.id)

    return {
      model: model ? JSON.parse(model) : {},
      workoutTemplate: workoutTemplate && {
        ...workoutTemplate,
        duration: (workoutTemplate.duration || 0) * 60
      },
      workoutSession: workoutSession,
      converter: { weightConverter: props.weightConverter, weightUnit: props.weightUnit }
    }
  }),
  withHandlers({
    onButtonActionPress: props => actionName => {
      const { navigation, workoutTemplate, workoutSession } = props

      if (actionName === "submit") {
        navigation.navigate("TrainingRateScene", {
          workoutId: workoutTemplate.id,
          submit: true
        })
      }
      if (actionName === "new") {
        navigation.navigate("TrainingScene", { workoutId: workoutTemplate.id })
      }
      if (actionName === "old" && workoutSession) {
        navigation.navigate("TrainingScene", { workoutSessionId: workoutSession.id })
      }
    },
    onWillFocus: props => payload => {
      if (_.getOr(null, "action.type", payload) === "Navigation/BACK") {
        props.data.refetch()
      }
    }
  })
)

export default enhanced(Overview)
