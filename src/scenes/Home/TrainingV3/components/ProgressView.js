import { Animated, Easing } from "react-native"
import { View, TouchableOpacity } from "glamorous-native"
import { compose, withProps, withHandlers, withState } from "recompose"
import { setPropTypes, lifecycle } from "recompose"
import PropTypes from "prop-types"
import React from "react"
import moment from "moment"

import withTimer from "components/Timer"
import Text from "kui/components/Text"
import Card from "kui/components/Card"
import { Row } from "kui/components"
import { RestIcon, PlayIcon, StopIcon } from "kui/icons"
import colors from "kui/colors"

const PROGRESS_HEIGHT = 56

const configAnim = duration => ({
  toValue: 1,
  duration,
  easing: Easing.linear
})

const ProgressBar = lifecycle({
  shouldComponentUpdate() {
    return false
  }
})(({ animatedValue, color1, color2 }) => {
  const progressL = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100]
  })

  const progressR = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  })
  return (
    <View flex={1} flexDirection="row" height={PROGRESS_HEIGHT}>
      <Animated.View
        style={{ height: "100%", flex: progressL, backgroundColor: color1 }}
      />
      <Animated.View
        style={{ height: "100%", flex: progressR, backgroundColor: color2 }}
      />
    </View>
  )
})

const ProgressView = props => {
  const { timer, totalTime, onPlay, onPause, onReset, animatedValue } = props

  const ActionIcon = timer.play ? StopIcon : PlayIcon

  const timeValue = timer.time === totalTime ? 0 : totalTime - timer.time || totalTime

  const formatedTime =
    timeValue < 3600
      ? moment.utc(timeValue * 1000).format("m:ss")
      : moment.utc(timeValue * 1000).format("HH:mm:ss")

  return (
    <View width="100%" height={PROGRESS_HEIGHT}>
      <Card overflow="hidden" elevated={false}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={timer.play ? onPause : onPlay}
          onLongPress={onReset}
        >
          <Row alignItems="center">
            <ProgressBar
              animatedValue={animatedValue}
              color1={colors.blue70}
              color2={"rgba(0, 72, 139, 0.4)"}
            />
            <Row
              width="100%"
              padding={16}
              alignItems="center"
              justifyContent="space-between"
              position="absolute"
            >
              <ActionIcon size={24} color={colors.white} />

              <Text variant="body1" paddingHorizontal={8}>
                {formatedTime}
              </Text>
            </Row>
          </Row>
        </TouchableOpacity>
      </Card>
    </View>
  )
}

const calcInterval = (intervalItems, time) =>
  (intervalItems || []).reduce(
    (acc, item, index) => {
      return {
        ...acc,

        itogTime: acc.itogTime + item.time,
        prevTime:
          time > acc.prevTime + item.time ? acc.prevTime + item.time : acc.prevTime,
        currentInterval:
          acc.itogTime < time && time <= acc.itogTime + item.time
            ? index
            : acc.currentInterval
      }
    },
    { prevTime: 0, currentInterval: 0, itogTime: 0 }
  )

const calcTime = (intervalItems, currentInterval, time) =>
  (intervalItems || []).reduce((acc, item, index) => {
    return index < currentInterval
      ? acc + item.time
      : index === currentInterval
      ? acc + time
      : acc
  }, 0)

