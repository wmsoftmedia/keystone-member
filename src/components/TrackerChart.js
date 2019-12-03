import React from "react"
import { Circle, Text as SVGText } from "react-native-svg"
import { AreaChart, Path } from "react-native-svg-charts"
import * as shape from "d3-shape"
import { withProps, compose } from "recompose"

import colors from "colors"

const styles = {
  chart: { flex: 1 }
}

const enhance = compose(
  withProps(({ data }) => ({
    chartData: [data[0], ...data, data[data.length - 1]],
    isEmpty: data.length === 0
  }))
)

export default enhance(props => {
  const { chartData, isEmpty, valueExtractor, dateExtractor, valueKey } = props
  const strokeColor = isEmpty ? colors.blue5 : colors.white30
  const contentInset = {
    top: 32,
    bottom: 32,
    left: 0,
    right: 0
  }
  const Line = ({ line }) => {
    return (
      <Path
        key={"line"}
        d={line}
        stroke={strokeColor}
        strokeWidth={2}
        fill={"none"}
      />
    )
  }

  const Labels = ({ x, y, data }) =>
    data.map((datum, index) => {
      if (index === 0 || index === data.length - 1) {
        return null
      }
      const { value } = datum

      const formattedValue = valueExtractor(datum)
      const formattedDate = dateExtractor(datum)

      const offsetY = 16

      return [
        <SVGText
          key={`${index}-up`}
          x={x(index)}
          y={y(value) - offsetY}
          fontSize={16}
          fill={colors.white30}
          alignmentBaseline={"middle"}
          textAnchor={"middle"}
        >
          {formattedValue}
        </SVGText>,
        <SVGText
          key={`${index}-down`}
          x={x(index)}
          y={y(value) + offsetY}
          fontSize={12}
          fill={colors.white30}
          alignmentBaseline={"middle"}
          textAnchor={"middle"}
        >
          {formattedDate}
        </SVGText>
      ]
    })

  const Decorator = props => {
    const { x, y, data } = props
    return data.map(({ value }, index) => {
      if (index === 0 || index === data.length - 1) {
        return null
      }

      return (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={2}
          stroke={colors.white30}
          fill={strokeColor}
        />
      )
    })
  }

  return (
    <AreaChart
      style={styles.chart}
      data={chartData}
      contentInset={contentInset}
      svg={{ fill: colors.blue6 }}
      curve={shape.curveCardinal}
      yAccessor={({ item }) => item[valueKey]}
      xAccessor={({ index }) => index}
    >
      <Line />
      <Labels />
      <Decorator />
    </AreaChart>
  )
})
