import React from "react"
import moment from "moment"
import styled from "glamorous-native"

import { Row } from "kui/components"
import Text from "kui/components/Text"
import colors from "kui/colors"

const weekDays = [0, 1, 2, 3, 4, 5, 6]

const Day = styled.view(
  {
    width: 42,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8
  },
  ({ included }) => ({
    backgroundColor: included ? colors.white05 : colors.transparent
  })
)

const Days = props => {
  const { days, ...rest } = props
  const isToday = day => moment().day() === day
  return (
    <Row spread {...rest}>
      {weekDays.map((day, i) => {
        const included = days.includes(day)
        return (
          <Day key={i} included={included} isToday={isToday(day)}>
            <Text variant="caption2" color={included ? colors.white : colors.white50}>
              {moment()
                .day(day)
                .format("ddd")
                .toUpperCase()}
            </Text>
          </Day>
        )
      })}
    </Row>
  )
}

export default Days
