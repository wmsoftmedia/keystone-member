import React from "react"
import styled from "glamorous-native"
import { defaultProps } from "recompose"

import colors from "colors"
import { NutritionIcon } from "scenes/Home/Icons"

const Container = styled.touchableOpacity({
  paddingTop: 2,
  paddingHorizontal: 5,
  alignItems: "center",
  justifyContent: "center"
})

const enhance = defaultProps({
  color: colors.white,
  size: 22
})

export default enhance(props => (
  <Container onPress={props.onPress}>
    <NutritionIcon size={props.size} color={props.color} />
  </Container>
))
