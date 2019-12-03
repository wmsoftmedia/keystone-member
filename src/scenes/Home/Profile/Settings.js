import { TouchableOpacity } from "glamorous-native"
import { compose } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"

import { feetToFtIn } from "keystone"
import { ChevronRightIcon } from "kui/icons"
import { DATE_FORMAT_DISPLAY } from "keystone/constants"
import { SETTINGS } from "scenes/Home/Profile/SettingsForm"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { homeRoutes as r } from "navigation/routes"
import { withLoader, withSettings } from "hoc"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withProfileData from "graphql/query/member/profileData"

const Settings = ({ data, heightUnit, heightConverter }) => {
  const member = data.member

  const ftIn =
    heightUnit === "feet" ? feetToFtIn(heightConverter(member.height), true) : {}

  return (
    <Screen>
      <SettingsRow
        label="Name"
        value={member.fullName}
        form={SETTINGS.NAME}
        member={member}
      />
      <Line color={colors.darkBlue80} />
      <SettingsRow
        label="Gender"
        value={member.gender}
        form={SETTINGS.GENDER}
        member={member}
      />
      <Line color={colors.darkBlue80} />
      <SettingsRow
        label="Date of Birth"
        value={
          member.dateOfBirth ? moment(member.dateOfBirth).format(DATE_FORMAT_DISPLAY) : ""
        }
        form={SETTINGS.DATE_OF_BIRTH}
        member={member}
      />
      <Line color={colors.darkBlue80} />
      <SettingsRow
        label="Goal"
        value={member.goal}
        form={SETTINGS.GOAL}
        member={member}
      />
      <Line color={colors.darkBlue80} />
      {heightUnit === "feet" ? (
        <SettingsRow
          label="Body Height"
          value={(ftIn.ft ? ftIn.ft + " ft " : "") + (ftIn.in ? ftIn.in + " in" : "")}
          form={SETTINGS.HEIGHT}
          member={member}
        />
      ) : (
        <SettingsRow
          label="Body Height"
          value={member.height ? heightConverter(member.height) + " " + heightUnit : ""}
          form={SETTINGS.HEIGHT}
          member={member}
        />
      )}
    </Screen>
  )
}

const SettingsRow = withNavigation(({ label, value, form, member, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(r.ProfileSettingsForm, {
          title: label,
          form,
          member
        })
      }
    >
      <Row paddingHorizontal={20} paddingVertical={16} spread centerY>
        <Text variant="body1" paddingBottom={3}>
          {label}
        </Text>
        <Row flex={0.9} justifyContent="flex-end" centerY>
          <Text variant="body2" paddingRight={4}>
            {value}
          </Text>
          <ChevronRightIcon size={20} color={colors.darkBlue40} />
        </Row>
      </Row>
    </TouchableOpacity>
  )
})

const enhance = compose(
  withSettings,
  withProfileData,
  withLoader({
    color: colors.white50,
    backgroundColor: colors.blue8,
    operationName: ["MemberProfile", "allSettings"]
  })
)

export default enhance(Settings)
