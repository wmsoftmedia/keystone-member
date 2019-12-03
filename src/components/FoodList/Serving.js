import React from "react"
import styled, { Text } from "glamorous-native"

import { Row } from "kui/components"
import { round } from "keystone"
import colors from "kui/colors"

const Container = styled(Row)({
  paddingHorizontal: 10
})

const Label = styled(p => <Text {...p} ellipsizeMode={"tail"} />)({
  color: colors.white50,
  maxWidth: 200,
  fontSize: 12
})

const EntryServing = ({ serving, ...rest }) => (
  <Container {...rest}>
    <Label numberOfLines={1}>{`${round(serving.num * serving.volume)} ${
      serving.unit
    }`}</Label>
  </Container>
)

export default EntryServing
