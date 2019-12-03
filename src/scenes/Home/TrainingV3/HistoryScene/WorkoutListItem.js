import { View, TouchableOpacity } from "glamorous-native"
import { compose, withHandlers, withState } from "recompose"
import React from "react"
import moment from "moment"

import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "kui/icons"
import { IconButton } from "kui/components/Button"
import { Row } from "kui/components"
import { confirm } from "native"
import Card from "kui/components/Card"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const WorkoutListItem = props => {
  const { item, onClick, opened, setOpened, weightConverter, weightUnit } = props
  const { onTrashClick } = props

  const volume = weightConverter(_.getOr(0, "meta.volume", item))
  const distance = _.getOr(0, "meta.distance", item)
  const calories = _.getOr(0, "meta.calories", item)
  const performance = _.getOr(0, "meta.performance", item)
  const difficulty = _.getOr(0, "meta.difficulty", item)
  const notes = _.getOr("", "meta.notes", item)
  const hasSpec = volume || distance || calories

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => onClick(item)}
      marginHorizontal={20}
    >
      <Card color={colors.darkBlue90} padding={16}>
        <Row centerY spread>
          <Text variant="body2" flex={1}>
            {item.workoutName}
          </Text>
          <IconButton
            onPress={() => setOpened(!opened)}
            marginTop={-10}
            marginRight={-10}
          >
            {opened ? (
              <ChevronUpIcon size={20} color={colors.darkBlue40} />
            ) : (
              <ChevronDownIcon size={20} color={colors.darkBlue40} />
            )}
          </IconButton>
        </Row>
        <Row alignItems="center" paddingTop={8}>
          <Text variant="caption1" color={colors.darkBlue30}>
            {moment(item.date).format("ddd, DD MMM")}
          </Text>
        </Row>
        {opened && (
          <View>
            {hasSpec && (
              <View>
                <Line marginTop={16} marginHorizontal={0} color={colors.darkBlue80} />
                {!!volume && (
                  <Row marginTop={16} alignItems="center" justifyContent="space-between">
                    <Text variant="body1">Volume</Text>
                    <Text variant="body2">{volume + " " + weightUnit}</Text>
                  </Row>
                )}
                {!!distance && (
                  <Row marginTop={16} alignItems="center" justifyContent="space-between">
                    <Text variant="body1">Distance</Text>
                    <Text variant="body2">{distance} m</Text>
                  </Row>
                )}
                {!!calories && (
                  <Row marginTop={16} alignItems="center" justifyContent="space-between">
                    <Text variant="body1">Calories</Text>
                    <Text variant="body2">{calories} cal</Text>
                  </Row>
                )}
              </View>
            )}
            {!!notes && (
              <React.Fragment>
                <Line marginTop={16} marginHorizontal={0} color={colors.darkBlue80} />
                <View marginTop={16}>
                  <Text variant="caption2" color={colors.darkBlue30}>
                    NOTES
                  </Text>
                  <Text variant="caption2">{notes}</Text>
                </View>
              </React.Fragment>
            )}
            <Line marginTop={16} marginHorizontal={0} color={colors.darkBlue80} />
            <Row marginTop={16} alignItems="center">
              <View flex={1}>
                <Text variant="body2">{performance || "--"}/10</Text>
                <Text variant="caption2" color={colors.darkBlue30} marginTop={4}>
                  PERFORMANCE
                </Text>
              </View>
              <View flex={1}>
                <Text variant="body2">{difficulty || "--"}/10</Text>
                <Text variant="caption2" color={colors.darkBlue30} marginTop={4}>
                  DIFFICULTY
                </Text>
              </View>
              <View>
                <IconButton marginRight={-10} onPress={onTrashClick}>
                  <TrashIcon color={colors.red50} />
                </IconButton>
              </View>
            </Row>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  )
}

const enhance = compose(
  withState("opened", "setOpened", false),
  withHandlers({
    onTrashClick: ({ item, onDelete, setOpened }) => () => {
      confirm(
        () => {
          onDelete(item)
          setOpened(false)
        },
        "This workout session and its exercise attempts will be permanently deleted.",
        "Delete Session?",
        "Delete Forever",
        "Cancel"
      )
    }
  })
)

export default enhance(WorkoutListItem)
