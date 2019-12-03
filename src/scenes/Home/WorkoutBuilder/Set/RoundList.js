import React, { useState } from "react"
import { View, TouchableOpacity } from "glamorous-native"
import { compose, withHandlers, withProps, lifecycle, withState } from "recompose"
import { withNavigation } from "react-navigation"
import { Dimensions, Animated } from "react-native"
import moment from "moment"
import _ from "lodash/fp"
import { confirm } from "native"

import { withSettings } from "hoc"
import DraggableFlatList from "components/DraggableFlatList"
import withControls from "scenes/Home/WorkoutBuilder/components/WorkoutBuilderControls"
import { setTypes } from "scenes/Home/WorkoutBuilder/common"
import { Show } from "kui/components/Animation"
import Text from "kui/components/Text"
import Card from "kui/components/Card"
import { DragglyIcon, DeleteIcon, CloneIcon, AddIcon, RestIcon } from "kui/icons"
import { DurationIcon, SearchIcon } from "kui/icons"
import { Row } from "kui/components"
import { genUuid } from "keystone"
import Line from "kui/components/Line"
import { PrimaryButton, IconButton, SecondaryButton } from "kui/components/Button"
import { setIcon } from "scenes/Home/TrainingV3/common"
import { formatUnit } from "scenes/Home/TrainingV3/utils"
import colors, { gradients } from "kui/colors"

const windowWidth = Dimensions.get("window").width

const ListItem = props => {
  const { item, index, isActive, animatedValue, roundCnt, converter } = props
  const data = item.data || {}

  const [height, setHeight] = useState(0)

  const timeout = _.getOr(0, "data.value", item)
  const formatedTimeout =
    timeout < 60
      ? moment.utc(timeout * 1000).format("s [sec]")
      : timeout < 3600
      ? moment.utc(timeout * 1000).format("m:ss")
      : moment.utc(timeout * 1000).format("HH:mm:ss")

  const effortValue = _.getOr("", "data.effortValue", item)
  const effortUnit = formatUnit(_.getOr("", "data.effortUnit", item))

  const _lu = _.getOr("", "data.loadUnit", item)
  const _lv = _.getOr("", "data.loadValue", item)
  const loadUnit = _lu === "kg" ? converter.weightUnit : formatUnit(_lu)
  const loadValue = _lu === "kg" ? converter.weightConverter(_lv) : _lv

  return item.type === "round" ? (
    <View>
      {index > 0 && (
        <View>
          <SecondaryButton onPress={props.onExercicseAdd}>
            <Row centerXY>
              <AddIcon size={24} />
              <Text variant="button1" marginLeft={4}>
                ADD EXERCISE
              </Text>
            </Row>
          </SecondaryButton>
        </View>
      )}
      <View marginTop={8} marginHorizontal={20}>
        <Row centerY>
          <Text variant="body2" flex={1}>
            {item.index + 1}/{roundCnt}
          </Text>
          {/* Disbale search/add via ExerciseDirecory  */}
          {/* <IconButton onPress={() => props.onExercisesSearch(data)}>
            <SearchIcon />
          </IconButton> */}
          <IconButton onPress={() => props.onRoundClone(data)}>
            <CloneIcon />
          </IconButton>
          <IconButton onPress={() => props.onRoundDel(data)}>
            <DeleteIcon />
          </IconButton>
        </Row>
      </View>
    </View>
  ) : item.type === "rest" ? (
    <Animated.View
      onLayout={event => setHeight(_.getOr(0, "nativeEvent.layout.height", event))}
      paddingVertical={6}
      paddingHorizontal={20}
      style={[
        animatedValue && height
          ? {
              height: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, height]
              })
            }
          : {}
      ]}
    >
      <TouchableOpacity
        opacity={isActive ? 0.7 : 1}
        onPress={() => props.onRestEdit(data)}
        onLongPress={props.move}
        onPressOut={props.moveEnd}
      >
        <Card
          color={colors.transparent}
          padding={14}
          borderWidth={1}
          borderColor={colors.green50}
        >
          <Row centerY>
            <RestIcon />
            <Text variant="body2" paddingLeft={8} flex={1}>
              REST
            </Text>
            <Text variant="body1">{formatedTimeout}</Text>
          </Row>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    <Animated.View
      onLayout={event => setHeight(_.getOr(0, "nativeEvent.layout.height", event))}
      paddingVertical={6}
      paddingHorizontal={20}
      style={[
        animatedValue && height
          ? {
              height: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, height]
              })
            }
          : {}
      ]}
    >
      <TouchableOpacity
        flex={1}
        activeOpacity={0.7}
        opacity={isActive ? 0.7 : 1}
        onPress={() => props.onExercicseEdit(data)}
        onLongPress={props.move}
        onPressOut={props.moveEnd}
      >
        <Card color={colors.darkBlue90} padding={16}>
          <Row centerY>
            <Row centerY flex={1}>
              <DragglyIcon />
              <Text variant="caption1" flex={1} paddingLeft={8}>
                {data.name}
              </Text>
            </Row>
            <View width={70} paddingLeft={8} alignItems="flex-end">
              <Text variant="caption1" numberOfLines={1}>
                {effortValue && effortUnit ? effortValue + " " + effortUnit : "--"}
              </Text>
            </View>
            <View width={70} paddingLeft={8} alignItems="flex-end">
              <Text variant="caption1" numberOfLines={1}>
                {loadValue && loadUnit
                  ? loadValue + (loadUnit[0] === "%" ? "" : " ") + loadUnit
                  : "--"}
              </Text>
            </View>
          </Row>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  )
}

