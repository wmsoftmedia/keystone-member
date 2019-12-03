import { View, TouchableOpacity } from "glamorous-native"
import { compose, withProps, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"

import { LinkIcon, RestIcon } from "kui/icons"
import { Row } from "kui/components"
import { targetValue, formatUnit } from "scenes/Home/TrainingV3/utils"
import Card from "kui/components/Card"
import Checkbox from "kui/components/Checkbox"
import List from "components/List"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const RestView = ({ totalTime }) => (
  <Card marginBottom={16} color={colors.green50} elevated={false}>
    <Row centerY>
      <Row padding={16} centerY>
        <RestIcon />
        <Text variant="body2" flex={1} paddingHorizontal={8}>
          REST
        </Text>
        <Text variant="body1" paddingHorizontal={8}>
          {totalTime < 3600
            ? moment.utc(totalTime * 1000).format("m:ss")
            : moment.utc(totalTime * 1000).format("HH:mm:ss")}
        </Text>
      </Row>
    </Row>
  </Card>
)

const ExerciseItem = props => {
  const { item, roundIndex, canEditExercise, converter } = props
  const { isLastExercise = false } = props

  const isCluster = !!targetValue(item, "Cluster", roundIndex)

  const roundMeta = _.getOr([], "edgeMeta.rounds", item).find(m => m.index === roundIndex)
  const done = roundMeta && roundMeta.done

  const meta =
    _.getOr([], "edgeMeta.rounds", item).find(r => r.index === roundIndex) || {}

  const exerciseTimeout = _.getOr(0, "timeout.value", item)

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

  return (
    <React.Fragment>
      <TouchableOpacity
        marginBottom={16}
        activeOpacity={canEditExercise ? 0.5 : 1}
        onPress={() =>
          canEditExercise && props.onExerciseClick(item.id, props.exerciseIndex)
        }
      >
        <Card color="rgba(0, 72, 139, 0.4)" padding={16} elevated={false}>
          <Row centerY>
            <Checkbox
              checked={done}
              padding={16}
              paddingRight={8}
              marginLeft={-16}
              marginVertical={-16}
              onChange={props.onDoneChange}
            />
            <Row centerY flex={1}>
              <View flex={1}>
                <Text variant="caption1">{_.trim(item.name)}</Text>
              </View>
              <View width={65} paddingHorizontal={4} alignItems="flex-end">
                <Text variant="caption1">{effortValue + " " + effortUnit}</Text>
              </View>
              <View width={65} alignItems="flex-end">
                <Text variant="caption1">
                  {loadValue +
                    (loadUnit[0] === "%" ? "" : " ") +
                    (loadUnit === "kg" ? converter.weightUnit : loadUnit)}
                </Text>
              </View>
            </Row>
          </Row>
        </Card>
      </TouchableOpacity>
      {exerciseTimeout > 0 && !isLastExercise && <RestView totalTime={exerciseTimeout} />}
      {isCluster && !isLastExercise && (
        <View position="absolute" bottom={2} alignSelf="center">
          <View transform={[{ rotateZ: "45deg" }]}>
            <LinkIcon size={12} color={colors.white50} />
          </View>
        </View>
      )}
    </React.Fragment>
  )
}

const ExercisesList = ({
  items,
  round,
  roundIndex,
  set,
  converter,
  canEditExercise,
  onDoneChange,
  onExerciseClick
}) => (
  <View flex={1}>
    <List
      marginHorizontal={-16}
      paddingHorizontal={16}
      data={items}
      keyExtractor={(item, i) => i + "-" + item.id}
      renderItem={({ item, index }) => {
        if (item.type === "row") {
          return (
            <ExerciseItem
              roundIndex={roundIndex}
              exerciseIndex={index}
              setId={set.id}
              item={item.item}
              converter={converter}
              canEditExercise={canEditExercise}
              onExerciseClick={onExerciseClick}
              isLastExercise={index === items.length - 1}
              onDoneChange={onDoneChange(
                round.id,
                roundIndex,
                item.item && item.item.id,
                index
              )}
            />
          )
        } else if (item.type === "timeout") {
          return <RestView totalTime={item.totalTime} />
        }
      }}
      ItemSeparatorComponent={null}
      ListEmptyComponent={null}
    />
  </View>
)

const enhanced = compose(
  withNavigation,
  withProps(props => {
    const { exercises, round } = props

    const roundTimeout = _.getOr(0, "timeout.value", round)

    const rest = props.setTimeout
      ? { type: "timeout", totalTime: props.setTimeout }
      : roundTimeout
      ? { type: "timeout", totalTime: roundTimeout }
      : null

    const items = [
      ...exercises.map((e, index) => ({ type: "row", item: e, index })),
      ...(rest ? [rest] : [])
    ]

    return { items }
  }),
  withHandlers({
    onExerciseClick: props => (exerciseId, exerciseIndex) => {
      props.navigation.navigate("ExercisePopup", {
        setId: _.getOr("", "set.id", props),
        roundIndex: _.getOr(0, "roundIndex", props),
        exerciseId: exerciseId,
        exerciseIndex: exerciseIndex,
        colRounds: _.getOr(0, "colRounds", props)
      })
    }
  })
)

export default enhanced(ExercisesList)
