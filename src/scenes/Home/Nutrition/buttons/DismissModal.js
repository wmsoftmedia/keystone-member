import React from "react"
import styled from "glamorous-native"
import { withNavigation } from "react-navigation"
import { branch, compose, defaultProps, withHandlers } from "recompose"

import colors from "colors"
import { BackIcon, DownIcon } from "scenes/Home/Icons"
import { confirm } from "native"

const Container = styled.touchableOpacity({
  padding: 10,
  paddingTop: 8,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center"
})

const DismissModal = ({ icon, color, onPress }) => {
  const Icon = icon === "back" ? BackIcon : DownIcon
  return (
    <Container onPress={onPress}>
      <Icon color={color} size={24} />
    </Container>
  )
}

const enhance = compose(
  branch(props => !props.navigation, withNavigation),
  defaultProps({
    withConfirmation: false,
    confirmationText: "Are you sure?",
    icon: "down",
    color: colors.white
  }),
  withHandlers({
    onPress: props => () => {
      if (!props.withConfirmation) {
        props.navigation.goBack(null)
      } else {
        confirm(() => props.navigation.goBack(null), props.confirmationText)
      }
    }
  })
)

export default enhance(DismissModal)
