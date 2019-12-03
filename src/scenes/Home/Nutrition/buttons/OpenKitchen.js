import React from "react"
import styled from "glamorous-native"
import { defaultProps } from "recompose"

import colors from "colors"
import { ChefHatIcon } from "scenes/Home/Icons"

const Container = styled.touchableOpacity({
  paddingHorizontal: 10,
  alignItems: "center",
  justifyContent: "center",
  padding: 3.5
})

const enhance = defaultProps({
  color: colors.white,
  size: 20
})

export default enhance(props => (
  <Container onPress={props.onPress}>
    <ChefHatIcon size={props.size} color={props.color} />
  </Container>
))
