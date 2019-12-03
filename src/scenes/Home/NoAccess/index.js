import { View } from "glamorous-native"
import { compose, withProps } from "recompose"
import React from "react"

import { AccountDisabledIcon } from "scenes/Home/Icons"
import { Screen } from "components/Background"
import CenterView from "components/CenterView"
import Splash from "components/Splash"
import Text from "kui/components/Text"
import colors from "colors"
import withAccountStatus from "hoc/withAccountStatus"

const NoAccess = compose(
  withProps(() => {
    const options = {
      fetchPolicy: "network-only",
      pollInterval: 5000
    }
    return { options }
  }),
  withAccountStatus
)(() => {
  return (
    <Screen>
      <Splash hideLogo message={null} />
      <CenterView marginTop={-40} position="absolute" width="100%" height="100%" flex={1}>
        <View paddingBottom={16}>
          <AccountDisabledIcon size={92} color={colors.white10} />
        </View>
        <Text fontSize={18} color={colors.white}>
          Your account has been frozen.
        </Text>
        <Text fontSize={16} color={colors.white50}>
          Please contact your coach
        </Text>
        <Text fontSize={16} color={colors.white50}>
          for more details.
        </Text>
      </CenterView>
    </Screen>
  )
})

export default NoAccess
