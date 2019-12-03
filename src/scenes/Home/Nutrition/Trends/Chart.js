import { BarChart, XAxis, YAxis } from "react-native-svg-charts"
import { Defs, LinearGradient, Stop } from "react-native-svg"
import { StyleSheet } from "react-native"
import { View } from "glamorous-native"
import React from "react"
import moment from "moment"
import numeral from "numeral"

import { NoDataIcon } from "scenes/Home/Icons"
import { Row } from "kui/components"
import { Switch } from "kui/components/Switch"
import _ from "lodash/fp"
import colors from "kui/colors"
import fonts from "kui/fonts"
import * as scale from "d3-scale"

const RANGES = [{ key: 1, label: "LAST WEEK" }, { key: 0, label: "THIS WEEK" }]

const SKELETON_DATA = [
  { value: 4, date: moment().subtract(5, "days") },
  { value: 5, date: moment().subtract(4, "days") },
  { value: 8, date: moment().subtract(3, "days") },
  { value: 6, date: moment().subtract(2, "days") },
  { value: 7, date: moment().subtract(1, "days") },
  { value: 10, date: moment() }
]

const INSET_TOP = 0
const INSET_BOTTOM = 72 + 34
const contentInset = { top: 8, bottom: 0, left: 16, right: 0 }
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const BAR_SPACING = 0.4

const BarGradient = () => (
  <Defs key={"gradient"}>
    <LinearGradient id={"gradient"} x1={"10%"} y={"0%"} x2={"0%"} y2={"100%"}>
      <Stop offset={"0%"} stopColor={"#03A9F4"} />
      <Stop offset={"100%"} stopColor={"#C931E3"} />
    </LinearGradient>
  </Defs>
)

const TrendChart = props => {
  const { selectedRange = RANGES[0].key, onRangePress = x => x, data } = props

  const isEmpty = data.length === 0
  const chartData = isEmpty ? SKELETON_DATA : data

  const maxByValue = _.maxBy("value", chartData)
  const maxByGoal = _.maxBy("goal", chartData)
  const gridMax = _.ceil(
    Math.max(_.getOr(0, "value", maxByValue), _.getOr(0, "goal", maxByGoal))
  )

  return (
    <View flex={1}>
      <Row flex={1} flexDirection="row">
        <View flex={1}>
          <View flex={1}>
            <BarChart
              animate
              style={StyleSheet.absoluteFill}
              data={chartData}
              svg={{ fill: "url(#gradient)" }}
              yAccessor={({ item }) => item.value}
              xAccessor={({ index }) => index}
              contentInset={contentInset}
              gridMin={0}
              gridMax={gridMax}
              spacingInner={BAR_SPACING}
            >
              <BarGradient />
            </BarChart>
            <BarChart
              animate
              style={StyleSheet.absoluteFill}
              data={chartData}
              svg={{
                fill: colors.white05,
                stroke: colors.white10,
                strokeWidth: 1
              }}
              yAccessor={({ item }) => item.goal}
              xAccessor={({ index }) => index}
              contentInset={contentInset}
              gridMin={0}
              gridMax={gridMax}
              spacingInner={BAR_SPACING}
            />
          </View>
          <XAxis
            data={data}
            xAccessor={({ index }) => index}
            svg={{
              fontSize: 10,
              lineHeight: 16,
              fill: colors.darkBlue10
            }}
            spacingInner={BAR_SPACING}
            style={{ paddingTop: 8 }}
            scale={scale.scaleBand}
            contentInset={contentInset}
            formatLabel={i => DAYS[i]}
          />
        </View>
        <YAxis
          min={0}
          max={gridMax}
          numberOfTicks={5}
          style={{ minWidth: 48, marginBottom: 20, paddingHorizontal: 4 }}
          data={chartData}
          yAccessor={({ item }) => item.value}
          svg={{
            fontSize: 12,
            lineHeight: 16,
            fill: colors.darkBlue10
          }}
          contentInset={{ top: 8, bottom: 20 }}
          formatLabel={v => numeral(v).format("0,0")}
        />
      </Row>
      {isEmpty && (
        <View
          position="absolute"
          alignItems="center"
          justifyContent="center"
          left={0}
          right={0}
          top={INSET_TOP}
          bottom={INSET_BOTTOM}
          flex={1}
          opacity={1}
        >
          <NoDataIcon size={124} color={colors.white10} />
        </View>
      )}
      <View paddingHorizontal={20} paddingBottom={28} paddingTop={15}>
        <Switch
          values={RANGES.map(r => r.label)}
          value={RANGES.findIndex(x => x.key === selectedRange)}
          onChange={i => onRangePress(RANGES[i].key)}
        />
      </View>
    </View>
  )
}

export default TrendChart
