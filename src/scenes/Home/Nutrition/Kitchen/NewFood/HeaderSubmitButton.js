import React from "react"
import { connect } from "react-redux"
import { compose, withHandlers } from "recompose"
import styled from "glamorous-native"

import colors from "colors"
import { getOr } from "keystone"
import { IosCheckmarkIcon } from "scenes/Home/Icons"
import { actions } from "react-redux-form/native"
import { FORM_NAME } from "./Form"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "flex-start"
})

const enhance = compose(
  connect(state => {
    const form = getOr({}, "formsRoot.forms.myFoodForm", state)
    const title = getOr("", "title.value", form)
    const hasTitle = !!title && title !== ""
    const hasServing = getOr("", "servingUnit.value", form) !== ""
    const servingSize = getOr("", "servingSize.value", form)
    const hasServingSize = servingSize !== "" && servingSize !== null
    return { isButtonAvailable: hasTitle && hasServing && hasServingSize }
  }),

  withHandlers({
    onPress: props => () => props.dispatch(actions.submit(FORM_NAME))
  })
)

export default enhance(props => (
  <Container onPress={props.onPress}>
    {props.isButtonAvailable && (
      <IosCheckmarkIcon color={colors.white} size={42} />
    )}
  </Container>
))
