import { TouchableOpacity, View } from "glamorous-native"
import { actions } from "react-redux-form/native"
import { compose, mapProps, withHandlers } from "recompose"
import { connect } from "react-redux"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"

import { FORM_NAME } from "scenes/Home/Feelings/Tracker/TrackerForm"
import colors from "kui/colors"

const SaveButton = props => {
  const { color = colors.white, feelings, onPress } = props
  const empty = feelings.every(f => f.value === 0 || f.value === "" || f.value === "0")
  return (
    <TouchableOpacity
      disabled={empty}
      onPress={onPress}
      marginRight={8}
      paddingHorizontal={8}
    >
      <View opacity={empty ? 0.5 : 1}>
        <Ionicons color={color} name={"ios-checkmark"} size={42} />
      </View>
    </TouchableOpacity>
  )
}

const mapStateToProps = state => {
  const { feelings } = state.formsRoot.feelingsTracker
  return { feelings }
}

const mapDispatchToProps = dispatch => ({
  saveJournal: () => dispatch(actions.submit(FORM_NAME))
})

const enhanced = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  mapProps(({ navigation, ...rest }) => ({
    goBack: () => navigation.goBack(null),
    ...rest
  })),
  withHandlers({
    onPress: props => () => {
      props.saveJournal()
      props.goBack()
    }
  })
)

export default enhanced(SaveButton)
