import { Animated, View, TouchableOpacity, Text } from "react-native"
import { compose, defaultProps, setPropTypes, lifecycle } from "recompose"
import PropTypes from "prop-types"
import { PieChart, ProgressCircle } from "react-native-svg-charts"
import React from "react"
import moment from "moment"
import _ from "lodash/fp"

import colors from "colors"
import { PauseIcon, PlayIcon } from "scenes/Home/Icons"

const DEFAULT_SIZE = 220
const DEFAULT_STROKE_WIDTH = 8

class BgBlinkView extends React.Component {
  shouldComponentUpdate() {
    return false
  }
  render() {
    const { animatedValue, strokeWidth, size } = this.props
    return (
      <Animated.View
        style={{
          width: size - 6 * strokeWidth,
          height: size - 6 * strokeWidth,
          margin: 4 * strokeWidth,
          backgroundColor: colors.white,
          borderRadius: (size - 6 * strokeWidth) / 2,
          position: "absolute",
          opacity: animatedValue
        }}
      />
    )
  }
}

class TimerValue extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.value !== nextProps.value || this.props.play !== nextProps.play
    )
  }

  render() {
    const { animatedValue, strokeWidth, size, value } = this.props
    const ActionIcon = this.props.play ? PauseIcon : PlayIcon

    const outValue =
      value > 3600
        ? moment.utc(value * 1000).format("H:mm:ss")
        : value > 60
          ? moment.utc(value * 1000).format("m:ss")
          : value

    const fontSize = value > 60 ? 60 : 90

    return (
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <BgBlinkView
          animatedValue={animatedValue}
          strokeWidth={strokeWidth}
          size={size}
        />
        <Animated.View
          style={{
            position: "absolute",
            alignItems: "center"
            //opacity: 1 - animatedValue - this breaks iOS running on the phone (fine in simulator)
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize
            }}
          >
            {outValue}
          </Text>
          <ActionIcon size={28} color={colors.white} />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            alignItems: "center",
            opacity: animatedValue
          }}
        >
          <Text
            style={{
              color: colors.blue8,
              fontSize
            }}
          >
            {outValue}
          </Text>
          <ActionIcon size={28} color={colors.blue8} />
        </Animated.View>
      </View>
    )
  }
}

const TimerView = props => {
  const { value, play, animatedValue, strokeWidth, size, label } = props
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PieChart
          style={{
            height: size,
            width: size,
            position: "absolute"
          }}
          innerRadius={size / 2 - strokeWidth}
          data={props.pieData}
          sort={(a, b) => a.index - b.index}
        />
        <ProgressCircle
          style={{
            height: size - 3.5 * strokeWidth,
            width: size - 3.5 * strokeWidth,
            position: "absolute"
            //margin: (3.5 * strokeWidth) / 2
          }}
          strokeWidth={strokeWidth}
          progress={props.progress}
          backgroundColor={colors.white10}
          progressColor={colors.white50}
        />
        {!!label && (
          <Text
            style={{
              top: 34,
              fontSize: 22,
              color: colors.white50,
              position: "absolute"
            }}
          >
            REST
          </Text>
        )}
        <TimerValue
          value={value}
          play={play}
          animatedValue={animatedValue}
          strokeWidth={strokeWidth}
          size={size}
        />
      </View>
    </TouchableOpacity>
  )
}

const enhance = compose(
  setPropTypes({
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    pieData: PropTypes.array.isRequired,
    progress: PropTypes.number,
    value: PropTypes.number.isRequired,
    play: PropTypes.bool,
    label: PropTypes.string,
    size: PropTypes.number,
    strokeWidth: PropTypes.number
  }),
  defaultProps({
    progress: 0,
    label: null,
    play: false,
    animatedValue: new Animated.Value(0),
    size: DEFAULT_SIZE,
    strokeWidth: DEFAULT_STROKE_WIDTH
  }),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return !_.isEqual(this.props, nextProps)
    }
  })
)

export default enhance(TimerView)
