import { Text } from "glamorous-native"
import { TouchableOpacity } from "react-native"
import { compose, defaultProps, withHandlers } from "recompose"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"

import { getOr } from "keystone"
import Row from "components/Row"
import allReminders from "graphql/query/reminders/allReminders"
import colors from "kui/colors"
import readReminders from "graphql/mutation/reminders/readReminders"

const MarkAllButton = props => {
  const { color = colors.white, onPress } = props
  const unreadReminders = getOr([], "data.reminders.nodes", props).filter(r => !r.seen)
  return unreadReminders.length > 0 ? (
    <TouchableOpacity style={{ paddingHorizontal: 12 }} onPress={onPress}>
      <Row>
        <Text paddingRight={8} color={color}>
          Mark all read
        </Text>
        <Ionicons color={color} name={"ios-checkmark"} size={42} />
      </Row>
    </TouchableOpacity>
  ) : null
}

const enhance = compose(
  defaultProps({
    filter: { seen: false }
  }),
  allReminders,
  readReminders,
  withHandlers({
    onPress: props => () => {
      const { data, readReminders } = props
      const allReminders = getOr([], "reminders.nodes", data)
      const unreadReminders = allReminders.filter(r => !r.seen)
      readReminders(unreadReminders)
    }
  })
)

export default enhance(MarkAllButton)
