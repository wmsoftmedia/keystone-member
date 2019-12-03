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
import Switch from "kui/components/Switch"
import _ from "lodash/fp"
import colors from "kui/colors"
import * as shape from "d3-shape"

const RANGES = [7, 14, 30, 60]
const CHART_OFFSET_HACK = 6
const SKELETON_DATA = [
  { value: 4, date: moment().subtract(1, "days") },
  { value: 10 + CHART_OFFSET_HACK - 4, date: moment() }
]
const CONTENT_INSET = { top: 42, bottom: 0, left: -8, right: -8 }

const TrendChart = props => {
  const { selectedTrend, selectedRange = RANGES[0], onRangePress = x => x, data } = props

  const isEmpty = data.length === 0
  const rawData = [data[0], ...data, data[data.length - 1]]
  const hackedData = rawData.map(x => ({
    ...x,
    value: _.getOr(0, "value", x) + CHART_OFFSET_HACK
  }))
  const chartData = isEmpty ? SKELETON_DATA : hackedData
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
        yMax={10 + CHART_OFFSET_HACK}
      >
        <AreaGradient id={gradientId} isEmpty={isEmpty} />
        <AreaLine key={"line" + gradientId} stroke={strokeColor} />
        <AreaDecorator fill={strokeColor} />
        {!isEmpty && <AreaLabels valueOffset={-CHART_OFFSET_HACK} />}
      </AreaChart>
      {isEmpty && <AreaNoData top={CONTENT_INSET.top} bottom={CONTENT_INSET.bottom} />}
      <View bottom={20} left={20} right={20} position={"absolute"}>
        <Switch
          values={RANGES.map(r => r + " DAYS")}
          value={RANGES.findIndex(x => x === selectedRange)}
          onChange={i => onRangePress(RANGES[i])}
        />
      </View>
    </View>
  )
}

export default TrendChart
