import { TouchableOpacity } from "glamorous-native"
import React from "react"

import { AddIcon } from "kui/icons"

const AddButton = props => {
  return (
    <TouchableOpacity {...props}>
      <AddIcon size={40} />
    </TouchableOpacity>
  )
}

export default AddButton
