import { Dimensions } from "react-native"
import { Path, Svg } from "react-native-svg"
import { View } from "glamorous-native"
import React from "react"

import colors from "../colors"
import { defaultProps } from "recompose"

const windowWidth = Dimensions.get("window").width

export const ARCH_HEIGHT = 24

export const ArchDown = () => {
  const height = ARCH_HEIGHT
  const width = windowWidth
  return (
    <View height={height}>
      <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={`
            M0,0
            C0,0
             ${width / 2},${height + 2}
             ${width},0
          `}
          fill={colors.blue6}
          strokeWidth={2}
          strokeOpacity={0.3}
          stroke={colors.black}
        />
      </Svg>
    </View>
  )
}

const enhanceArch = defaultProps({
  height: ARCH_HEIGHT,
  width: windowWidth,
  bottomColor: colors.blue7,
  topColor: colors.blue6,
  withOverlap: false
})

export const ArchUp = enhanceArch(
  ({ height, topColor, width, bottomColor, withOverlap }) => (
    <View height={height} marginTop={withOverlap ? -height : 0}>
      <Svg
        style={{ backgroundColor: topColor }}
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Path
          d={`
            M0,${height}
            C0,${height}
             ${width / 2},${-height / 2 - 2}
             ${width},${height}
          `}
          fill={bottomColor}
          strokeWidth={2}
          strokeOpacity={0.2}
          stroke={colors.black24}
        />
      </Svg>
    </View>
  )
)

export const ArchUpSection = props => {
  const height = ARCH_HEIGHT
  const width = windowWidth
  return (
    <View height={height} {...props}>
      <Svg
        style={{ backgroundColor: colors.transparent }}
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Path
          d={`
            M0,${height}
            C0,${height}
             ${width / 2},${-height / 2 - 2}
             ${width},${height}
          `}
          fill={colors.blue6}
          strokeWidth={2}
          strokeOpacity={0.2}
          stroke={colors.black24}
        />
      </Svg>
    </View>
  )
}

export const ArchUpFooter = props => {
  const height = ARCH_HEIGHT
  const width = windowWidth
  const {
    fill = colors.blue7,
    stroke = colors.black24,
    strokeOpacity = 0.2
  } = props
  return (
    <View height={height} {...props}>
      <Svg
        style={{ backgroundColor: colors.transparent }}
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Path
          d={`
            M0,${height}
            C0,${height}
             ${width / 2},${-height / 2 - 2}
             ${width},${height}
          `}
          fill={fill}
          strokeWidth={2}
          strokeOpacity={strokeOpacity}
          stroke={stroke}
        />
      </Svg>
    </View>
  )
}
