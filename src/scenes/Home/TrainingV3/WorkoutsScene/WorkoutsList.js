import { View, TouchableOpacity, FlatList } from "glamorous-native"
import { RefreshControl } from "react-native"
import { compose, defaultProps, setPropTypes, withProps, withState } from "recompose"
import React from "react"
import moment from "moment"

import { DurationIcon, ChevronDownIcon, ChevronUpIcon } from "kui/icons"
import { TrashIcon, EditThinIcon } from "kui/icons"
import { Row } from "kui/components"
import { SetTypes, difficultyVariant } from "scenes/Home/TrainingV3/common"
import InfoMessage from "components/InfoMessage"
import { TextInput } from "kui/components/Input"
import Card from "kui/components/Card"
import Label from "kui/components/Label"
import Line from "kui/components/Line"
import { IconButton } from "kui/components/Button"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const WorkoutListItem = withState("opened", "setOpened", false)(
  ({ item, onClick, opened, setOpened, onEdit, onDelete, editable }) => {
    const setMap = item.setMap || []

    const duration = item.duration
      ? item.duration > 60
        ? moment.utc(item.duration * 60 * 1000).format("H:mm:ss [min]")
        : moment.utc(item.duration * 60 * 1000).format("mm:ss [min]")
      : "--"
    const difficulty = difficultyVariant[item.difficulty] || difficultyVariant["Easy"]
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onClick(item)}
        marginHorizontal={20}
      >
        <Card color={colors.darkBlue90} padding={16}>
          <Row alignItems="center" justifyContent="space-between">
            <Text variant="body2" flex={1} paddingRight={8}>
              {item.name}
            </Text>
            <Label variant={difficulty.variant} text={difficulty.name} />
          </Row>
          <Row paddingTop={12} justifyContent="space-between" alignItems="center">
            <Row alignItems="center">
              <DurationIcon />
              <Text variant="body1" paddingLeft={8}>
                Duration
              </Text>
            </Row>
            <Row alignItems="center">
              <Text variant="body2">{duration}</Text>
              {(setMap.length > 0 || editable) && (
                <TouchableOpacity onPress={() => setOpened(!opened)} padding={8}>
                  {opened ? (
                    <ChevronUpIcon size={20} color={colors.darkBlue40} />
                  ) : (
                    <ChevronDownIcon size={20} color={colors.darkBlue40} />
                  )}
                </TouchableOpacity>
              )}
            </Row>
          </Row>
          {opened && (
            <View>
              <Line marginTop={16} marginHorizontal={0} color={colors.darkBlue80} />
              {!!editable && (
                <Row justifyContent="flex-end" marginRight={-4}>
                  <IconButton onPress={() => onEdit && onEdit(item)}>
                    <EditThinIcon />
                  </IconButton>
                  <IconButton onPress={() => onDelete && onDelete(item)}>
                    <TrashIcon color={colors.red50} />
                  </IconButton>
                </Row>
              )}
              {setMap.map((set, i) => {
                const typeInfo = SetTypes.properties[SetTypes[set.toUpperCase()] || 0]
                return (
                  typeInfo && (
                    <Row key={i} marginTop={16} alignItems="center">
                      <typeInfo.icon />
                      <Text variant="body1" paddingLeft={8}>
                        {typeInfo.label} - {typeInfo.name}
                      </Text>
                    </Row>
                  )
                )
              })}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    )
  }
)

const WorkoutsList = props => {
  const {
    items,
    noDataMessage,
    noDataText,
    isLoading,
    handleRefresh,
    editable,
    onClick,
    onEdit,
    onDelete,
    ...rest
  } = props

  return (
    <View flex={1} {...rest}>
      <View paddingHorizontal={20} marginBottom={20}>
        <TextInput placeholder="Search" onChange={props.setTerm} value={props.term} />
      </View>
      <FlatList
        flex={1}
        data={items}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={() =>
          isLoading ? null : <InfoMessage title={noDataMessage} subtitle={noDataText} />
        }
        renderItem={({ item }) => (
          <WorkoutListItem
            item={item}
            editable={editable}
            onClick={onClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        ItemSeparatorComponent={() => <View paddingTop={12} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

const enhanced = compose(
  setPropTypes({
    workouts: PropTypes.array.isRequired,
    noDataMessage: PropTypes.string,
    noDataText: PropTypes.string
  }),
  defaultProps({
    workouts: [],
    noDataMessage: "No workouts to show.",
    noDataText: "Choose a workout from other options above, or contact your coach."
  }),
  withState("headTab", "setHeadTab", 0),
  withState("term", "setTerm", ""),
  withProps(props => {
    const { term, workouts } = props
    const items = workouts.filter(w =>
      (w.name || "").toLowerCase().includes(term.toLowerCase())
    )
    return {
      items: _.orderBy("name", ["asc"], items),
      emptyList: workouts.length === 0
    }
  })
)

export default enhanced(WorkoutsList)
