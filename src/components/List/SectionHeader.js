import React from "react"
import styled, { View } from "glamorous-native"

import { H4 } from "components/Typography"
import { Row } from "kui/components"
import colors from "colors"

const Container = styled(p => <View {...p} />)({
  flex: 1,
  paddingHorizontal: 20,
  paddingVertical: 10,
  justifyContent: "space-between",
  alignItems: "center"
})

const Left = styled(p => <View {...p} />)({ flex: 1 })
const Centre = styled.view({ flex: 1 })
const Right = styled(p => <View {...p} />)({ flex: 1, alignItems: "flex-end" })

const Label = styled(props => <H4 numberOfLines={2} {...props} />)({
  fontWeight: "600",
  color: colors.primary1
})

const SectionHeader = props => {
  const {
    labelLeft,
    labelRight,
    labelColor,
    renderLeft,
    renderCentre,
    renderRight,
    renderBottom,
    renderTop,
    leftProps,
    rightProps
  } = props
  return (
    <Container {...props}>
      {renderTop && renderTop()}
      <Row alignItems="center">
        <Left {...leftProps}>
          {renderLeft ? renderLeft() : <Label color={labelColor}>{labelLeft}</Label>}
        </Left>
        {renderCentre && <Centre>{renderCentre()}</Centre>}
        <Right {...rightProps}>
          {renderRight ? renderRight() : <Label color={labelColor}>{labelRight}</Label>}
        </Right>
      </Row>
      {renderBottom && renderBottom()}
    </Container>
  )
}

export const SectionHeaderLight = props => {
  return (
    <SectionHeader
      labelColor={colors.white}
      backgroundColor={colors.transparent}
      {...props}
    />
  )
}

export default SectionHeader
