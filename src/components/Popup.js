import React from "react"
import { View, Modal, StyleSheet, TouchableWithoutFeedback } from "react-native"

import colors from "../colors"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  backdrop: {
    position: "absolute",
    backgroundColor: colors.black,
    opacity: 0.7,
    flex: 1,
    width: "100%",
    height: "100%"
  }
})

const Popup = ({
  visible = true,
  content,
  animationType = "fade",
  onRequestClose = () => ({}),
  onBackdropPress = () => ({}),
  backdropStyles = {},
  ...rest
}) => (
  <Modal
    animationType={animationType}
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
    {...rest}
  >
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onBackdropPress}>
        <View style={[styles.backdrop, backdropStyles]} />
      </TouchableWithoutFeedback>
      {content}
    </View>
  </Modal>
)

export default Popup
