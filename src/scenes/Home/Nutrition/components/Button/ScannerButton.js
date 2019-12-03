import { TouchableOpacity } from "glamorous-native"
import Icon from "react-native-vector-icons/Ionicons"
import React from "react"

import colors from "colors"

const ScannerButton = props => {
  return (
    <TouchableOpacity {...props}>
      <Icon name={"ios-barcode"} size={32} color={colors.white} />
    </TouchableOpacity>
  )
}

export default ScannerButton
