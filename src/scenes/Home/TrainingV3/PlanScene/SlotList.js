import { compose, defaultProps, setPropTypes, withProps, withState } from "recompose"
import React from "react"
import moment from "moment"
import styled, { View, TouchableOpacity } from "glamorous-native"

import { DurationIcon, ChevronDownIcon, ChevronUpIcon, RestIcon } from "kui/icons"
import { Row } from "kui/components"
import { SetTypes, difficultyVariant } from "scenes/Home/TrainingV3/common"
import Card from "kui/components/Card"
import Label from "kui/components/Label"
import Line from "kui/components/Line"
import List from "components/List"
import NotesWidget from "scenes/Home/TrainingV3/components/NotesWidget"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const ListHeaderText = styled(p => <Text {...p} />)({
  color: colors.darkBlue30,
  fontSize: 12,
  lineHeight: 16,
  backgroundColor: colors.blue8
})

const WorkoutListItem = withState("opened", "setOpened", false)(
  ({ item, onClick, opened, setOpened, ...rest }) => {
    const setMap = _.getOr([], "workoutTemplate.setMap", item)
    const _duration = _.getOr(0, "workoutTemplate.duration", item)
    const _difficulty = _.getOr("Easy", "workoutTemplate.difficulty", item)

    const duration = _duration
      ? _duration > 60
        ? moment.utc(_duration * 60 * 1000).format("H:mm:ss [min]")
        : moment.utc(_duration * 60 * 1000).format("mm:ss [min]")
      : "--"
    const difficulty = difficultyVariant[_difficulty] || difficultyVariant["Easy"]
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onClick(item)}
        marginTop={12}
        {...rest}
      >
        <Card color={colors.darkBlue90} padding={16}>
          <Row alignItems="flex-start" justifyContent="space-between">
            <View justifyContent="flex-start">
              <Text variant="body2" paddingRight={8}>
                {item.workoutTemplateName}
              </Text>
              <Text variant="caption1" color={colors.darkBlue30}>
                {moment(item.date).format("dddd")}
              </Text>
            </View>
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
              {setMap.length > 0 && (
                <TouchableOpacity
                  onPress={() => setOpened(!opened)}
                  padding={8}
                  marginRight={-8}
                >
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

const RestListItem = ({ item }) => {
  return (
    <Card color={colors.green50} padding={16} marginTop={12}>
      <Row alignItems="center">
        <RestIcon />
        <Text variant="body2" flex={1} paddingLeft={8}>
          REST - {moment(item.date).format("dddd")}
        </Text>
      </Row>
    </Card>
  )
}

const renderItem = onClick => ({ item }) => {
  return item.workoutTemplateId ? (
    <WorkoutListItem item={item} onClick={onClick} />
  ) : (
    <RestListItem item={item} />
  )
}

const renderSectionHeader = ({ section }) => (
  <View marginTop={20}>
    <ListHeaderText>{section.title}</ListHeaderText>
  </View>
)

const SlotList = props => {
  const { sections, notes } = props

  return (
    <List
      paddingHorizontal={20}
      marginTop={16}
      sectionList
      refreshable
      stickySectionHeadersEnabled={false}
      handleRefresh={props.handleRefresh}
      ItemSeparatorComponent={null}
      sections={sections}
      keyExtractor={(item, i) => i}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem(props.onClick)}
      ListHeaderComponent={() => <NotesWidget notes={notes} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  )
}

const enhanced = compose(
  setPropTypes({
    plan: PropTypes.object.isRequired,
    handleRefresh: PropTypes.func,
    onClick: PropTypes.func
  }),
  defaultProps({
    handleRefresh: () => {},
    onClick: () => {}
  }),
  withProps(({ plan }) => {
    if (plan) {
      const sections = [
        ...(plan.todaySlots && plan.todaySlots.length > 0
          ? [{ title: "TODAY", data: plan.todaySlots }]
          : []),
        { title: "FULL PLAN", data: plan.slots }
      ]

      return { sections, notes: plan.notes || "" }
    }
  })
)

export default enhanced(SlotList)
