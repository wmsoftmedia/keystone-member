import { View } from "glamorous-native"
import React from "react"

import { PrimaryButton, SecondaryButton } from "kui/components/Button"
import colors from "kui/colors"

const Footer = props => {
  return (
    <View paddingHorizontal={20} paddingVertical={10}>
      <PrimaryButton
        onPress={props.onComplit}
        backgroundColor={colors.white}
        label={props.isLast ? "MARK AS DONE & FINISH SET" : "MARK AS DONE & MOVE ON"}
        labelProps={{ color: colors.blue60 }}
      />
      <SecondaryButton
        marginTop={12}
        onPress={props.onBack}
        label="STOP AND RETURN TO THE LIST"
        alignItems="center"
        justifyContent="center"
        labelProps={{ color: colors.white60 }}
      />
    </View>
  )
}

export default Footer
