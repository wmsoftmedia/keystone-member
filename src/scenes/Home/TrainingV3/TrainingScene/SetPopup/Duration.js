import { TouchableOpacity } from "glamorous-native"
import { compose, withHandlers, withProps, lifecycle } from "recompose"
import moment from "moment"
import React from "react"

import withTimer from "components/Timer"
import Text from "kui/components/Text"
import { Row } from "kui/components"
import colors from "kui/colors"

const Button = ({ variant, onPress }) => {
  return (
    <TouchableOpacity
      width={72}
      height={72}
      borderRadius={36}
      alignItem="center"
      justifyContent="center"
      onPress={onPress}
      backgroundColor={
        variant === "start"
          ? colors.green50
          : variant === "stop"
          ? colors.red50
          : colors.blue50
      }
    >
      <Text variant="h2" textAlign="center">
        {variant === "start" ? "Start" : variant === "stop" ? "Stop" : "Reset"}
      </Text>
    </TouchableOpacity>
  )
}

const Duration = props => {
  const { timer, onReset, onPlay, onPause, ...rest } = props

  const utcTime = moment.utc(timer.time * 1000)
  const timeValue =
    timer.time < 3600 ? utcTime.format("m:ss") : utcTime.format("HH:mm:ss")

  return (
    <Row centerY spread {...rest}>
      <Button variant="reset" onPress={onReset} />

      <Text variant="h0">{timer.time === 0 ? timer.totalTime + " sec" : timeValue}</Text>
      <Button
        variant={timer.play ? "stop" : "start"}
        onPress={timer.play ? onPause : onPlay}
      />
    </Row>
  )
}

const enhance = compose(
  withTimer(),
  withProps(props => {
    return { time: props.time || 0, totalTime: props.totalTime || 0 }
  }),
  withHandlers({
    onPlay: ({ timer, startTimer }) => () => {
      startTimer(
        timer.totalTime === timer.time ? { totalTime: Number.MAX_SAFE_INTEGER } : {}
      )
    },
    onPause: props => () => {
      props.stopTimer()
    },
    onReset: props => () => {
      props.updateTimer({ play: false, time: 0, totalTime: props.totalTime })
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (
        this.props.time !== prevProps.time ||
        this.props.totalTime !== prevProps.totalTime
      ) {
        this.props.initTimer({
          lastTick: Date.now(),
          time: this.props.time,
          totalTime:
            this.props.time > this.props.totalTime
              ? Number.MAX_SAFE_INTEGER
              : this.props.totalTime
        })
      }
    },
    componentDidMount() {
      this.props.initTimer({
        lastTick: Date.now(),
        time: this.props.time,
        totalTime:
          this.props.time > this.props.totalTime
            ? Number.MAX_SAFE_INTEGER
            : this.props.totalTime
      })
    }
  })
)

export default enhance(Duration)
