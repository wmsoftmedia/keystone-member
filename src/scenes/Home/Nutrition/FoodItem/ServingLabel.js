import { compose, pure, withProps } from "recompose"
import React from "react"
import styled, { Text } from "glamorous-native"

import { Row } from "kui/components"
import { round } from "keystone"
import _ from "lodash/fp"
import colors from "kui/colors"

const Label = styled(p => <Text {...p} ellipsizeMode={"tail"} />)({
  color: colors.white50,
  maxWidth: 200,
  fontSize: 12
})

const ServingLabel = ({ label }) => (
  <Row>
    <Label numberOfLines={1}>{label}</Label>
  </Row>
)

const enhance = compose(
  withProps(({ item }) => {
    const label = servingLabelFromItem(item)
    return { label }
  }),
  pure
)

export const servingLabelFromItem = item => {
  const { servingUnit, servingAmount, serving: s } = item
  if (s && s.num && s.volume && s.unit) {
    return `${round(s.num * s.volume)} ${s.unit}`
  }

  if (
    !item ||
    !item.servings ||
    item.servings.length === 0 ||
    !servingUnit ||
    !servingAmount
  ) {
    return null
  }
  const maybeServing = item.servings.find(s => s.description === servingUnit)
  const serving = maybeServing || _.getOr(null, "servings[0]", item)
  const normalizedServing =
    serving &&
    serving.amount &&
    serving.amount !== "" &&
    servingAmount &&
    serving.unit &&
    servingUnit
      ? `${round(serving.amount * servingAmount)} ${serving.unit}`
      : null
  return normalizedServing
}

export default enhance(ServingLabel)
