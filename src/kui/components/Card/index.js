import { defaultProps } from "recompose"
import React from "react"
import styled, { Text, View } from "glamorous-native"

import Row from "components/Row"
import colors from "kui/colors"
import fonts from "kui/fonts"

const boxShadow = {
  shadowOpacity: 0.7,
  shadowColor: colors.black,
  shadowOffset: { width: 10, height: 10 },
  shadowRadius: 30
}

const Root = styled(p => <View {...p} />)(
  {
    flex: 1
  },
  ({ color, elevated }) => ({
    backgroundColor: color,
    ...boxShadow,
    shadowRadius: elevated ? 30 : 0,
    shadowColor: elevated ? "rgba(1, 27, 51, 0.5)" : colors.transparent,
    borderRadius: 12
  })
)

const Card = defaultProps({ elevated: true })(props => {
  const { children, ...rest } = props
  return <Root {...rest}>{children}</Root>
})

export default Card

// -- Variations of a card

export const DashboardCard = props => {
  const { children, title, renderAction, ...rest } = props
  return (
    <Card {...rest}>
      <Row
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        padding={10}
        paddingBottom={0}
      >
        <Text
          color={colors.white}
          fontFamily={fonts.montserratSemiBold}
          fontSize={18}
          padding={10}
          lineHeight={28}
        >
          {title}
        </Text>
        {renderAction && renderAction()}
      </Row>
      {children}
    </Card>
  )
}
