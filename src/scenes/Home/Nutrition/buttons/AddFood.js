import React from "react"
import { Text, TouchableOpacity } from "glamorous-native"
import { defaultProps, compose } from "recompose"

import colors from "colors"
import { AddFoodIcon } from "scenes/Home/Icons"

const enhance = compose(
  defaultProps({
    withLabel: false,
    color: colors.primary5
  })
)

export default enhance(props => (
  <TouchableOpacity {...props}>
    <AddFoodIcon size={25} color={props.color} />
    {props.withLabel && <Text color={props.color}>Add Food</Text>}
  </TouchableOpacity>
))
