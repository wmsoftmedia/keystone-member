import React from "react"
import PropTypes from "prop-types"
import { ActivityIndicator } from "react-native"
import { connect } from "react-redux"
import { actions } from "react-redux-form/lib/native"
import {
  compose,
  withHandlers,
  setPropTypes,
  setDisplayName,
  defaultProps,
  withProps
} from "recompose"
import styled from "glamorous-native"

import colors from "colors"
import { IosCheckCircleIcon, IosCheckmarkIcon } from "scenes/Home/Icons"
import withNavigation from "react-navigation/src/views/withNavigation"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "flex-start"
})

const SaveTracker = ({ onPress, color, status, redirect }) => {
  if (status === "success") redirect()

  return (
    <Container onPress={onPress}>
      {status === "submitting" && (
        <ActivityIndicator color={color} size={"small"} />
      )}
      {status === "success" && <IosCheckCircleIcon color={color} size={32} />}
      {status === "dirty" && <IosCheckmarkIcon color={color} size={42} />}
    </Container>
  )
}

const enhance = compose(
  setPropTypes({
    mutation: PropTypes.string.isRequired
  }),
  // connect((state, props) => {
  //   const form = state.formsRoot.forms[props.formName].$form
  //   const status = form.submitted ? "success" : "dirty"
  //   return { status }
  // }),
  withNavigation,
  withProps({
    status: "x"
  }),
  withHandlers({
    onPress: props => () =>
      props.status === "dirty" &&
      props.dispatch(actions.submit(props.formName)),
    redirect: props => () => props.navigation.goBack(null)
  }),
  defaultProps({
    color: colors.white
  }),
  setDisplayName("HeaderSubmit")
)

export default enhance(SaveTracker)
