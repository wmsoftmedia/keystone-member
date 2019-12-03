import { Circle, LinearGradient, Path, Stop, Text } from "react-native-svg"
import { View } from "glamorous-native"
import React from "react"
import moment from "moment"
import numeral from "numeral"

import { NoDataIcon } from "scenes/Home/Icons"
import colors, { gradients } from "kui/colors"

export const AreaLabels = ({ valueOffset = 0, x, y, data, format = "0.[0]" }) =>
  data.map((datum, index) => {
    const { value, date } = datum

    if (index !== 1 && index !== data.length - 2) {
      return null
    }
    const formattedValue = numeral(value + valueOffset).format(format)
    return (
      <Text
        key={index}
        x={x(index)}
        y={y(value) - 12}
        fontSize={15}
        lineHeight={16}
        fill={colors.white}
        alignmentBaseline={"middle"}
        textAnchor={"middle"}
      >
        {formattedValue}
        <Text fontSize={10} fill={colors.white50} x={x(index)} y={y(value) + 24}>
          {moment(date).format("D/MM")}
        </Text>
      </Text>
    )
  })

export const AreaDecorator = props => {
  const { x, y, data, fill } = props
  return data.map((datum, index) => {
    const { value } = datum
    if (index !== 1 && index !== data.length - 2) {
      return null
    }

    return (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value)}
        r={2}
        stroke={colors.white}
        fill={fill}
      />
    )
  })
}

export const AreaGradient = ({ isEmpty = false, id }) => {
  return (
    <LinearGradient id={id} x1={"20%"} y={"0%"} x2={"0%"} y2={"100%"}>
      <Stop
        offset={"0%"}
        stopColor={gradients.chartLight[0]}
        stopOpacity={isEmpty ? 0.1 : 0.5}
      />
      <Stop
        offset={"100%"}
        stopColor={gradients.chartLight[1]}
        stopOpacity={isEmpty ? 0.1 : 0.5}
      />
    </LinearGradient>
  )
}

export const AreaLine = ({ line, ...rest }) => (
  <Path d={line} strokeWidth={2} fill={"none"} {...rest} />
)

export const AreaNoData = ({ top = 0, bottom = 0 }) => (
  <View
    position="absolute"
    alignItems="center"
    justifyContent="center"
    left={0}
    right={0}
    top={top}
    bottom={bottom}
    flex={1}
    opacity={1}
  >
    <NoDataIcon size={124} color={colors.white10} />
  </View>
)
