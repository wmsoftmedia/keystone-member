import React from "react"
import { View, TouchableOpacity } from "glamorous-native"
import { withNavigation } from "react-navigation"
import DraggableFlatList from "react-native-draggable-flatlist"
import { compose, withHandlers, withProps } from "recompose"
import moment from "moment"
import { confirm } from "native"
import _ from "lodash/fp"

import withControls from "scenes/Home/WorkoutBuilder/components/WorkoutBuilderControls"
import { specsString, defaultSpecs } from "scenes/Home/WorkoutBuilder/common"
import { Row } from "kui/components"
import Card from "kui/components/Card"
import Text from "kui/components/Text"
import Label from "kui/components/Label"
import { AddIcon, StartIcon, DurationIcon, EditThinIcon, RestIcon } from "kui/icons"
import { DeleteIcon, CloneIcon } from "kui/icons"
import { genUuid } from "keystone"
import { PrimaryButton, FloatButton, IconButton } from "kui/components/Button"
import { difficultyVariant } from "scenes/Home/TrainingV3/common"
import { setIcon, setName } from "scenes/Home/TrainingV3/common"
import colors, { gradients } from "kui/colors"

const ListItem = ({
  item,
  index,
  count,
  move,
  moveEnd,
  isActive,
  onSetEdit,
  onSetClone,
  onSetDelete,
  onRestEdit,
  onRestDelete
}) => {
  const set = item.data || {}

  const SetIcon = setIcon(set.type)
  const name = setName(set.type, 1)

  const timeout = _.getOr(0, "data.value", item)
  const formatedTimeout =
    timeout < 60
      ? moment.utc(timeout * 1000).format("s [sec]")
      : timeout < 3600
      ? moment.utc(timeout * 1000).format("m:ss")
      : moment.utc(timeout * 1000).format("HH:mm:ss")

  return item.type === "rest" ? (
    <View paddingHorizontal={20}>
      <TouchableOpacity
        opacity={isActive ? 0.7 : 1}
        onPress={() => onRestEdit(item)}
        onLongPress={move}
        onPressOut={moveEnd}
        marginVertical={6}
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
            <Text variant="body1" paddingRight={8}>
              {formatedTimeout}
            </Text>
            <IconButton margin={-10} onPress={() => onRestDelete(item)}>
              <DeleteIcon />
            </IconButton>
          </Row>
        </Card>
      </TouchableOpacity>
    </View>
  ) : (
    <View paddingHorizontal={20}>
      <Row marginTop={8} centerY>
        <Text variant="body2" flex={1}>
          {item.index}/{count}
        </Text>
        <IconButton onPress={() => onSetClone(set)}>
          <CloneIcon />
        </IconButton>
        <IconButton onPress={() => onSetDelete(set)}>
          <DeleteIcon />
        </IconButton>
      </Row>
      <TouchableOpacity
        opacity={isActive ? 0.7 : 1}
        onPress={() => onSetEdit(set)}
        onLongPress={move}
        onPressOut={moveEnd}
        marginVertical={6}
      >
        <Card color={colors.darkBlue90} padding={16}>
          <Row centerY>
            <Row centerY flex={1}>
              <SetIcon />
              <Text variant="caption1" flex={1} paddingLeft={8}>
                {name}
              </Text>
              <Text variant="caption1">{specsString(set, ["timeout"])}</Text>
            </Row>
          </Row>
        </Card>
      </TouchableOpacity>
    </View>
  )
}

