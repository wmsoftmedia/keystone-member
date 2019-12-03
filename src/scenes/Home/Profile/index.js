import { compose, withState } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import styled, { View, ScrollView, TouchableOpacity } from "glamorous-native"

import { IconButton } from "kui/components/Button"
import { ModalScreen } from "components/Background"
import { Row } from "kui/components"
import { SettingsIcon } from "kui/icons"
import { homeRoutes } from "navigation/routes"
import { withLoader, withAnimation, withErrorHandler } from "hoc"
import Avatar from "components/Avatar"
import Line from "kui/components/Line"
import SettingDropDown from "scenes/Home/Profile/SettingDropDown"
import Text from "kui/components/Text"
import colors from "kui/colors"
import fonts from "kui/fonts"
import withProfileData from "graphql/query/member/profileData"

import { version } from "../../../../package.json"

const Section = styled(View)({
  padding: 20
})

const Info = ({ label, value, ...rest }) => {
  return (
    <View {...rest}>
      <Text variant="caption2" color={colors.darkBlue20}>
        {label}
      </Text>
      <Text variant="h2">{value}</Text>
    </View>
  )
}

const TRUNCATE_LENGTH = 100

const enhanceSummary = compose(withState("isOpen", "setIsOpen", false))

const GoalText = enhanceSummary(({ isOpen, setIsOpen, goalSummary }) => {
  const shouldEllipsize = (goalSummary || "").length > TRUNCATE_LENGTH
  const message =
    shouldEllipsize && !isOpen
      ? (goalSummary || "").substring(0, TRUNCATE_LENGTH)
      : goalSummary

  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} activeOpacity={0.9}>
      <Text variant="body1" opacity={0.7}>
        {message}
        {shouldEllipsize && !isOpen ? "..." : ""}
        {shouldEllipsize && (
          <Text variant="body1" fontFamily={fonts.montserratBold}>
            {isOpen ? " Show less" : " Show more"}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  )
})

const Profile = props => {
  const {
    data: { member },
    settings,
    navigation
  } = props

  const getValue = key => {
    return member.settings.nodes.find(({ setting }) => setting.key === key).value
  }

  return (
    <ModalScreen grabby>
      <ScrollView>
        <View flex={1} justifyContent="space-between">
          <View>
            <Section paddingTop={0}>
              <Row>
                <Avatar />
                <View flex={1} justifyContent="space-between">
                  <View paddingLeft={12} paddingTop={12}>
                    <Text variant="h1" fontSize={20}>
                      {member.firstName}
                    </Text>
                    <Text variant="h1" fontSize={20} lineHeight={20}>
                      {member.lastName}
                    </Text>
                    <Text variant="caption1" paddingTop={4}>
                      {member.email}
                    </Text>
                  </View>
                  <Row justifyContent="flex-end">
                    <IconButton
                      paddingRight={0}
                      paddingBottom={0}
                      onPress={() => navigation.navigate(homeRoutes.ProfileSettings)}
                    >
                      <SettingsIcon size={40} color={colors.white} />
                    </IconButton>
                  </Row>
                </View>
              </Row>
            </Section>

            <Line color={colors.darkBlue70} />
            <Section paddingVertical={28}>
              <Info label="COACHED BY" value={member.coach.fullName} />
              {member.club && (
                <Info label="CLUB" value={member.club.name} paddingTop={24} />
              )}
            </Section>

            {Boolean(member.goalSummary) && (
              <View>
                <Line color={colors.darkBlue70} />
                <Section paddingVertical={28}>
                  <Text variant="body2" paddingBottom={12}>
                    Goal
                  </Text>
                  <GoalText goalSummary={member.goalSummary} />
                </Section>
              </View>
            )}

            <Line color={colors.darkBlue70} />
            <Section paddingVertical={28}>
              {settings.map((setting, i) => (
                <SettingDropDown key={i} data={setting} curVal={getValue(setting.key)} />
              ))}
            </Section>
          </View>

          <View>
            <Line color={colors.darkBlue70} />
            <Section>
              <Row centerX>
                <TouchableOpacity
                  flexDirection="row"
                  alignSelf="flex-start"
                  onPress={() => navigation.navigate(homeRoutes.PrivacyScreen)}
                >
                  <Text variant="caption1" textDecorationLine="underline">
                    Privacy & Legal
                  </Text>
                </TouchableOpacity>
              </Row>

              <Row centerX>
                {version && (
                  <Text variant="caption2" paddingTop={8}>
                    V {version}
                  </Text>
                )}
              </Row>
            </Section>
          </View>
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

const enhance = compose(
  withProfileData,
  withErrorHandler,
  withLoader({
    color: colors.white50,
    backgroundColor: colors.blue8,
    operationName: ["MemberProfile", "allSettings"]
  }),
  withAnimation({ onMount: true }),
  withNavigation
)

export default enhance(Profile)
