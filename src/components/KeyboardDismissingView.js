import { Keyboard } from "react-native"
import { TouchableWithoutFeedback } from "glamorous-native"
import React from "react"

const KeyboardDismissingView = ({ children, ...rest }) => {
  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={Keyboard.dismiss}
      {...rest}
    >
      {children}
    </TouchableWithoutFeedback>
  )
}

export default KeyboardDismissingView