const ListFooter = ({ onRoundAdd, onRestAdd, onExercicseAdd, emptyList }) => {
  return (
    <View paddingHorizontal={20}>
      {!emptyList && (
        <View>
          <SecondaryButton onPress={onExercicseAdd}>
            <Row centerXY>
              <AddIcon size={24} />
              <Text variant="button1" marginLeft={4}>
                ADD EXERCISE
              </Text>
            </Row>
          </SecondaryButton>
        </View>
      )}
      <Row marginTop={20}>
        <PrimaryButton
          flex={1}
          onPress={onRoundAdd}
          minWidth={0}
          marginRight={!emptyList ? 8 : 0}
          backgroundColor={colors.darkBlue90}
        >
          <Row centerXY>
            <AddIcon size={24} color={colors.blue50} />
            <Text variant="button1" marginLeft={4}>
              ADD ROUND
            </Text>
          </Row>
        </PrimaryButton>
        {!emptyList && (
          <PrimaryButton
            flex={1}
            label="ADD REST"
            onPress={onRestAdd}
            minWidth={0}
            marginLeft={8}
            backgroundColor={colors.green50}
          >
            <Row centerXY>
              <AddIcon size={24} />
              <Text variant="button1" marginLeft={4}>
                ADD REST
              </Text>
            </Row>
          </PrimaryButton>
        )}
      </Row>
    </View>
  )
}

