import { ActivityIndicator } from "react-native"
import { actions } from "react-redux-form/native"
import { connect } from "react-redux"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"
import styled from "glamorous-native"

import { FORM_NAME } from "./EntryForm"
import colors from "../../../../colors"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "flex-start"
})

const SaveButton = ({
  onPress,
  color = colors.white,
  submitting,
  succeeded,
  disabled = false
}) => {
  return (
    <Container onPress={onPress} disabled={disabled}>
      {!disabled &&
        (submitting ? (
          <ActivityIndicator color={color} size={"small"} />
        ) : succeeded ? (
          <Ionicons color={color} name={"ios-checkmark-circle"} size={32} />
        ) : (
          <Ionicons color={color} name={"ios-checkmark"} size={42} />
        ))}
    </Container>
  )
}

const mapStateToProps = state => {
  //const submitting = isSubmitting(FORM_NAME)(state)
  //const succeeded = hasSubmitSucceeded(FORM_NAME)(state)
  return {
    //submitting,
    //succeeded,
    disabled: false //foodEntryTabs[state.ui.switches.foodEntry || 0] !== "MY FOOD"
  }
}

const mapDispatchToProps = dispatch => ({
  onPress: () => dispatch(actions.submit(FORM_NAME))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveButton)
