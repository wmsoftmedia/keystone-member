import React from "react"

import ListItem from "./ListItem"
import colors from "../../colors"

const bg = colors.black3
const fg = colors.black48
const hiBg = colors.black9
const heroBg = colors.white
const heroFg = colors.textLight
const iconFg = colors.textLight

export const ListItemLight = ({ styleOverrides, heroItem: hero, ...rest }) => (
  <ListItem
    styleOverrides={{
      container: props => ({
        backgroundColor: props.hi ? hiBg : hero ? heroBg : bg
      }),
      label: props => ({
        fontWeight: "600",
        color: props.hi || hero ? colors.textLight : fg
      }),
      arrow: props => ({
        backgroundColor: props.hi ? hiBg : hero ? heroBg : bg
      }),
      arrowIcon: props => ({
        color: props.hi ? iconFg : hero ? heroFg : fg
      }),
      ...styleOverrides
    }}
    {...rest}
  />
)

const ListItemWhite = ListItemLight

export default ListItemWhite