const RoundList = props => {
  const { setData, items, roundCnt, onExercicseMove, converter } = props

  const SetIcon = setIcon(setData && setData.type)
  const setType = setTypes.find(t => t.value === (setData && setData.type)) || setTypes[0]

  const roundTimeLimit = Math.ceil(
    +_.getOr(0, "specs.roundTimeLimit.value", setData) / 60
  )

  const timeLimit = +_.getOr(0, "specs.timeLimit.value", setData)

  const formatedTimeLimit =
    timeLimit > 0
      ? timeLimit < 60
        ? moment.utc(timeLimit * 1000).format("s [sec]")
        : timeLimit < 3600
        ? moment.utc(timeLimit * 1000).format("m:ss")
        : moment.utc(timeLimit * 1000).format("HH:mm:ss")
      : "--"

  const rowProp = (id, prop) => _.getOr(null, `rowProps.${id}.${prop}`, props)

  return (
    <View flex={1}>
      <Row centerY marginHorizontal={20}>
        <SetIcon />
        <View paddingLeft={8} flex={1}>
          <Text variant="body2">{setType.label}</Text>
          <Text variant="caption2">
            {setType.name + (roundTimeLimit > 1 ? roundTimeLimit : "")}
          </Text>
        </View>
        <PrimaryButton onPress={props.onSpecsEdit} minWidth={64} label="EDIT" />
      </Row>
      <Row centerY marginHorizontal={20} marginTop={14}>
        <DurationIcon />
        <Text marginLeft={4} flex={1} variant="body1">
          Duration
        </Text>
        <Text marginLeft={4} variant="body2">
          {formatedTimeLimit}
        </Text>
      </Row>
      <Line marginTop={20} />

      <View flex={1} paddingTop={10}>
        <DraggableFlatList
          data={items}
          keyExtractor={item => item.data.id}
          scrollPercent={5}
          disableRightSwipe={true}
          onMoveEnd={({ data, from, to }) => to > 0 && onExercicseMove(data, from, to)}
          renderItem={itemProps => (
            <ListItem
              {...itemProps}
              converter={converter}
              roundCnt={roundCnt}
              onRestEdit={props.onRestEdit}
              onExercicseEdit={props.onExercicseEdit}
              onExercisesSearch={props.onExercisesSearch}
              onRoundClone={props.onRoundClone}
              onRoundDel={props.onRoundDel}
              onExercicseAdd={props.onExercicseAdd(
                props.prevRoundId(_.getOr(null, "item.data.id", itemProps))
              )}
              animatedValue={rowProp(itemProps.item.data.id, "animatedValue")}
            />
          )}
          renderHiddenItem={(data, _) =>
            data.item.type !== "round" && (
              <Row
                height={"100%"}
                justifyContent="flex-end"
                alignItems="center"
                paddingRight={20}
              >
                <Show
                  duration={200}
                  visible={rowProp(data.item.data.id, "deleteVisible")}
                >
                  <DeleteIcon color={colors.red50} />
                </Show>
              </Row>
            )
          }
          ListFooterComponent={
            <ListFooter
              emptyList={items.length === 0}
              onRoundAdd={props.onRoundAdd}
              onRestAdd={props.onRestAdd}
              onExercicseAdd={props.onExercicseAdd(props.lastRoundId())}
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          rightOpenValue={-windowWidth}
          onSwipeValueChange={props.onSwipeValueChange}
        />
      </View>
      <View
        paddingHorizontal={20}
        paddingBottom={20}
        paddingTop={10}
        backgroundColor={gradients.bg[1]}
        elevation={15}
        shadowOpacity={0.4}
        shadowColor={colors.black}
        shadowOffset={{ width: 0, height: 0 }}
        shadowRadius={20}
      >
        <PrimaryButton label="SAVE SET" onPress={props.onSave} />
      </View>
    </View>
  )
}

const genRowProps = (items, value = 1) =>
  items.reduce(
    (acc, r) => ({
      ...acc,
      [r.data.id]: { deleteVisible: false, animatedValue: new Animated.Value(value) }
    }),
    {}
  )

const enhanced = compose(
  withControls(),
  withNavigation,
  withSettings,
  withState("animationIsRunning", "setAnimationIsRunning", false),
  withState("rowProps", "setRowProps", {}),
  withHandlers({
    buildSequence: ({ rounds, exercises, setId }) => () => {
      return rounds(setId).reduce((acc, r, i) => {
        const _exercises = exercises(r.id)
        return [
          ...acc,
          {
            type: "round",
            index: i,
            data: { ...r },
            hasExercises: _exercises.length > 0,
            disableLeftSwipe: true,
            disableRightSwipe: true
          },
          ..._exercises.map(e => ({ type: e.type, data: e }))
        ]
      }, [])
    },
    customExercises: ({ allCustomExercises }) => () =>
      allCustomExercises().map(e => ({
        id: e.exerciseId,
        name: e.name
      })),
    prevRoundId: ({ rounds, setId }) => id => {
      const _rounds = rounds(setId)
      const index = _rounds.findIndex(r => r.id === id)
      return index > 0 ? _rounds[index - 1].id : null
    },
    lastRoundId: ({ rounds, setId }) => () => {
      const _rounds = rounds(setId)
      return _rounds.length > 0 ? _rounds[_rounds.length - 1].id : null
    }
  }),
  withProps(({ buildSequence, rounds, setId, set, weightUnit, weightConverter }) => {
    const _set = set(setId)
    return {
      setData: _set,
      items: buildSequence(),
      roundCnt: rounds(setId).length,
      converter: { weightUnit, weightConverter }
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (!_.isEqual(prevProps.items, this.props.items)) {
        this.props.setRowProps(genRowProps(this.props.items))
      }
    },
    componentDidMount() {
      this.props.setRowProps(genRowProps(this.props.items))
    }
  }),
  withHandlers({
    onSpecsEdit: props => () => {
      const { navigation, set, setId, updSet } = props
      navigation.navigate("SpecsForm", {
        set: set(setId),
        onSave: data => {
          updSet(setId, data)
        }
      })
    },
    onRoundAdd: props => () => {
      const { addRound, setId } = props
      addRound({ parentId: setId })
    },
    onRoundDel: ({ delRound }) => round =>
      round &&
      confirm(
        () => delRound(round.id),
        "This round and its exercise will be permanently deleted.",
        "Delete Round?",
        "Delete",
        "Cancel"
      ),
    onRoundClone: ({ cloneRound }) => round => round && cloneRound(round.id),
    onExercicseAdd: ({ navigation, setId, rounds, addExercise }) => roundId => () => {
      const round = rounds(setId).find(r => r.id === roundId)
      round &&
        navigation.navigate("ExerciseForm", {
          createExercise: true,
          onSave: form => {
            addExercise({
              parentId: round.id,
              is_custom: true,
              exerciseId: genUuid(),
              ...form
            })
          }
        })
    },
    onExercisesSearch: ({ navigation, addExercises, customExercises }) => round => {
      const roundId = round && round.id
      const customExs = customExercises()
      roundId &&
        navigation.navigate("ExercisesSelector", {
          customExercises: customExs,
          onExercisesSelect: items => {
            const itemsToAdd = items.map(e => ({
              type: "exercise",
              parentId: roundId,
              exerciseId: e.id,
              name: e.name,
              is_custom: _.findIndex(c => c.id === e.id, customExs) !== -1
            }))
            addExercises(roundId, itemsToAdd)
          }
        })
    },
    onExercicseEdit: ({ navigation, updExercise }) => exercise => {
      navigation.navigate("ExerciseForm", {
        createExercise: false,
        title: exercise.name,
        exercise,
        onSave: form => {
          updExercise(exercise.id, { ...exercise, ...form })
        }
      })
    },
    onExercicseMove: ({ items, moveExercise, setId }) => (newItems, from, to) => {
      const pos = (items_, p_) =>
        items_.reduce(
          (acc, o, i) => {
            return {
              r: o.type === "round" ? acc.r + 1 : acc.r,
              ri: o.type === "round" ? 0 : acc.ri + 1,
              round: p_ === i ? acc.r : acc.round,
              index: p_ === i ? acc.ri : acc.index
            }
          },
          { index: 0, round: 0, r: -1, ri: 0 }
        )

      const from_ = pos(items, from)
      const to_ = pos(newItems, to)

      moveExercise(setId, from_.round, from_.index, to_.round, to_.index)
    },
    onRestAdd: ({ navigation, setId, rounds, addExercise }) => () => {
      const round = _.last(rounds(setId))
      round &&
        navigation.navigate("TimeSelector", {
          title: "Add rest",
          subtitle: "Specify rest duration",
          onTimeSelect: value => {
            addExercise({
              type: "rest",
              parentId: round.id,
              value
            })
          }
        })
    },
    onRestEdit: ({ navigation, updExercise }) => rest => {
      const restId = rest && rest.id
      restId &&
        navigation.navigate("TimeSelector", {
          title: "Update rest",
          value: rest.value || 0,
          subtitle: "Specify rest duration",
          onTimeSelect: value => {
            updExercise(restId, { value })
          }
        })
    },
    onSwipeValueChange: props => swipeData => {
      const { key, value } = swipeData
      const rowProps = _.getOr(null, `rowProps[${key}]`, props)
      if (rowProps) {
        if (value < -25 && !props.rowProps[key].deleteVisible) {
          props.rowProps[key].deleteVisible = true
          props.setRowProps(props.rowProps)
        }
        if (value >= -25 && props.rowProps[key].deleteVisible) {
          props.rowProps[key].deleteVisible = false
          props.setRowProps(props.rowProps)
        }
        if (value < -windowWidth && !props.animationIsRunning) {
          props.setAnimationIsRunning(true)
          Animated.timing(props.rowProps[key].animatedValue, {
            toValue: 0,
            duration: 200
          }).start(() => {
            props.delExercise(key)
            props.setAnimationIsRunning(false)
          })
        }
      }
    }
  })
)

export default enhanced(RoundList)
