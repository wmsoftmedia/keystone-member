import { View } from "glamorous-native"
import { withNavigation } from "react-navigation"
import React from "react"

import Link from "components/Button/Link"
import colors from "kui/colors"

export const ReportLink = withNavigation(props => {
  const memberPortal = "https://app.keystone.fit/"
  const uri = `${memberPortal}insights?token=${props.token}&mobile=true`

  return (
    <View alignSelf={"flex-start"}>
      <Link
        label={"Open Report"}
        borderBottomWidth={1}
        borderBottomColor={colors.white70}
        color={colors.white70}
        labelProps={{ fontSize: 14 }}
        onPress={() =>
          props.navigation.navigate({
            routeName: "ReportScreen",
            key: "ReportScreen",
            params: { uri }
          })
        }
      />
    </View>
  )
})
