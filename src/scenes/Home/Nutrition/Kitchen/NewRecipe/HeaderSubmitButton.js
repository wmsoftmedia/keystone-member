// packages
import React from "react"
import { actions } from "react-redux-form/native"
import { connect } from "react-redux"
import styled from "glamorous-native"
// project components
import { getOr, trim } from "keystone"
import colors from "colors"
import { IosCheckmarkIcon } from "scenes/Home/Icons"
import { FORM_NAME } from "./RecipeScreen"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "flex-start"
})

const readState = state => (key, defaultVal) =>
  getOr(defaultVal, `app.kitchenRecipe.${key}`, state)

const enhance = connect(
  state => {
    const get = readState(state)
    const isLoading = get("isLoading", false)
    const isError = get("isError", null)
    const name = trim(getOr("", `${FORM_NAME}.name`, state))
    const ingredients = getOr([], `${FORM_NAME}.ingredients`, state)
    return {
      isButtonAvailable:
        !isLoading && !isError && !!name && ingredients.length > 0
    }
  },
  dispatch => ({
    onPress: () => dispatch(actions.submit(FORM_NAME))
  })
)

const SaveTracker = ({ onPress, isButtonAvailable }) => (
  <Container onPress={onPress}>
    {isButtonAvailable && <IosCheckmarkIcon color={colors.white} size={42} />}
  </Container>
)

export default enhance(SaveTracker)
