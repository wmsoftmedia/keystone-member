import { AreaChart } from "react-native-svg-charts"
import { View } from "glamorous-native"
import React from "react"
import moment from "moment"

import {
  AreaDecorator,
  AreaGradient,
  AreaLabels,
  AreaLine,
  AreaNoData
} from "components/Chart"

import colors from "kui/colors"
import * as shape from "d3-shape"

const CONTENT_INSET = { top: 42, bottom: 0, left: -8, right: -8 }
const SKELETON_DATA = [
  { value: 2, date: moment().subtract(1, "days") },
  { value: 10, date: moment() }
]

const TrendChart = props => {
  const { selectedTrend, data } = props

  const isEmpty = data.length === 0
  const rawData = [data[0], ...data, data[data.length - 1]]
  const chartData = isEmpty ? SKELETON_DATA : rawData
  const gradientId = "gradient-" + String(selectedTrend)
  const strokeColor = isEmpty ? colors.white10 : colors.white30

  return (
    <View flex={1}>
      <AreaChart
        style={{ flex: 1 }}
        data={chartData}
        contentInset={CONTENT_INSET}
        svg={{ fill: `url(#${gradientId})` }}
        curve={shape.curveCardinal}
        yAccessor={({ item }) => item.value}
        xAccessor={({ index }) => index}
        yMin={0}
        yMax={isEmpty ? 12 : undefined}
      >
        <AreaGradient id={gradientId} isEmpty={isEmpty} />
        <AreaLine stroke={strokeColor} key={"line" + gradientId} />
        <AreaDecorator fill={strokeColor} />
        {!isEmpty && <AreaLabels />}
      </AreaChart>
      {isEmpty && <AreaNoData top={CONTENT_INSET.top} bottom={CONTENT_INSET.bottom} />}
    </View>
  )
}

export default TrendChart
