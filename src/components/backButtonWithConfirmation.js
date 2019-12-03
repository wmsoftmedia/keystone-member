import { TouchableOpacity, StyleSheet } from "react-native"
import { connect } from "react-redux"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"

import HardwareBackButton from "./HardwareBackButton"
import colors from "../colors"

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    paddingHorizontal: 8
  }
})

const BackButton = ({ goBack, confirmGoBack, isDirty }) => {
  return (
    <HardwareBackButton
      onBackPress={() => {
        if (isDirty) {
          confirmGoBack()
        } else {
          goBack()
        }
        return true
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (isDirty) confirmGoBack()
          else goBack()
        }}
      >
        <Ionicons
          color={colors.white}
          style={styles.container}
          name={"ios-arrow-back"}
          size={32}
        />
      </TouchableOpacity>
    </HardwareBackButton>
  )
}

const mapStateToProps = formName => state => {
  const isDirty = !state.formsRoot.forms[formName].$form.pristine
  return { isDirty }
}

export default formName => connect(mapStateToProps(formName))(BackButton)
