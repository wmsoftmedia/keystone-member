import React from "react"

import { IconButton } from "kui/components/Button"
import { TrashIcon } from "kui/icons"
import colors from "kui/colors"

const DeleteMealButton = props => (
  <IconButton {...props}>
    <TrashIcon size={24} color={colors.darkBlue30} />
  </IconButton>
)

export default DeleteMealButton
