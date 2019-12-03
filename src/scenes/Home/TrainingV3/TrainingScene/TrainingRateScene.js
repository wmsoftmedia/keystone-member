import { View } from "glamorous-native"
import { withHandlers, withProps, withState, lifecycle, compose, branch } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import { withNavigation } from "react-navigation"
import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet } from "react-native"
import moment from "moment"
import React from "react"
import * as Sentry from "sentry-expo"
import _ from "lodash/fp"

import { logErrorWithMemberId } from "hoc/withErrorHandler"
import withWorkoutSessionSave from "graphql/mutation/workout/saveWorkout"
import withWorkoutSessionDelete from "graphql/mutation/workout/deleteWorkout"
import DatePicker from "components/DatePicker"
import { PerformanceIcon, DifficultyIcon } from "kui/icons"
import { withLoader } from "hoc/withLoader"
import { confirm } from "native"
import withWorkoutModel from "scenes/Home/TrainingV3/components/WorkoutModel"
import withWorkoutControls from "scenes/Home/TrainingV3/components/WorkoutControls"
import { cardTopStyle } from "styles"
import { PrimaryButton, SecondaryButton } from "kui/components/Button"
import RotarySelector from "kui/components/RotarySelector"
import Text from "kui/components/Text"
import { TextInput } from "kui/components/Input"
import { Row } from "kui/components"
import colors, { gradients } from "kui/colors"
import fonts from "kui/fonts"
import { genUuid } from "keystone"

const renderValue = value => (
  <View position="relative" justifyContent="center" alignItems="center" flex={1}>
    <Row>
      <Text variant="h2" color={colors.darkBlue10}>
        {value || "0"}
      </Text>
      <Text variant="h2" color={colors.darkBlue10}>
        /10
      </Text>
    </Row>
  </View>
)

const TrainingRateScene = props => {
  return (
    <View flex={1} {...cardTopStyle} backgroundColor={gradients.card[0]}>
      <LinearGradient
        colors={gradients.card}
        style={{ ...StyleSheet.absoluteFill, top: 20 }}
      />
      <View flex={1} padding={20} paddingTop={28}>
        <View alignItems="center">
          <Text variant="body2">Rate your Workout</Text>
        </View>
        <Row centerY spread marginTop={20}>
          <Text variant="body1">Workout date</Text>
          <DatePicker
            date={props.workoutSessionDate}
            onDateChange={props.onUpdateDate}
            labelProps={{ paddingVertical: 4 }}
          />
        </Row>

        <View flex={1}>
          <View marginTop={10}>
            <Text variant="caption1" color={colors.darkBlue10} opacity={0.5}>
              Session Notes
            </Text>
            <TextInput
              marginTop={8}
              value={props.notes}
              blurOnSubmit={true}
              multiline={true}
              numberOfLines={4}
              height={22 * 4}
              placeholder=""
              backgroundColor={colors.barkBlue90}
              allowFontScaling={false}
              onChange={props.onNotesChange}
              autoCorrect={true}
            />
          </View>
          <View flex={1} marginVertical={20} justifyContent="center">
            <Row justifyContent="space-around">
              <View alignItems="center">
                <Row alignItems="center">
                  <DifficultyIcon />
                  <Text
                    variant="caption1"
                    fontFamily={fonts.montserratSemiBold}
                    paddingLeft={4}
                  >
                    DIFFICULTY
                  </Text>
                </Row>

                <RotarySelector
                  value={props.difficulty}
                  startValue={0}
                  endValue={10}
                  minValue={0}
                  maxValue={10}
                  onChange={props.onDifficultyChange}
                  renderValue={renderValue}
                />
              </View>
              <View alignItems="center">
                <Row alignItems="center">
                  <PerformanceIcon />
                  <Text
                    variant="caption1"
                    fontFamily={fonts.montserratSemiBold}
                    paddingLeft={4}
                  >
                    PERFORMANCE
                  </Text>
                </Row>

                <RotarySelector
                  value={props.performance}
                  startValue={0}
                  endValue={10}
                  minValue={0}
                  maxValue={10}
                  onChange={props.onPerformanceChange}
                  renderValue={renderValue}
                />
              </View>
            </Row>
          </View>
        </View>
        <PrimaryButton label="FINISH WORKOUT" onPress={props.moveNext} />
        <SecondaryButton
          label="CANCEL"
          onPress={props.movePrev}
          marginTop={20}
          labelProps={{ color: colors.white50 }}
        />
      </View>
    </View>
  )
}

const withInitAndWorkout = compose(
  withWorkoutModel(),
  withWorkoutControls(),
  withLoader({
    color: colors.white,
    backgroundColor: colors.blue8,
    message: "Loading workout...",
    loaderProp: "modelLoading"
  })
)

const withWorkout = compose(withWorkoutControls())

const enhanced = compose(
  withMappedNavigationParams(),
  withNavigation,
  withWorkoutSessionSave,
  withWorkoutSessionDelete,
  branch(props => props.submit, withInitAndWorkout, withWorkout),
  withState("savingSession", "setSavingSession", false),
  withLoader({
    color: colors.white,
    backgroundColor: colors.blue8,
    message: "Saving workout...",
    loaderProp: "savingSession"
  }),
  withProps(props => {
    return {
      difficulty: props.metaValue("difficulty") || 0,
      performance: props.metaValue("performance") || 0,
      notes: props.metaValue("notes") || ""
    }
  }),
  withHandlers({
    movePrev: ({ navigation }) => () => {
      navigation.goBack()
    },
    moveNext: ({ navigation, model, workoutTemplate }) => () => {
      navigation.navigate("TrainingSummaryScene", { model, workoutTemplate })
    },
    onNotesChange: props => value => {
      props.setMetaValue("notes", value)
    },
    onDifficultyChange: props => value => {
      props.setMetaValue("difficulty", value)
    },
    onPerformanceChange: props => value => {
      props.setMetaValue("performance", value)
    },
    onUpdateDate: props => newDate => {
      const { updateTraining, saveWorkoutSession, deleteWorkoutSession } = props
      if (!moment(newDate).isSame(props.workoutSessionDate, "day")) {
        const newWorkoutSessionId = genUuid()
        const payload = {
          workoutSessionId: newWorkoutSessionId,
          workoutTemplateId: props.workoutTemplateId,
          date: newDate,
          model: props.model,
          meta: props.modelMeta
        }

        const save = onFailed => {
          props.setSavingSession(true)
          saveWorkoutSession(payload)
            .then(result => {
              deleteWorkoutSession(props.workoutSessionId, props.workoutSessionDate)
              updateTraining({ workoutSessionId: newWorkoutSessionId, date: newDate })
              props.setSavingSession(false)
            })
            .catch(e => {
              props.setSavingSession(false)
              logErrorWithMemberId(memberId => {
                Sentry.captureException(
                  new Error(
                    `MId:{${memberId}}, Scope:{TrainingRateScene.saveWorkoutSession}, ${_.toString(
                      e
                    )}`
                  )
                )
              })
              onFailed()
            })
        }

        const onFailed = () => {
          confirm(
            () => {
              save(onFailed)
            },
            "An error occurred while saving the session",
            "Try Again?",
            "Retry",
            "Cancel"
          )
        }

        save(onFailed)
      }
    }
  }),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return this.props.modelTimestamp !== nextProps.modelTimestamp
    }
  })
)

export default enhanced(TrainingRateScene)
