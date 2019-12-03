import { View, TouchableOpacity } from "glamorous-native"
import { compose, withHandlers, withProps, withState, lifecycle } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import { withNavigation } from "react-navigation"
import React from "react"
import _ from "lodash/fp"

import { InputRowText } from "kui/components/Input"
import { ModalScreen } from "components/Background"
import { TextButtonForward, TextButtonBackward, IconButton } from "kui/components/Button"
import { ApplyToOtherIcon, InfoIcon } from "kui/icons"
import { PrimaryButton } from "kui/components/Button"
import { withSettings } from "hoc"
import { Dimensions } from "react-native"
import { Row } from "kui/components"
import { formatUnit, targetValue } from "scenes/Home/TrainingV3/utils"
import { routes } from "navigation/routes"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withWorkoutControls from "scenes/Home/TrainingV3/components/WorkoutControls"

const ExercisePopup = props => {
  const { exercise, effort, load, tempo, footerNavigation, converter } = props
  const { onExerciseHistoryClick, onEffortChange, onLoadChange, onExerciseInfo } = props

  const { width } = Dimensions.get("window")

  const specEffortUnit = formatUnit(effort.spec.unit) || ""
  const specEffortValue = effort.spec.printValue || ""

  const specLoadUnit = formatUnit(load.spec.unit) || ""
  const specLoadValue = load.spec.printValue || ""

  const effortUnit =
    (effort.value ? formatUnit(effort.unit) : formatUnit(effort.spec.unit)) || ""
  const effortValue = effort.value || effort.spec.printValue || ""

  const loadUnit = (load.value ? formatUnit(load.unit) : formatUnit(load.spec.unit)) || ""
  const loadValue = converter.weightConverter(load.value) || load.spec.printValue || ""
  const loadPrefix = !!effortValue ? " @ " : ""

  return (
    !!exercise && (
      <ModalScreen paddingTop={20}>
        <View flex={1} paddingHorizontal={20}>
          <TouchableOpacity
            activeOpacity={exercise.is_custom ? 1 : 0.5}
            onPress={() => onExerciseInfo()}
          >
            <Row>
              <Text
                variant="h1"
                numberOfLines={3}
                fontSize={22}
                // fix css bug
                maxWidth={exercise.is_custom ? width : width - 68}
              >
                {_.trim(exercise.name)}
              </Text>
              {!exercise.is_custom && (
                <View paddingVertical={8} paddingLeft={8}>
                  <InfoIcon />
                </View>
              )}
            </Row>
          </TouchableOpacity>
          <Row centerY marginTop={10}>
            <Row flex={1} centerY>
              <Text variant="caption1" color={colors.darkBlue30}>
                {effortValue + " " + effortUnit}
              </Text>
              {!!loadValue && (
                <Text variant="caption1" color={colors.darkBlue30}>
                  {loadPrefix +
                    loadValue +
                    (loadUnit[0] === "%" ? "" : " ") +
                    (loadUnit === "kg" ? converter.weightUnit : loadUnit)}
                </Text>
              )}
            </Row>
            <TextButtonForward
              margin={-10}
              label="EXERCISE LOG"
              onPress={onExerciseHistoryClick}
            />
          </Row>
          <Line marginTop={12} marginHorizontal={0} color={colors.darkBlue80} />

          <InputRowText
            paddingVertical={4}
            label="Effort"
            labelProps={{ variant: "body2" }}
            renderPrefix={() => (
              <IconButton
                onPress={() =>
                  (props.effortValue || effort.value) &&
                  onEffortChange(props.effortValue || effort.value, true)
                }
              >
                <Row centerY>
                  <Text variant="caption1" color={colors.white50}>
                    Apply Forward
                  </Text>
                  <View paddingTop={4}>
                    <ApplyToOtherIcon />
                  </View>
                </Row>
              </IconButton>
            )}
            renderSuffix={() => (
              <Text variant="caption1" width={30} marginLeft={12}>
                {formatUnit(effort.unit)}
              </Text>
            )}
            inputProps={{
              editable: !load.disabled,
              returnKeyType: "done",
              keyboardType: "numeric",
              clearButtonMode: "never",
              textAlign: "center",
              maxLength: 6,
              placeholder: String(specEffortValue) || "--",
              value: "" + props.effortValue,
              onChange: props.setEffortValue,
              onEndEditing: e => onEffortChange(normalizeValue(e.nativeEvent.text))
            }}
          />
          <Line marginHorizontal={0} color={colors.darkBlue80} />
          <InputRowText
            paddingVertical={4}
            label="Load"
            labelProps={{ variant: "body2" }}
            renderPrefix={() => (
              <IconButton
                onPress={() =>
                  (props.loadValue || load.value) &&
                  onLoadChange(props.loadValue || load.value, true)
                }
              >
                <Row centerY>
                  <Text variant="caption1" color={colors.white50}>
                    Apply Forward
                  </Text>
                  <View paddingTop={4}>
                    <ApplyToOtherIcon />
                  </View>
                </Row>
              </IconButton>
            )}
            renderSuffix={() => (
              <Text variant="caption1" width={30} marginLeft={12}>
                {formatUnit(converter.weightUnit)}
              </Text>
            )}
            inputProps={{
              editable: !load.disabled,
              returnKeyType: "done",
              keyboardType: "numeric",
              clearButtonMode: "never",
              textAlign: "center",
              maxLength: 6,
              placeholder: specLoadUnit === "kg" ? String(specLoadValue) : "--",
              value: "" + props.loadValue,
              onChange: props.setLoadValue,
              onEndEditing: e => onLoadChange(normalizeValue(e.nativeEvent.text))
            }}
          />
          <Line marginHorizontal={0} color={colors.darkBlue80} />
          <Row marginTop={12} spread>
            <View alignItems="center" width={80}>
              <Text variant="caption2" color={colors.darkBlue30}>
                EFFORT
              </Text>
              <Text variant="caption1" marginTop={8}>
                {specEffortValue && specEffortUnit
                  ? specEffortValue + " " + specEffortUnit
                  : "--"}
              </Text>
            </View>
            <View alignItems="center" width={80}>
              <Text variant="caption2" color={colors.darkBlue30}>
                TEMPO
              </Text>
              <Text variant="caption1" marginTop={8}>
                {tempo ? tempo.value + " " + tempo.unit : "--"}
              </Text>
            </View>
            <View alignItems="center" width={80}>
              <Text variant="caption2" color={colors.darkBlue30}>
                LOAD
              </Text>
              <Text variant="caption1" marginTop={8}>
                {specLoadValue && specLoadUnit
                  ? specLoadValue +
                    (specLoadUnit[0] === "%" ? "" : " ") +
                    (specLoadUnit === "kg" ? converter.weightUnit : specLoadUnit)
                  : "--"}
              </Text>
            </View>
          </Row>
        </View>

        <View padding={20}>
          <Row centerY spread marginBottom={40}>
            <View flex={1}>
              {!!footerNavigation.prev && (
                <View alignItems="flex-start">
                  <TextButtonBackward
                    zIndex={10}
                    marginLeft={-15}
                    paddingVertical={20}
                    paddingRight={40}
                    label={"PREV"}
                    onPress={() => props.onMove(footerNavigation.prev)}
                  />
                  <Text
                    variant="caption1"
                    zIndex={0}
                    marginTop={-20}
                    fontSize={10}
                    color={colors.darkBlue30}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {footerNavigation.prev.name || ""}
                  </Text>
                </View>
              )}
            </View>
            <View paddingHorizontal={12} />
            <View flex={1}>
              {!!footerNavigation.next && (
                <View alignItems="flex-end">
                  <TextButtonForward
                    zIndex={10}
                    marginRight={-15}
                    paddingVertical={20}
                    paddingLeft={40}
                    label={"NEXT"}
                    onPress={() => props.onMove(footerNavigation.next)}
                  />
                  <Text
                    zIndex={0}
                    marginTop={-20}
                    variant="caption1"
                    fontSize={10}
                    color={colors.darkBlue30}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {footerNavigation.next.name || ""}
                  </Text>
                </View>
              )}
            </View>
          </Row>
          <PrimaryButton label="SAVE" onPress={props.onSaveClick} />
        </View>
      </ModalScreen>
    )
  )
}