const ListFooter = ({ emptyList, onAddSet, onRestAdd }) => {
  return (
    <View paddingHorizontal={20}>
      {emptyList && (
        <Text variant="body2" marginTop={32}>
          Add sets
        </Text>
      )}
      <Row marginTop={12}>
        <PrimaryButton
          onPress={onAddSet}
          backgroundColor={colors.darkBlue90}
          flex={1}
          minWidth={0}
          marginRight={!emptyList ? 8 : 0}
        >
          <Row centerXY>
            <AddIcon size={24} color={colors.blue50} />
            <Text variant="button1" marginLeft={4}>
              ADD SET
            </Text>
          </Row>
        </PrimaryButton>
        {!emptyList && (
          <PrimaryButton
            onPress={onRestAdd}
            backgroundColor={colors.green50}
            flex={1}
            minWidth={0}
            marginLeft={8}
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

const WorkoutInfo = props => {
  const { items, onAddSet, onRestAdd, onMoveEnd } = props
  const workout = props.workout()
  const difficulty =
    difficultyVariant[workout && workout.difficulty] || difficultyVariant["Easy"]

  const timeout = workout ? parseInt(workout.duration) : 0
  const formatedTimeout =
    timeout < 60
      ? moment.utc(timeout * 1000).format("s [sec]")
      : timeout < 3600
      ? moment.utc(timeout * 1000).format("m:ss")
      : moment.utc(timeout * 1000).format("HH:mm:ss")

  return (
    !!workout && (
      <View flex={1}>
        <View flex={1}>
          <TouchableOpacity onPress={props.onClick}>
            <Row paddingHorizontal={20}>
              <Card color={colors.darkBlue90} padding={16}>
                <Row centerY>
                  <EditThinIcon />
                  <Text marginLeft={4} variant="body2">
                    {workout.name}
                  </Text>
                  <Row flex={1} justifyContent="flex-end">
                    <Label variant={difficulty.variant} text={difficulty.name} />
                  </Row>
                </Row>
                <Row centerY marginTop={12}>
                  <DurationIcon />
                  <Text marginLeft={8} variant="body1" flex={1}>
                    Duration
                  </Text>
                  <Text variant="body2">{formatedTimeout}</Text>
                </Row>
              </Card>
            </Row>
          </TouchableOpacity>

          <View flex={1} marginTop={10}>
            <DraggableFlatList
              data={items}
              keyExtractor={(item, index) => `draggable-item-${index}`}
              scrollPercent={5}
              onMoveEnd={({ data, row, to, from }) => onMoveEnd(data, row, to, from)}
              renderItem={itemProps => (
                <ListItem
                  {...itemProps}
                  count={props.sets().length}
                  onSetEdit={props.onSetEdit}
                  onSetClone={props.onSetClone}
                  onSetDelete={props.onSetDelete}
                  onRestEdit={props.onRestEdit}
                  onRestDelete={props.onRestDelete}
                />
              )}
              ListFooterComponent={
                <ListFooter
                  emptyList={items.length === 0}
                  onAddSet={onAddSet}
                  onRestAdd={onRestAdd}
                />
              }
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
        {/* <FloatButton
          color={colors.darkBlue50}
          right={20}
          bottom={88}
          onPress={props.onStart}
        >
          <StartIcon />
        </FloatButton> */}
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
          <PrimaryButton label="SAVE AND GO BACK" onPress={props.onSave} />
        </View>
      </View>
    )
  )
}

const enhanced = compose(
  withNavigation,
  withControls(),
  withHandlers({
    buildSequence: ({ sets }) => () => {
      return sets().reduce((acc, s, i) => {
        const set = { type: "set", data: { ...s } }
        const timeout = _.getOr(0, "data.specs.timeout.value", set)
        return [
          ...acc,
          { type: "set", index: i + 1, data: { ...s } },
          ...(timeout
            ? [
                {
                  type: "rest",
                  data: { id: genUuid(), value: timeout, parentId: set.data.id }
                }
              ]
            : [])
        ]
      }, [])
    }
  }),
  withHandlers({
    onMoveEnd: ({ updSets }) => (items, row, to, from) => {
      if (_.getOr(null, "[0].type", items) === "rest") {
        // const newIndex = items.findIndex(o => o.data.id === row.data.id) || 1
        // newIndex !== -1 && items.splice(newIndex, 0, items.splice(0, 1)[0])
        items.splice(1, 0, items.splice(0, 1)[0])
      }

      const sets = items.reduce((acc, o) => {
        if (o.type === "set") {
          return [
            ...acc,
            {
              ...o.data,
              specs: _.keys(o.data.specs).reduce(
                (acc, s) => (s !== "timeout" ? { ...acc, [s]: o.data.specs[s] } : acc),
                {}
              )
            }
          ]
        } else if (o.type === "rest" && acc.length > 0) {
          acc[acc.length - 1].specs = {
            ...acc[acc.length - 1].specs,
            timeout: { unit: "sec", value: o.data.value }
          }
          return acc
        } else {
          return acc
        }
      }, [])
      updSets(sets)
    },
    onMoveSet: ({ moveSet }) => (from, to) => {
      moveSet(from, to)
    },
    onSetEdit: ({ navigation, sets }) => set => {
      const index = _.findIndex(s => s.id == set.id, sets())
      navigation.navigate("SetBuilderScene", {
        title: "Set " + (index + 1),
        setId: set && set.id
      })
    },
    onSetClone: ({ cloneSet }) => set => {
      set && cloneSet(set.id)
    },
    onSetDelete: ({ delSet }) => set => {
      set &&
        confirm(
          () => delSet(set.id),
          "This set and its exercise will be permanently deleted.",
          "Delete Set?",
          "Delete",
          "Cancel"
        )
    },
    onRestAdd: ({ navigation, sets, updSet }) => () => {
      const set = _.last(sets())
      set &&
        navigation.navigate("TimeSelector", {
          title: "Add rest",
          subtitle: "Specify rest duration",
          onTimeSelect: value => {
            updSet(set.id, {
              specs: { ...set.specs, timeout: { unit: "sec", value: value } }
            })
          }
        })
    },
    onRestEdit: ({ navigation, sets, updSet }) => item => {
      const set = sets().find(s => s.id === item.data.parentId)
      set &&
        navigation.navigate("TimeSelector", {
          title: "Update rest",
          value: item.data.value || 0,
          subtitle: "Specify rest duration",
          onTimeSelect: value => {
            updSet(set.id, {
              specs: { ...set.specs, timeout: { unit: "sec", value: value } }
            })
          }
        })
    },
    onRestDelete: ({ sets, updSet }) => item => {
      const set = sets().find(s => s.id === item.data.parentId)

      if (set) {
        const newSpecs = _.keys(set.specs).reduce(
          (acc, s) => (s !== "timeout" ? { ...acc, [s]: set.specs[s] } : acc),
          {}
        )
        updSet(set.id, { specs: { ...defaultSpecs(set.type), ...newSpecs } })
      }
    },
    onMoveRest: ({ buildSequence, updSet }) => (from, to) => {
      const items = buildSequence()
      const fromSet = _.getOr(null, `${from}.data`, items)
      const toSet = _.getOr(null, `${to}.data`, items)

      if (fromSet && toSet) {
        updSet(toSet.id, {
          specs: {
            ...toSet.specs,
            ...(fromSet.specs.timeout ? { timeout: fromSet.specs.timeout } : {})
          }
        })
        updSet(fromSet.id, {
          specs: _.keys(fromSet.specs).reduce(
            (acc, s) => (s !== "timeout" ? { ...acc, [s]: fromSet.specs[s] } : acc),
            {}
          )
        })
      }
    },
    onChangeRest: ({ buildSequence, updSet }) => (from, to) => {
      const items = buildSequence()
      const fromSet = _.getOr(null, `${from}.data`, items)
      const toSet = _.getOr(null, `${to}.data`, items)
      if (fromSet && toSet) {
        const fromTimeout = fromSet.specs.timeout
        const toTimeout = toSet.specs.timeout
        updSet(toSet.id, {
          specs: { ...toSet.specs, ...(fromTimeout ? { timeout: fromTimeout } : {}) }
        })
        updSet(fromSet.id, {
          specs: { ...fromSet.specs, ...(toTimeout ? { timeout: toTimeout } : {}) }
        })
      }
    }
  }),
  withProps(({ buildSequence }) => {
    return {
      items: buildSequence()
    }
  })
)

export default enhanced(WorkoutInfo)
