import { ActivityIndicator } from "react-native"
import { connect } from "react-redux"
import { hasSubmitSucceeded, isSubmitting, submit } from "redux-form"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"
import styled from "glamorous-native"

import colors from "../../../../colors"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "flex-start"
})

const SaveTracker = ({
  onPress,
  color = colors.white,
  submitting,
  succeeded
}) => {
  return (
    <Container onPress={onPress}>
      {submitting ? (
        <ActivityIndicator color={colors.white} size={"small"} />
      ) : succeeded ? (
        <Ionicons color={color} name={"ios-checkmark-circle"} size={32} />
      ) : (
        <Ionicons color={color} name={"ios-checkmark"} size={42} />
      )}
    </Container>
  )
}

const FORM_NAME = "nutritionTrackerForm"

const mapStateToProps = state => {
  const submitting = isSubmitting(FORM_NAME)(state)
  const succeeded = hasSubmitSucceeded(FORM_NAME)(state)
  return {
    submitting,
    succeeded
  }
}

const mapDispatchToProps = dispatch => ({
  onPress: () => dispatch(submit(FORM_NAME))
})

export default connect(mapStateToProps, mapDispatchToProps)(SaveTracker)