const normalizeValue = value => {
  const maybeNum = Math.abs(+_.replace(/[^\d.-]/g, "", _.replace(/[,.]+/g, ".", value)))
  return maybeNum || ""
}

const enhance = compose(
  withMappedNavigationParams(),
  withSettings,
  withWorkoutControls({
    shouldComponentUpdate: (props, nextProps) => {
      return (
        props.setId !== nextProps.setId ||
        props.roundIndex !== nextProps.roundIndex ||
        props.exerciseIndex !== nextProps.exerciseIndex ||
        props.exerciseId !== nextProps.exerciseId
      )
    }
  }),
  withNavigation,
  withProps(props => {
    const { setId, roundIndex, exerciseIndex, exerciseId, edgeRoundMetaValue } = props
    const rounds = props.rounds(setId)
    const roundId = _.getOr(undefined, `[${roundIndex}].id`, rounds)
    const exercises = props.exercises(roundId)

    const converter = {
      weightConverter: props.weightConverter,
      weightUnit: props.weightUnit
    }

    const exercise =
      _.getOr(null, `[${exerciseIndex}]`, exercises) ||
      _.getOr(null, `[0]`, exercises) ||
      {}

    const exerciseSequence = rounds.reduce((acc, r, ri) => {
      return [
        ...acc,
        ...props.exercises(r.id).map((e, ei) => ({
          roundIndex: ri,
          exerciseIndex: ei,
          exerciseId: e.id,
          name: _.trim(e.name)
        }))
      ]
    }, [])

    const pos = exerciseSequence.findIndex(
      es => es.roundIndex === roundIndex && es.exerciseIndex === exerciseIndex
    )

    const buildLoadSpec = () => {
      const spec = targetValue(exercise, "Load", roundIndex, converter) || {}
      const value = edgeRoundMetaValue(
        "load",
        roundIndex,
        roundId,
        exerciseId,
        exerciseIndex
      )

      return {
        spec,
        unit: "kg",
        value,
        disabled: !spec
      }
    }

    const buildEffortSpec = () => {
      const spec =
        targetValue(exercise, "Calories", roundIndex) ||
        targetValue(exercise, "Repetitions", roundIndex) ||
        targetValue(exercise, "Distance", roundIndex) ||
        targetValue(exercise, "Duration", roundIndex) ||
        {}

      const value = edgeRoundMetaValue(
        "effort",
        roundIndex,
        roundId,
        exerciseId,
        exerciseIndex
      )

      return {
        spec,
        unit: spec.unit || "",
        value,
        disabled: !spec
      }
    }

    const tempoSpec = targetValue(exercise, "Tempo", roundIndex)

    return {
      roundId,
      effort: buildEffortSpec(),
      load: buildLoadSpec(),
      exercise: exercise || {},
      tempo: tempoSpec,
      converter,
      footerNavigation: {
        next: _.getOr(null, `[${pos + 1}]`, exerciseSequence),
        prev: _.getOr(null, `[${pos - 1}]`, exerciseSequence)
      }
    }
  }),
  withState("effortValue", "setEffortValue", ({ effort }) => effort.value || ""),
  withState(
    "loadValue",
    "setLoadValue",
    ({ load, converter }) => converter.weightConverter(load.value) || ""
  ),
  withHandlers({
    onExerciseInfo: ({ navigation, exercise }) => () => {
      !exercise.is_custom &&
        navigation.navigate("ExerciseInfo", {
          // DEBUG. Example exerciseId from production
          //exerciseId: "9d4ceae2-0a27-11e8-ad35-cb986d698daa"
          exerciseId: exercise.id
        })
    },
    onSaveClick: ({ navigation }) => () => {
      navigation.goBack(null)
    },
    onEffortChange: props => (value, forceForward = false) => {
      const { roundIndex, exerciseIndex, exerciseId, roundId } = props
      const { edgeMetaValue, setEdgeMeta, setId } = props

      const newValue = Math.min(+value, props.effortMaxValue || Infinity)
      const newMetaValue = !newValue ? undefined : newValue

      if (_.getOr("", "effort.spec.unit", props) === "reps" || forceForward) {
        const rounds = props.rounds(setId)
        const roundsIdx = _.range(0, rounds.length - roundIndex).map(i => roundIndex + i)

        const newRoundsMeta = roundsIdx.reduce((acc, val) => {
          const round = rounds[val]
          if (!round) return acc
          if (!acc[round.id]) {
            acc[round.id] =
              edgeMetaValue("rounds", round.id, exerciseId, exerciseIndex) || []
          }

          const _index = acc[round.id].findIndex(o => o.index === val)
          if (_index !== -1) {
            if (
              !acc[round.id][_index].effort ||
              forceForward ||
              acc[round.id][_index].index === roundIndex
            ) {
              acc[round.id][_index].effort = newMetaValue
              return acc
            } else {
              return acc
            }
          } else {
            return {
              ...acc,
              [round.id]: [...acc[round.id], { index: val, effort: newMetaValue }]
            }
          }
        }, {})

        _.keys(newRoundsMeta).forEach(rId => {
          setEdgeMeta("rounds", newRoundsMeta[rId], rId, exerciseId, exerciseIndex)
        })
      } else {
        props.setEdgeRoundMeta(
          "effort",
          newMetaValue,
          roundIndex,
          roundId,
          exerciseId,
          exerciseIndex
        )
      }

      props.setEffortValue(newMetaValue || "")
    },
    onLoadChange: props => (value, forceForward = false) => {
      const { roundIndex, exerciseIndex, exerciseId } = props
      const { edgeMetaValue, setEdgeMeta, setId, reverseWeightConverter } = props

      const newValue = Math.min(+value, props.loadMaxValue || Infinity)
      const newMetaValue = !newValue ? undefined : newValue

      const rounds = props.rounds(setId)
      const roundsIdx = _.range(0, rounds.length - roundIndex).map(i => roundIndex + i)

      const newRoundsMeta = roundsIdx.reduce((acc, val) => {
        const round = rounds[val]
        if (!round) return acc
        if (!acc[round.id]) {
          acc[round.id] =
            edgeMetaValue("rounds", round.id, exerciseId, exerciseIndex) || []
        }

        const _index = acc[round.id].findIndex(o => o.index === val)
        if (_index !== -1) {
          if (
            !acc[round.id][_index].load ||
            forceForward ||
            acc[round.id][_index].index === roundIndex
          ) {
            acc[round.id][_index].load = newMetaValue
              ? reverseWeightConverter(newMetaValue)
              : newMetaValue
            return acc
          } else {
            return acc
          }
        } else {
          return {
            ...acc,
            [round.id]: [
              ...acc[round.id],
              {
                index: val,
                load: newMetaValue ? reverseWeightConverter(newMetaValue) : newMetaValue
              }
            ]
          }
        }
      }, {})

      _.keys(newRoundsMeta).forEach(rId => {
        setEdgeMeta("rounds", newRoundsMeta[rId], rId, exerciseId, exerciseIndex)
      })

      props.setLoadValue(newMetaValue || "")
    },
    onExerciseHistoryClick: ({ navigation, exercise }) => () =>
      navigation.navigate(routes.ExerciseLookup, { term: exercise.name })
  }),
  withHandlers({
    onMove: props => page => {
      const { setId, load, loadValue, effort, effortValue, navigation } = props
      if (loadValue && loadValue !== load.value) {
        props.onLoadChange(normalizeValue(loadValue))
      }
      if (effortValue && effortValue !== effort.value) {
        props.onEffortChange(normalizeValue(effortValue))
      }
      navigation.setParams({
        setId: setId,
        roundIndex: page.roundIndex,
        exerciseId: page.exerciseId,
        exerciseIndex: page.exerciseIndex
      })
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (
        this.props.setId !== prevProps.setId ||
        this.props.roundIndex !== prevProps.roundIndex ||
        this.props.exerciseIndex !== prevProps.exerciseIndex ||
        this.props.exerciseId !== prevProps.exerciseId
      ) {
        this.props.setEffortValue(this.props.effort.value || "")
        this.props.setLoadValue(this.props.load.value || "")
      }
    }
  })
)

export default enhance(ExercisePopup)
