import React from "react"
import styled, { TouchableOpacity, View } from "glamorous-native"

import _ from "lodash/fp"
import colors from "colors"

import { H4 } from "../Typography"
import Row from "../Row"

const Container = styled(p => <Row {...p} />)({
  justifyContent: "space-around"
})

const TouchableItem = styled(p => <TouchableOpacity {...p} />)(
  {
    flex: 1,
    height: 32,
    justifyContent: "center",
    alignItems: "center"
  },
  ({ selected, light }) => ({
    backgroundColor: selected
      ? light
        ? colors.white
        : colors.primary2
      : light
      ? colors.blue6
      : colors.blue6
  })
)

const ItemText = styled(H4)({}, ({ selected, light }) => ({
  opacity: selected ? 1 : 0.7,
  color: selected
    ? light
      ? colors.textLight
      : colors.white
    : light
    ? colors.white
    : colors.white
}))

const Switch = props => {
  const {
    values,
    selectedIndex,
    onChange,
    light = false,
    switchStyles = {},
    auxValues = []
  } = props

  return (
    <Container {...switchStyles.root}>
      {values.map((v, i) => {
        const selected = i === selectedIndex
        const styles = switchStyles
          ? selected
            ? switchStyles.active
            : switchStyles.inactive
          : null

        const bg = styles ? { ...styles.bg } : {}
        const fg = styles ? { ...styles.fg } : {}
        const fgView = styles ? { ...styles.fgView } : {}
        const text = _.isNumber(auxValues[i]) ? `${v} (${auxValues[i]})` : v

        return (
          <TouchableItem
            key={i}
            delayPressIn={0}
            delayPressOut={0}
            onPress={() => onChange(i)}
            activeOpacity={selected ? 1 : 0.8}
            selected={selected}
            light={light}
            {...bg}
          >
            <View {...fgView}>
              <ItemText selected={i === selectedIndex} light={light} {...fg}>
                {text}
              </ItemText>
            </View>
          </TouchableItem>
        )
      })}
    </Container>
  )
}

export default Switch
