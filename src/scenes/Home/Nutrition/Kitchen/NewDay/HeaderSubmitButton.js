// packages
import { actions } from "react-redux-form/native"
import { connect } from "react-redux"
import React from "react"
import styled from "glamorous-native"

import { IosCheckmarkIcon } from "scenes/Home/Icons"
import { KITCHEN_DAY_FORM } from "constants"
import { trim } from "keystone"
import _ from "lodash/fp"
import colors from "kui/colors"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "flex-start"
})

const readState = state => (key, defaultVal) =>
  _.getOr(defaultVal, `app.kitchenDay.${key}`, state)

const enhance = connect(
  state => {
    const get = readState(state)
    const isLoading = get("isLoading", false)
    const isError = get("isError", null)
    const name = trim(_.getOr("", `${KITCHEN_DAY_FORM}.name`, state))
    const meals = _.getOr([], `${KITCHEN_DAY_FORM}.meals`, state)
    const hasNonemptyMeal = meals.some(m => (m.items || []).length > 0)
    return {
      isButtonAvailable: !isLoading && !isError && !!name && hasNonemptyMeal
    }
  },
  dispatch => ({
    onPress: () => dispatch(actions.submit(KITCHEN_DAY_FORM))
  })
)

const SaveTracker = ({ onPress, isButtonAvailable }) => (
  <Container onPress={onPress}>
    {isButtonAvailable && <IosCheckmarkIcon color={colors.white} size={42} />}
  </Container>
)

export default enhance(SaveTracker)
