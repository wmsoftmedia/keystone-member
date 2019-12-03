import { View } from "glamorous-native"
import React from "react"

import PropTypes from "prop-types"

import colors from "../../colors"

const ListItemSeparator = ({ height, color }) => (
  <View height={height} backgroundColor={color} />
)

ListItemSeparator.defaultProps = {
  height: 1,
  color: colors.listItemSeparator
}

ListItemSeparator.propTypes = {
  height: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

export const ListItemSeparatorTeal = props => (
  <ListItemSeparator height={2} color={colors.black06} {...props} />
)

export const ListItemSeparatorLight = props => (
  <ListItemSeparator height={2} color={colors.black6} {...props} />
)

export default ListItemSeparator
