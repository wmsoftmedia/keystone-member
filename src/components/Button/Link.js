import React from "react"
import styled, { Text, TouchableOpacity } from "glamorous-native"

import { fontM } from "../Typography"
import { scaleFont } from "../../scalingUnits"
import colors from "../../colors"

const Label = styled(p => <Text {...p} />)(
  {
    fontSize: scaleFont(fontM),
    fontWeight: "600"
  },
  ({ color = colors.white }) => ({ color: color })
)

const LinkButton = props => {
  const { label, color, labelProps, ...rest } = props
  return (
    <TouchableOpacity {...rest}>
      <Label color={color} {...labelProps}>
        {label}
      </Label>
    </TouchableOpacity>
  )
}

export default LinkButton
