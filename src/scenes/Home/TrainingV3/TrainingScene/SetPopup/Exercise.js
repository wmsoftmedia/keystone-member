import { View } from "glamorous-native"
import React from "react"

import { targetValue, formatUnit } from "scenes/Home/TrainingV3/utils"
import Duration from "scenes/Home/TrainingV3/TrainingScene/SetPopup/Duration"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const Exercise = ({ screen, converter }) => {
  const { item, roundIndex, exercisesLeft } = screen
  const meta =
    _.getOr([], "edgeMeta.rounds", item).find(r => r.index === roundIndex) || {}

  const es =
    targetValue(item, "Calories", roundIndex) ||
    targetValue(item, "Repetitions", roundIndex) ||
    targetValue(item, "Distance", roundIndex) ||
    targetValue(item, "Duration", roundIndex)

  const ls = targetValue(item, "Load", roundIndex, converter)

  const effortUnit = formatUnit(es && es.unit) || ""
  const effortValue =
    meta.effort !== undefined ? meta.effort : (es && es.printValue) || ""

  const loadUnit = meta.load !== undefined ? "kg" : formatUnit(ls && ls.unit) || ""
  const loadValue =
    meta.load !== undefined
      ? converter.weightConverter(meta.load)
      : (ls && ls.printValue) || ""

  const exercisesLeftMsg =
    exercisesLeft > 0
      ? exercisesLeft +
        " exercise" +
        (exercisesLeft > 1 ? "s" : "") +
        " left in this round"
      : ""

  const duration = targetValue(item, "Duration", roundIndex)
  const durationValue = duration ? meta.effort || duration.value : 0

  return (
    <View flex={1}>
      <View flex={1} paddingHorizontal={20}>
        <Text variant="h1" marginTop={60} textAlign="center">
          {_.trim(item.name)}
        </Text>
        {durationValue ? (
          <View>
            <Duration time={0} totalTime={durationValue} marginTop={20} />
            <Text variant="body1" marginTop={20} textAlign="center">
              {effortValue + " " + effortUnit}
            </Text>
          </View>
        ) : (
          <Text variant="h0" marginTop={20} textAlign="center">
            {effortValue + " " + effortUnit}
          </Text>
        )}
        <Text variant="body1" marginTop={20} textAlign="center">
          {loadValue +
            (loadUnit[0] === "%" ? "" : " ") +
            (loadUnit === "kg" ? converter.weightUnit : loadUnit)}
        </Text>
      </View>
      <Text variant="body1" color={colors.blue20} textAlign="center" marginVertical={8}>
        {exercisesLeftMsg}
      </Text>
    </View>
  )
}

export default Exercise
