import React from "react"
import styled, { Text, TouchableOpacity, View } from "glamorous-native"

import Row from "../Row"
import colors from "../../colors"

const Container = styled(Row)({
  alignItems: "center",
  justifyContent: "space-around"
})

const TouchableItem = styled(p => <TouchableOpacity {...p} />)({
  justifyContent: "center",
  alignItems: "center",
  padding: 16
})

const Button = styled(p => <View {...p} />)({}, ({ selected }) => ({
  backgroundColor: selected ? colors.white : "rgba(52,60,68,0.16)",
  padding: 8
}))

const ItemText = styled(p => <Text {...p} />)(
  { fontSize: 14 },
  ({ selected }) => ({
    color: selected ? colors.textLight : colors.white
  })
)

const IntervalSelector = props => {
  const { values, selectedIndex, onChange } = props

  return (
    <Container>
      {values.map((v, i) => {
        const selected = i === selectedIndex
        return (
          <TouchableItem
            key={i}
            delayPressIn={0}
            delayPressOut={0}
            onPress={() => onChange(i)}
            activeOpacity={1}
            selected={selected}
          >
            <Button selected={selected}>
              <ItemText selected={selected}>{v}</ItemText>
            </Button>
          </TouchableItem>
        )
      })}
    </Container>
  )
}

export default IntervalSelector
