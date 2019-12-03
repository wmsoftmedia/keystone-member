import { TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"

import { ChevronRightIcon } from "kui/icons"
import {
  RESERVATION_EXPIRED,
  RESERVATION_TYPE_TEMP,
  mkSchedule,
  mkSections,
  statusColor,
  statusIcon
} from "scenes/Home/Bookings/utils"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { formatTime, isPastDate, isToday } from "keystone"
import { homeRoutes } from "navigation/routes"
import { withReservationRequestDeleteMutation } from "graphql/mutation/reservation/deleteRequest"
import { withReservationsLoaded } from "graphql/query/member/reservations"
import List from "components/List"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const renderSeparator = () => <View paddingVertical={6} />
const renderSectionHeader = ({ section }) => (
  <View paddingHorizontal={20} paddingTop={12} paddingBottom={8}>
    <Text variant="caption1" color={colors.darkBlue30}>
      {section.title}
    </Text>
  </View>
)

const NoData = () => {
  return (
    <Row padding={8} flex={1} centerXY>
      <Text variant="body1" padding={4} color={colors.white50}>
        Your reservations will appear here.
      </Text>
    </Row>
  )
}

const formatDate = (date, fmt = "dd") => {
  const today = isToday(date)
  return date ? (today ? "Today" : moment(date).format(fmt)) : "n/a"
}

const Item = props => {
  const { listProps, item } = props
  const { onItemPress } = listProps
  const { className: name, time, reqTime, date, status, type } = item.item
  const Icon = statusIcon[status]

  const today = isToday(date)
  const dateStr = formatDate(date)

  const inactive = status === RESERVATION_EXPIRED || isPastDate(date)
  const timeStr = time ? formatTime(time) : null
  const reqTimeStr = reqTime ? formatTime(reqTime) : null

  return (
    <View paddingHorizontal={20}>
      <TouchableOpacity
        flex={1}
        padding={16}
        backgroundColor={today ? colors.darkBlue80 : colors.darkBlue90}
        borderRadius={12}
        opacity={inactive ? 0.5 : 1}
        onPress={() => onItemPress(item)}
      >
        <Row justifyContent="space-between" alignItems="flex-start">
          <Text variant="body2" flex={1}>
            {name}
          </Text>
          {type === RESERVATION_TYPE_TEMP && (
            <Row centerY width={100} justifyContent="flex-end">
              {!!Icon && (
                <Icon
                  size={20}
                  color={statusColor[status]}
                  backgroundColor={colors.transparent}
                />
              )}
              <Text variant="button1" color={statusColor[status]} paddingLeft={4}>
                {status.toUpperCase()}
              </Text>
            </Row>
          )}
        </Row>
        <View flexDirection={"row"} alignItems="center" paddingTop={8}>
          <Text variant="caption1" color={colors.darkBlue30}>
            {dateStr ? `${dateStr}, ` : ""}
            {timeStr}
          </Text>
          {reqTime && (
            <React.Fragment>
              <View paddingTop={4} paddingRight={3}>
                <ChevronRightIcon color={colors.darkBlue30} size={16} />
              </View>
              <Text variant="caption1" color={colors.darkBlue30}>
                {reqTimeStr}
              </Text>
            </React.Fragment>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const Bookings = props => {
  const { sections, club, org } = props
  const { handleRefresh, itemProps } = props
  return (
    <Screen>
      <View paddingVertical={8} paddingHorizontal={20}>
        <Text variant="h2">{!!org && org.name}</Text>
        <Text variant="body1">{!!club && club.name}</Text>
      </View>
      <List
        refreshable
        handleRefresh={handleRefresh}
        sectionList
        sections={sections}
        keyExtractor={(e, i) => i}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={NoData}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSeparator}
        renderItem={item => <Item listProps={itemProps} item={item} />}
      />
    </Screen>
  )
}

const enhance = compose(
  withReservationsLoaded,
  withReservationRequestDeleteMutation,
  withProps(props => {
    const { data } = props
    const member = _.getOr(null, "currentMember", data)
    const reservations = _.getOr([], "reservations.nodes", member)
    const club = _.getOr(null, "club", member)
    const org = _.getOr(null, "org", member)
    const schedule = mkSchedule(reservations)
    const sections = mkSections(schedule)
    return { sections, club, org }
  }),
  withNavigation,
  withState("selectedItem", "setItem", null),
  withHandlers({
    handleRefresh: props => done => {
      props.data
        .refetch()
        .then(done)
        .catch(done)
    },
    onItemPress: ({ navigation }) => ({ item }) => {
      if (!item) {
        return
      }
      const date = _.getOr(null, "date", item)
      navigation.navigate(homeRoutes.Reservation, { date, item })
    }
  }),
  withProps(props => {
    const { onItemPress } = props
    const itemProps = { onItemPress }
    return { itemProps }
  })
)

export default enhance(Bookings)
