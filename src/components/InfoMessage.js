import React from "react"

import CenterView from "components/CenterView"
import Text from "kui/components/Text"
import colors from "kui/colors"

const InfoMessage = ({ title, subtitle, titleProps, subtitleProps, ...rest }) => (
  <CenterView flex={1} padding={20} {...rest}>
    <Text variant="body1" {...titleProps}>
      {title}
    </Text>
    {subtitle && (
      <Text
        textAlign="center"
        paddingHorizontal={20}
        variant="caption1"
        color={colors.darkBlue30}
        {...subtitleProps}
      >
        {subtitle}
      </Text>
    )}
  </CenterView>
)

export default InfoMessage
