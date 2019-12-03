import { compose, withProps } from "recompose"
import React from "react"

import { sourceToColor } from "scenes/Home/NutritionJournal/journal"
import Label from "kui/components/Label"

const SourceBadge = ({ label, color, ...rest }) => {
  return <Label minWidth={36} text={label} backgroundColor={color} {...rest} />
}

const enhanceBadge = compose(
  withProps(({ label, color, source = "" }) => ({
    color: !color ? sourceToColor(source) : color,
    label: !label ? (!source ? "" : source[0].toUpperCase()) : label
  }))
)

export default enhanceBadge(SourceBadge)
