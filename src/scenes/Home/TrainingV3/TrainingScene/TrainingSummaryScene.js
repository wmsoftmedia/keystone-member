import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet } from "react-native"
import { View } from "glamorous-native"
import { withHandlers, withProps, lifecycle, compose } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"

import { DurationIcon } from "kui/icons"
import { PrimaryButton } from "kui/components/Button"
import { Row } from "kui/components"
import { cardTopStyle } from "styles"
import { difficultyVariant } from "scenes/Home/TrainingV3/common"
import { getOr, formatNum, formatFloat } from "keystone"
import { targetValue } from "scenes/Home/TrainingV3/utils"
import { withSettings } from "hoc"
import Label from "kui/components/Label"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors, { gradients } from "kui/colors"
import withWorkoutControls from "scenes/Home/TrainingV3/components/WorkoutControls"

const TrainingSummaryScene = props => {
  const { total, difficulty, performance } = props
  const wtDuration = getOr(0, "workoutTemplate.duration", props)
  const duration = wtDuration
    ? wtDuration > 3600
      ? moment.utc(wtDuration * 1000).format("H:mm:ss [min]")
      : moment.utc(wtDuration * 1000).format("mm:ss [min]")
    : "--"

  const wtDifficulty = getOr("", "workoutTemplate.difficulty", props)
  const _difficulty = difficultyVariant[wtDifficulty] || difficultyVariant["Easy"]

  const wtName = getOr("", "workoutTemplate.name", props)

  return (
    <View flex={1} {...cardTopStyle} backgroundColor={gradients.card[0]}>
      <LinearGradient
        colors={gradients.card}
        style={{ ...StyleSheet.absoluteFill, top: 20 }}
      />
      <View flex={1} padding={20}>
        <View flex={1}>
          <View marginTop={8} alignItems="center">
            <Text variant="h1">Great job!</Text>
          </View>

          <Row marginTop={36} alignItems="center" justifyContent="space-between">
            <Text variant="body2">{wtName}</Text>
            <Label variant={_difficulty.variant} text={_difficulty.name} />
          </Row>

          <Row marginTop={12} justifyContent="space-between" alignItems="center">
            <Row alignItems="center">
              <DurationIcon />
              <Text variant="body1" paddingLeft={8}>
                Duration
              </Text>
            </Row>
            <Row alignItems="center">
              <Text variant="body2">{duration}</Text>
            </Row>
          </Row>

          {(total.volume > 0 || total.distance > 0 || total.calories > 0) && (
            <Line
              marginTop={20}
              marginBottom={4}
              marginHorizontal={0}
              color={colors.darkBlue80}
            />
          )}

          {total.volume > 0 && (
            <Row marginTop={16} alignItems="center" justifyContent="space-between">
              <Text variant="body1">Total tonnage lifted</Text>
              <Text variant="body2">
                {formatNum(props.weightConverter(total.volume))} {props.weightUnit}
              </Text>
            </Row>
          )}

          {total.distance > 0 && (
            <Row marginTop={16} alignItems="center" justifyContent="space-between">
              <Text variant="body1">Distance</Text>
              <Text variant="body2">
                {total.distance >= 1000
                  ? formatFloat(total.distance / 1000)
                  : formatNum(total.distance)}
                {total.distance >= 1000 ? " km" : " m"}
              </Text>
            </Row>
          )}

          {total.calories > 0 && (
            <Row marginTop={16} alignItems="center" justifyContent="space-between">
              <Text variant="body1">Calories burned</Text>
              <Text variant="body2">{formatNum(total.calories)} cal</Text>
            </Row>
          )}

          <Line marginTop={20} marginHorizontal={0} color={colors.darkBlue80} />

          <Row marginTop={20} alignItems="center">
            <View flex={1}>
              <Text variant="body2">{performance}/10</Text>
              <Text marginTop={4} variant="caption2" color={colors.darkBlue30}>
                PERFORMANCE
              </Text>
            </View>
            <View flex={1}>
              <Text variant="body2">{difficulty}/10</Text>
              <Text marginTop={4} variant="caption2" color={colors.darkBlue30}>
                DIFFICULTY
              </Text>
            </View>
          </Row>
        </View>
        <PrimaryButton label="GO TO THE DASHBOARD" onPress={props.onFinish} />
      </View>
    </View>
  )
}

const enhanced = compose(
  withNavigation,
  withWorkoutControls(),
  withSettings,
  withProps(props => {
    const workoutInfo = props.workout()
    const iterations = props.iterations()

    const attempts = props.sets(iterations.length > 0 && iterations[0].id).map(s =>
      props.rounds(s.id).map((r, roundIndex) =>
        props.exercises(r.id).map(e => {
          const rounds = props.edgeMetaValue("rounds", r.id, e.id) || []
          /*if (!getOr(false, `[${roundIndex}].done`, rounds)) {
              return {}
            }*/

          const actualEffort = getOr(undefined, `[${roundIndex}].effort`, rounds)

          const reqDistance = targetValue(e, "Distance", roundIndex)
          if (reqDistance) {
            return {
              distance: actualEffort ? actualEffort : reqDistance.value
            }
          }

          const reqCalories = targetValue(e, "Calories", roundIndex)
          if (reqCalories) {
            return {
              calories: actualEffort ? actualEffort : reqCalories.value
            }
          }

          const reqReps = targetValue(e, "Repetitions", roundIndex)
          const reqLoad = targetValue(e, "Load", roundIndex)
          const actualLoad = getOr(undefined, `${roundIndex}.load`, rounds)
          if (
            reqReps &&
            (reqLoad || actualLoad) &&
            (actualLoad !== undefined || reqLoad.unit === "kg")
          ) {
            const effort = actualEffort !== undefined ? actualEffort : reqReps.value || 0
            const load = actualLoad != undefined ? actualLoad : reqLoad.value || 0
            return {
              volume: effort * load
            }
          }
          return {}
        })
      )
    )
    const total = _.flattenDeep(attempts).reduce(
      (acc, at) => ({
        volume: acc.volume + (at.volume || 0),
        distance: acc.distance + (at.distance || 0),
        calories: acc.calories + (at.calories || 0)
      }),
      {
        volume: 0,
        distance: 0,
        calories: 0
      }
    )

    return {
      difficulty: props.metaValue("difficulty") || 0,
      performance: props.metaValue("performance") || 0,
      timer: props.modelTimer(workoutInfo.id),
      total
    }
  }),
  withHandlers({
    movePrev: props => () => {
      props.navigation.goBack()
    },
    onFinish: ({ navigation }) => () => {
      navigation.popToTop()
    }
  }),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return this.props.modelTimestamp !== nextProps.modelTimestamp
    }
  })
)

export default enhanced(TrainingSummaryScene)
