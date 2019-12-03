import { BarChart, LineChart, XAxis, YAxis } from "react-native-svg-charts"
import { Defs, LinearGradient, Stop, Text } from "react-native-svg"
import { StyleSheet } from "react-native"
import { View } from "glamorous-native"
import { compose, withState } from "recompose"
import React from "react"
import moment from "moment"
import numeral from "numeral"

import { NoDataIcon } from "scenes/Home/Icons"
import { Row } from "kui/components"
import { STEP_GOAL } from "components/Steps"
import { Switch } from "kui/components/Switch"
import colors from "kui/colors"
import fonts from "kui/fonts"
import * as scale from "d3-scale"

const Gradient = ({ id, color1, color2, opacity = "1" }) => (
  <Defs key={id}>
    <LinearGradient id={id} x1={"10%"} y={"0%"} x2={"0%"} y2={"100%"}>
      <Stop offset={"0%"} stopColor={color1} stopOpacity={opacity} />
      <Stop offset={"100%"} stopColor={color2} stopOpacity={opacity} />
    </LinearGradient>
  </Defs>
)

const BarGradient = () => (
  <Gradient
    id="gradient"
    color1={colors.darkBlue80}
    color2={colors.violet50}
    opacity="0.5"
  />
)

const SelectedGradient = () => (
  <Gradient id="selectedgradient" color1={colors.darkBlue80} color2={colors.violet50} />
)

const GoalGradient = () => (
  <Gradient
    id="goalgradient"
    color1={colors.green50}
    color2={colors.violet50}
    opacity="0.5"
  />
)

const SelectedGoalGradient = () => (
  <Gradient id="selectedgoalgradient" color1={colors.green50} color2={colors.violet50} />
)

export const BarLabel = ({ x, y, data, format = "0,000", selectedBar, bandwidth }) =>
  data.map((datum, index) => {
    const { value, date } = datum

    if (date !== selectedBar) {
      return null
    }

    const formattedValue = numeral(value).format(format)
    return (
      <Text
        key={index}
        x={x(index) + bandwidth / 2}
        y={y(value) - 6}
        fontSize={12}
        lineHeight={16}
        fill={colors.white}
        textAnchor={"middle"}
      >
        {formattedValue}
        <Text
          fontSize={10}
          fill={colors.white50}
          x={x(index) + bandwidth / 2}
          y={y(value) + 12}
        >
          {moment(date).format("D/MM")}
        </Text>
      </Text>
    )
  })

const RANGES = [7, 14, 30]
const CONTENT_INSET = { top: 20, bottom: 0, left: 20, right: 15 }

const TrendChart = props => {
  const {
    selectedRange = RANGES[0],
    onRangePress = x => x,
    data,
    selectedDate = moment().format("YYYY-MM-DD"),
    selectedBar,
    setSelectedBar
  } = props

  const isEmpty = data.length === 0
  const stepData = data.map((value, index) => ({
    value: value.value,
    date: value.date,
    svg: {
      fill:
        value.date === selectedDate
          ? value.value >= STEP_GOAL
            ? "url(#selectedgoalgradient)"
            : "url(#selectedgradient)"
          : value.value >= STEP_GOAL
          ? "url(#goalgradient)"
          : "url(#gradient)",
      onPress: () => setSelectedBar(value.date)
    },
    key: `step-${index}`
  }))
  const DAYS =
    selectedRange === 30
      ? data.map(date => moment(date.date).format("dd")).map(d => (d === "Mo" ? d : null))
      : selectedRange === 14
      ? data.map(date => moment(date.date).format("dd"))
      : data.map(date => moment(date.date).format("ddd"))
  const yMax = isEmpty ? 0 : Math.max(...data.map(d => numeral(d.value).value()))

  return (
    <View paddingTop={20} flex={1}>
      {isEmpty ? (
        <View alignItems="center" justifyContent="center" flex={1} opacity={1}>
          <NoDataIcon size={124} color={colors.white10} />
        </View>
      ) : (
        <Row flex={1} flexDirection="row">
          <View flex={1}>
            <View flex={1}>
              <LineChart
                style={StyleSheet.absoluteFill}
                contentInset={CONTENT_INSET}
                data={[STEP_GOAL, STEP_GOAL]}
                svg={{
                  strokeDasharray: [3, 3],
                  stroke: colors.white30
                }}
                yMin={0}
                yMax={yMax}
              />
              <BarChart
                animate
                style={StyleSheet.absoluteFill}
                data={stepData}
                yAccessor={({ item }) => item.value}
                xAccessor={({ index }) => index}
                contentInset={CONTENT_INSET}
                yMin={0}
                yMax={yMax}
                spacingInner={0.4}
              >
                <BarGradient />
                <SelectedGradient />
                <GoalGradient />
                <SelectedGoalGradient />
                <BarLabel selectedBar={selectedBar} />
              </BarChart>
            </View>
            <XAxis
              data={data}
              xAccessor={({ index }) => index}
              svg={{
                fontSize: 10,
                lineHeight: 16,
                fill: colors.darkBlue10
              }}
              style={{ paddingTop: 8 }}
              scale={scale.scaleBand}
              contentInset={CONTENT_INSET}
              formatLabel={i => DAYS[i]}
              spacingInner={0.4}
            />
          </View>
          <YAxis
            min={0}
            numberOfTicks={5}
            style={{ minWidth: 40, paddingBottom: 5, paddingRight: 4, paddingTop: 10 }}
            data={data}
            yAccessor={({ item }) => item.value}
            svg={{
              fontSize: 12,
              lineHeight: 16,
              fill: colors.darkBlue10
            }}
            contentInset={{ top: 8, bottom: 20 }}
            formatLabel={v => numeral(v).format("0,0")}
            yMin={0}
            yMax={yMax}
          />
        </Row>
      )}
      <View paddingHorizontal={20} paddingBottom={28} paddingTop={15}>
        <Switch
          values={RANGES.map(r => r + " DAYS")}
          value={RANGES.findIndex(x => x === selectedRange)}
          onChange={i => onRangePress(RANGES[i])}
        />
      </View>
    </View>
  )
}

const enhance = compose(withState("selectedBar", "setSelectedBar", null))

export default enhance(TrendChart)
