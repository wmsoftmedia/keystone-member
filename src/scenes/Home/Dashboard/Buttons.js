import { Text, TouchableOpacity, View } from "glamorous-native"
import { branch, compose, renderNothing, withStateHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { BodyIcon, BurgerMenuIcon } from "kui/icons"
import { HIITIcon, NutritionIcon, ProgressIcon, TrainingIcon } from "scenes/Home/Icons"
import { Row } from "kui/components"
import { TextButtonForward } from "kui/components/Button"
import { routes } from "navigation/routes"
import { trackEvent } from "init"
import { withUnreadReminderCnt } from "graphql/query/reminders/allReminders"
import _ from "lodash/fp"
import MiniAvatar from "components/Avatar/MiniAvatar"
import colors from "kui/colors"
import withFeatures from "graphql/query/member/features"

export const Plus = () => (
  <Text color={colors.white} fontSize={24} fontWeight={"800"}>
    +
  </Text>
)

export const NavigationButton = props => {
  const { children, onPress, hidePlus = true, buttonProps } = props
  return (
    <View
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      paddingTop={15}
      {...props}
    >
      <TouchableOpacity
        activeOpacity={0.3}
        opacity={1}
        padding={5}
        onPress={onPress}
        {...buttonProps}
      >
        <Row centerX>
          {children}
          {!hidePlus && <Plus />}
        </Row>
      </TouchableOpacity>
    </View>
  )
}

const navTo = (navigation, tracker, date) => () => {
  navigation.navigate(tracker, { date })
  trackEvent("navigation", "open", tracker)
}

export const FeelingsButton = withNavigation(({ navigation, date }) => (
  <NavigationButton onPress={navTo(navigation, "FeelingsNavigator", date)}>
    <ProgressIcon color={colors.white} />
  </NavigationButton>
))

export const BodyButton = withNavigation(({ navigation, date }) => (
  <NavigationButton onPress={navTo(navigation, "BodyNavigator", date)}>
    <BodyIcon color={colors.white} />
  </NavigationButton>
))

export const BookingsButton = compose(
  withNavigation,
  withFeatures,
  branch(({ data }) => {
    const features = _.getOr([], "member.features.nodes", data).map(f => f.name)
    return !features.includes("member_app_bridge_schedule")
  }, renderNothing)
)(({ navigation }) => (
  <TextButtonForward
    label="MY SCHEDULE"
    onPress={navTo(navigation, routes.Bookings)}
    marginRight={-10}
  />
))

export const NutritionButton = withNavigation(({ navigation, date }) => (
  <NavigationButton onPress={navTo(navigation, "NutritionNavigator", date)}>
    <NutritionIcon color={colors.white} />
  </NavigationButton>
))

export const TrainingButton = withNavigation(({ navigation, date }) => {
  return (
    <NavigationButton onPress={navTo(navigation, "TrainingNavigatorV3", date)}>
      <HIITIcon color={colors.white} />
    </NavigationButton>
  )
})

export const ProfileButton = ({ navigation, date }) => {
  return (
    <NavigationButton
      onPress={navTo(navigation, "ProfileScreen", date)}
      hidePlus
      paddingTop={0}
      paddingLeft={10}
      justifyContent="center"
      buttonProps={{ activeOpacity: 0.8 }}
    >
      <MiniAvatar />
    </NavigationButton>
  )
}

export const Badge = props => {
  const value = props.value ? parseInt(props.value) : 0
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      position="absolute"
      width={20}
      height={20}
      top={9}
      right={12}
      backgroundColor={colors.yellow60}
      borderRadius={10}
      {...props}
    >
      <Text lineHeight={20} textAlign="center" fontSize={11} color={colors.white}>
        {value > 9 ? "9+" : value}
      </Text>
    </TouchableOpacity>
  )
}

export const FeedButton = compose(withUnreadReminderCnt)(props => {
  const { navigation, date } = props
  const unread = _.getOr(0, "data.unreadReminderCount.totalCount", props)
  return (
    <View width={48}>
      <NavigationButton
        onPress={navTo(navigation, routes.FeedScreen, date)}
        hidePlus
        paddingTop={0}
        paddingRight={0}
        justifyContent="center"
      >
        <BurgerMenuIcon />
      </NavigationButton>
      {unread > 0 ? (
        <Badge onPress={navTo(navigation, routes.FeedScreen, date)} value={unread} />
      ) : (
        <View />
      )}
    </View>
  )
})