const enhanced = compose(
  setPropTypes({
    id: PropTypes.string.isRequired,
    intervals: PropTypes.array.isRequired,
    globalTimer: PropTypes.object.isRequired,
    updateModelTimer: PropTypes.func.isRequired
  }),
  withState("currentInterval", "setCurrentInterval", 0),
  withState("animatedValue", "setAnimatedValue", () => {
    return new Animated.Value(0)
  }),
  withProps(({ intervals }) => {
    return {
      totalTime: (intervals || []).reduce((acc, item) => acc + item.time, 0)
    }
  }),
  withTimer({
    syncEvent: (props, timer) => {
      const intervalInfo = calcInterval(props.intervals, timer.time)
      if (props.currentInterval !== intervalInfo.currentInterval) {
        props.setCurrentInterval(intervalInfo.currentInterval)

        const interval =
          props.intervals[intervalInfo.currentInterval] || props.intervals[0]

        props.updateModelTimer &&
          props.globalTimer.currentInterval !== intervalInfo.currentInterval &&
          props.updateModelTimer("global", {
            action: Date.now(),
            currentInterval: intervalInfo.currentInterval,
            type: interval.type,
            totalTime: interval.time,
            title: interval.title,
            subtitle: interval.subtitle
          })
      }
    }
  }),
  withHandlers({
    onPlay: props => () => {
      const { updateModelTimer, startTimer, totalTime, timer } = props
      let duration = 0

      updateModelTimer && updateModelTimer("global", { play: false, action: Date.now() })

      if (totalTime === timer.time) {
        const interval = props.intervals[0]

        props.animatedValue.setValue(0)
        duration = totalTime * 1000
        const _timer = startTimer({
          id: props.id,
          totalTime: totalTime,
          time: 0
        })

        updateModelTimer &&
          updateModelTimer("global", {
            ..._timer,
            action: Date.now(),
            currentInterval: 0,
            type: interval.type,
            totalTime: interval.time,
            title: interval.title,
            subtitle: interval.subtitle
          })
      } else {
        duration = (totalTime - timer.time) * 1000
        const _timer = startTimer({ id: props.id, totalTime: totalTime })

        const intervalInfo = calcInterval(props.intervals, timer.time)
        const interval =
          props.intervals[intervalInfo.currentInterval] || props.intervals[0]

        updateModelTimer &&
          updateModelTimer("global", {
            ..._timer,
            time: timer.time - intervalInfo.prevTime,
            action: Date.now(),
            currentInterval: intervalInfo.currentInterval,
            type: interval.type,
            totalTime: interval.time,
            title: interval.title,
            subtitle: interval.subtitle
          })
      }

      Animated.sequence([
        Animated.timing(props.animatedValue, configAnim(duration))
      ]).start()
    },
    onPause: props => () => {
      const { updateModelTimer, stopTimer, timer } = props
      Animated.timing(props.animatedValue).stop()
      const _timer = stopTimer()
      const intervalInfo = calcInterval(props.intervals, timer.time)
      const interval = props.intervals[intervalInfo.currentInterval] || props.intervals[0]
      updateModelTimer &&
        updateModelTimer("global", {
          ..._timer,
          action: Date.now(),
          time: timer.time - intervalInfo.prevTime,
          currentInterval: 0,
          type: interval.type,
          totalTime: interval.time,
          title: interval.title,
          subtitle: interval.subtitle
        })
    },
    onReset: props => () => {
      const { updateModelTimer, updateTimer } = props
      props.animatedValue.setValue(0)
      Animated.timing(props.animatedValue).stop()
      const _timer = updateTimer({ play: false, time: 0 })

      const interval = props.intervals[0]
      updateModelTimer &&
        updateModelTimer("global", {
          ..._timer,
          action: Date.now(),
          currentInterval: 0,
          type: interval.type,
          totalTime: interval.time,
          title: interval.title,
          subtitle: interval.subtitle
        })
    }
  }),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return (
        this.props.id !== nextProps.id ||
        this.props.type !== nextProps.type ||
        this.props.timer.play !== nextProps.timer.play ||
        this.props.timer.time !== nextProps.timer.time ||
        (!!this.props.globalTimer &&
          this.props.globalTimer.action !== nextProps.globalTimer.action)
      )
    },
    componentDidUpdate(prevProps) {
      const { id, totalTime, globalTimer, updateTimer, updateModelTimer } = this.props
      if (globalTimer) {
        if (updateModelTimer && globalTimer.id === id && id !== prevProps.id) {
          updateModelTimer("global", { requestTimeAction: Date.now() })
        }

        if (
          globalTimer.id === id &&
          globalTimer.action !== prevProps.globalTimer.action
        ) {
          const currentInterval = globalTimer.currentInterval || 0
          const _time = calcTime(this.props.intervals, currentInterval, globalTimer.time)

          this.props.currentInterval !== currentInterval &&
            this.props.setCurrentInterval(currentInterval)

          const _timer = this.props.updateTimer({
            id: globalTimer.id,
            play: globalTimer.play,
            lastTick: globalTimer.lastTick,
            time: _time,
            totalTime: totalTime
          })

          //const _timer = updateTimer(globalTimer)
          this.props.animatedValue.setValue(
            _timer.totalTime ? _timer.time / _timer.totalTime : 0
          )
          if (globalTimer.play) {
            const duration = (_timer.totalTime - _timer.time) * 1000
            Animated.sequence([
              Animated.timing(this.props.animatedValue, configAnim(duration))
            ]).start()
          } else {
            Animated.timing(this.props.animatedValue).stop()
          }
        }

        if (globalTimer.id !== id) {
          // if we received a message from another timer,
          // then our timer is no longer active, need to stop it
          updateTimer({ time: 0, play: false })
          this.props.animatedValue.setValue(0)
          Animated.timing(this.props.animatedValue).stop()
        }
      }
    },
    componentDidMount() {
      const { id, totalTime, globalTimer, updateModelTimer } = this.props
      if (globalTimer && globalTimer.id === id) {
        // on component mount need init timer from state,
        // then request current time from RestView component

        //const currentInterval = globalTimer.currentInterval || 0
        //this.props.setCurrentInterval(globalTimer.currentInterval || 0)

        const currentInterval = globalTimer.currentInterval || 0
        const _time = calcTime(this.props.intervals, currentInterval, globalTimer.time)

        this.props.currentInterval !== currentInterval &&
          this.props.setCurrentInterval(currentInterval)

        this.props.updateTimer({
          id: globalTimer.id,
          play: globalTimer.play,
          lastTick: globalTimer.lastTick,
          time: _time,
          totalTime: totalTime
        })
        updateModelTimer && updateModelTimer("global", { requestTimeAction: Date.now() })
      }
    }
  })
)

export default enhanced(ProgressView)
