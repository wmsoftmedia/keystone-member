import { Text } from "glamorous-native"
import React from "react"

import IconButton from "./Icon"
import colors from "../../colors"

const SmallButton = ({ title, titleProps, iconName, ...rest }) => {
  return (
    <IconButton name={iconName} {...rest}>
      <Text
        fontSize={18}
        color={colors.textLight}
        fontWeight={"700"}
        {...titleProps}
      >
        {title}
      </Text>
    </IconButton>
  )
}

SmallButton.defaultProps = {
  paddingLeft: 0,
  paddingRight: 12,
  height: 28,
  underlayColor: colors.black6,
  delayLongPress: 0,
  delayPressIn: 0
}

export default SmallButton

// -------------------------- Variations ------------------------

const SmallButtonAdd = props => (
  <SmallButton
    iconName={"add"}
    size={24}
    backgroundColor={"transparent"}
    color={colors.primary2}
    {...props}
  />
)

export { SmallButtonAdd }
