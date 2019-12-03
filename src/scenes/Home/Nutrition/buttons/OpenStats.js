import { defaultProps } from "recompose"
import React from "react"
import styled from "glamorous-native"

import { StatsIcon } from "../../Icons"
import colors from "../../../../colors"

const Container = styled.touchableOpacity({
  paddingTop: 4,
  paddingHorizontal: 10,
  alignItems: "center",
  justifyContent: "center"
})

const OpenStats = ({ color = colors.white, onPress }) => {
  return (
    <Container onPress={onPress}>
      <StatsIcon size={24} color={color} />
    </Container>
  )
}

const enhance = defaultProps({
  color: colors.white,
  size: 24
})

export default enhance(OpenStats)
