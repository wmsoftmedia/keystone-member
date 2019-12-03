import { View, SectionList } from "glamorous-native"
import { RefreshControl } from "react-native"
import { compose, withHandlers, withProps } from "recompose"
import { NavigationEvents } from "react-navigation"
import React from "react"
import moment from "moment"

import { withSettings } from "hoc"
import { Row } from "kui/components"
import { weekOfMonth } from "keystone"
import { withWorkoutSessionsByMonth } from "graphql/query/workout/workoutSessions"
import InfoMessage from "components/InfoMessage"
import Text from "kui/components/Text"
import WorkoutListItem from "scenes/Home/TrainingV3/HistoryScene/WorkoutListItem"
import _ from "lodash/fp"
import colors from "kui/colors"

const createDateSections = items => {
  const sections = items.reduce((acc, item) => {
    const date = moment(item.date)
    const weekIndex = weekOfMonth(date)
    const title = `Week ${weekIndex}`
    acc[title] = {
      title,
      data: [...(acc[title] ? acc[title].data : []), item]
    }
    return acc
  }, {})
  return Object.values(sections)
}

const renderSectionHeader = ({ section }) => {
  return (
    <Row spread marginHorizontal={20}>
      <Text variant="caption1" color={colors.darkBlue30}>
        {section.title}
      </Text>
      <Text variant="caption1" color={colors.darkBlue30}>
        {section.data.length} sessions
      </Text>
    </Row>
  )
}

const WorkoutHistoryList = props => {
  const { date, sections, numSessions, isLoading } = props
  const { onClick, onDelete, handleRefresh } = props
  const monthLabel = moment(date).format("MMMM 'YY")

  return (
    <View flex={1}>
      <NavigationEvents onWillFocus={props.onWillFocus} />
      {sections.length !== 0 && (
        <View paddingHorizontal={20} paddingBottom={16}>
          <Text variant="body2">Workout Log</Text>
          <Text variant="caption1" color={colors.darkBlue30}>
            You have logged {numSessions} session{numSessions === 1 ? "" : "s"} in{" "}
            {monthLabel}
          </Text>
        </View>
      )}

      <SectionList
        flex={1}
        sections={sections}
        keyExtractor={(item, i) => String(i)}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          isLoading ? null : (
            <InfoMessage
              title={`No sessions logged in ${monthLabel}`}
              subtitle={`Start new or submit a workout\nand it will appear in your history`}
            />
          )
        }
        renderItem={({ item }) => (
          <WorkoutListItem
            item={item}
            onDelete={onDelete}
            onClick={onClick}
            weightConverter={props.weightConverter}
            weightUnit={props.weightUnit}
          />
        )}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={() => <View paddingTop={12} />}
        SectionSeparatorComponent={({ trailingItem, trailingSection }) => (
          <View paddingTop={trailingItem ? 8 : trailingSection ? 24 : 0} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

const enhanced = compose(
  withSettings,
  withWorkoutSessionsByMonth,
  withProps(({ data }) => {
    const isLoading = _.getOr(false, "loading", data)
    const sessions = _.getOr([], "currentMember.workoutSessionsByMonth.nodes", data)
    const workoutSessions = _.reverse(_.sortBy(s => s.date, sessions)).map(item => ({
      ...item,
      workoutId: _.getOr([], "workoutTemplate.id", item),
      workoutName: _.getOr([], "workoutTemplate.name", item)
    }))
    const numSessions = workoutSessions.length
    return {
      sections: createDateSections(workoutSessions),
      numSessions,
      isLoading
    }
  }),
  withHandlers({
    handleRefresh: props => done => {
      props.data
        .refetch()
        .then(done)
        .catch(done)
    },
    onWillFocus: props => payload => {
      if (_.getOr(null, "action.type", payload) === "Navigation/BACK") {
        props.data.refetch()
      }
    }
  })
)

export default enhanced(WorkoutHistoryList)
