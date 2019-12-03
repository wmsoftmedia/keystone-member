import { Text, View } from "glamorous-native"
import { TouchableOpacity } from "react-native"
import { compose } from "recompose"
import { withStateHandlers } from "recompose"
import React from "react"
import moment from "moment"

import {
  BodyIcon,
  CoachIcon,
  FeelingsIcon,
  NutritionIcon,
  StatsIcon,
  TrainingIcon
} from "kui/icons"
import { ReportLink } from "scenes/Home/Feed/ReportLink"
import { Row } from "kui/components"
import { TransferIcon } from "scenes/Home/Icons"
import { isToday } from "keystone"
import _ from "lodash/fp"
import colors from "kui/colors"
import fonts from "kui/fonts"

const feedIcons = {
  GENERAL: CoachIcon,
  NUTRITION: NutritionIcon,
  TRAINING: TrainingIcon,
  FEELINGS: FeelingsIcon,
  MEASUREMENTS: BodyIcon,
  REPORT: StatsIcon,
  TRANSFER: TransferIcon
}

const reminderTypes = {
  GENERAL: "GENERAL",
  NUTRITION: "NUTRITION",
  TRAINING: "TRAINING",
  FEELINGS: "FEELINGS",
  MEASUREMENTS: "MEASUREMENTS",
  REPORT: "REPORT",
  TRANSFER: "TRANSFER"
}

const InfoText = props => <Text color={colors.white} fontSize={12} {...props} />

const TRUNCATE_LENGTH = 100

const ReminderItem = props => {
  const { reminder, onPressItem, toggleShowMore, isOpen } = props
  const time = moment.utc(reminder.createdAt).local()
  const CurrentIcon = _.getOr(feedIcons.GENERAL, reminder.type, feedIcons)
  const shouldEllipsize = (reminder.message || "").length > TRUNCATE_LENGTH
  const message =
    shouldEllipsize && !isOpen
      ? (reminder.message || "").substring(0, TRUNCATE_LENGTH)
      : reminder.message

  const onPress = () => {
    toggleShowMore()
    onPressItem(reminder)
  }

  const reminderTime = isToday(time) ? time.fromNow() : time.format("ddd D MMM YYYY")

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View paddingHorizontal={20} paddingVertical={20}>
        <Row>
          <View alignItems="center" paddingRight={8}>
            <CurrentIcon color={colors.darkBlue40} size={28} />
            {false && reminder.coach && (
              <InfoText textAlign="center">from {reminder.coach.firstName}</InfoText>
            )}
          </View>
          <View flex={1}>
            <Row centerY>
              {!reminder.seen && (
                <View
                  width={8}
                  height={8}
                  borderRadius={8}
                  backgroundColor={colors.green40}
                  marginLeft={6}
                  marginRight={12}
                />
              )}
              <Text
                fontSize={16}
                lineHeight={24}
                fontFamily={fonts.montserratSemiBold}
                color={colors.white}
                numberOfLines={isOpen ? null : 2}
                ellipsizeMode="tail"
              >
                {reminder.title}
              </Text>
            </Row>

            {reminder.type === reminderTypes.REPORT ? (
              <ReportLink token={reminder.message} />
            ) : (
              <Text fontSize={15} lineHeight={24} color={colors.darkBlue20}>
                {message}
                {shouldEllipsize && !isOpen ? "..." : ""}
                {shouldEllipsize && (
                  <Text color={colors.white} fontFamily={fonts.montserratSemiBold}>
                    {isOpen ? " Show less" : " Show more"}
                  </Text>
                )}
              </Text>
            )}
            <InfoText paddingTop={12}>{reminderTime}</InfoText>
          </View>
        </Row>
      </View>
    </TouchableOpacity>
  )
}

const enhance = compose(
  withStateHandlers(
    { isOpen: false },
    {
      toggleShowMore: ({ isOpen }) => () => ({ isOpen: !isOpen })
    }
  )
)

export default enhance(ReminderItem)
