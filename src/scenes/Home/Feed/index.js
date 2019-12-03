import { ActivityIndicator, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Text, View } from "glamorous-native"
import { compose } from "recompose"
import { defaultProps, withHandlers, withProps } from "recompose"
import React from "react"

import { Row } from "kui/components"
import { cardTopStyle } from "styles"
import { gradients } from "kui/colors"
import { withErrorHandler, withAnimation } from "hoc"
import Line from "kui/components/Line"
import List from "components/List"
import NoData from "components/NoData"
import ReminderItem from "scenes/Home/Feed/ReminderItem"
import _ from "lodash/fp"
import allReminders from "graphql/query/reminders/allReminders"
import colors from "colors"
import readReminders from "graphql/mutation/reminders/readReminders"

const ListFooter = () => (
  <Row centerXY padding={20} flexWrap="wrap">
    <Text color={colors.white50}>Loading more results </Text>
    <ActivityIndicator animating size="small" color={colors.white50} />
  </Row>
)

const ListEmptyComponent = () => (
  <NoData
    message="You do not have any notifications yet."
    color={colors.white50}
    padding={24}
  />
)

const ReminderList = props => {
  const { reminders, hasReminders, onPressItem } = props
  return (
    <View flex={1} {...cardTopStyle} backgroundColor={gradients.card[0]}>
      <LinearGradient
        colors={gradients.card}
        style={[StyleSheet.absoluteFill, { ...cardTopStyle, marginTop: 20 }]}
      />
      <List
        data={reminders}
        keyExtractor={item => item.id}
        refreshable
        handleRefresh={props.refreshReminders}
        initialNumToRender={20}
        onEndReachedThreshold={0.1}
        onEndReached={props.onListEnd}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ReminderItem reminder={item} onPressItem={onPressItem} />
        )}
        ItemSeparatorComponent={Line}
        ListFooterComponent={!props.isLastPage && hasReminders ? ListFooter : null}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ justifyContent: hasReminders ? "flex-start" : "center" }}
      />
    </View>
  )
}

const DEFAULT_PAGE_SIZE = 30

const enhanced = compose(
  defaultProps({ pageSize: DEFAULT_PAGE_SIZE, offset: 0 }),
  withErrorHandler,
  allReminders,
  readReminders,
  withProps(props => {
    const reminders = _.getOr([], "data.reminders.nodes", props)
    const totalCount = _.getOr(0, "data.reminders.totalCount", props)
    const itemCount = reminders.length
    const currentPage = Math.ceil(itemCount / props.pageSize)
    const totalPage = Math.ceil(totalCount / props.pageSize)
    const isLastPage = totalPage
      ? totalPage === currentPage
      : itemCount % props.pageSize !== 0
    const hasReminders = reminders.length > 0

    return { reminders, itemCount, currentPage, totalPage, hasReminders, isLastPage }
  }),
  withHandlers({
    onListEnd: props => () => {
      if (props.isLastPage || props.data.loading) return
      props.data.fetchMore({
        variables: {
          pageSize: props.pageSize,
          offset: props.itemCount
        },
        updateQuery: (cur, { fetchMoreResult: next }) => {
          if (!next) return cur
          const newNodes = _.getOr([], `reminders.nodes`, next)
          return {
            reminders: {
              ...cur.reminders,
              nodes: [...cur.reminders.nodes, ...newNodes]
            }
          }
        }
      })
    },
    onPressItem: props => reminder => {
      if (!reminder.seen) {
        props.readReminders([reminder])
      }
    },
    refreshReminders: props => done => props.data.refetch().then(done)
  }),
  withAnimation({ onMount: true })
)

export default enhanced(ReminderList)
