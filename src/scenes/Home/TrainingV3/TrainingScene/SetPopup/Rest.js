import { View, TouchableOpacity } from "glamorous-native"
import { compose, withHandlers, withProps, lifecycle } from "recompose"
import React from "react"
import moment from "moment"
import _ from "lodash/fp"

import withTimer from "components/Timer"
import { PlayIcon, StopIcon } from "kui/icons"
import { CircleGauge } from "kui/components/Gauge"
import Text from "kui/components/Text"
import colors from "kui/colors"

const Rest = props => {
  const { timer, onPlay, onPause, onReset, nextScreenLabel } = props

  const ActionIcon = timer.play ? StopIcon : PlayIcon

  const time = timer.totalTime - timer.time
  const utcTime = moment.utc(time * 1000)
  const timeValue = time < 3600 ? utcTime.format("m:ss") : utcTime.format("HH:mm:ss")

  return (
    <View flex={1} paddingHorizontal={20} paddingTop={60} alignItems="center">
      <View flex={1} alignItems="center">
        <CircleGauge
          value={timer.time}
          max={timer.totalTime}
          size={200}
          showValueWithin
          renderInside={() => (
            <TouchableOpacity
              height="100%"
              width={200}
              alignItems="center"
              justifyContent="center"
              activeOpacity={0.5}
              onPress={timer.play ? onPause : onPlay}
              onLongPress={onReset}
            >
              <ActionIcon color={colors.white} size={80} />
            </TouchableOpacity>
          )}
          progressCircleProps={{
            progressColor: colors.yellow50,
            backgroundColor: colors.green70,
            strokeWidth: 16
          }}
        />
        <Text variant="h0" marginTop={20}>
          {timeValue}
        </Text>
      </View>
      <Text variant="body1" color={colors.green20} marginBottom={24} textAlign="center">
        {nextScreenLabel ? "Coming up: " + nextScreenLabel : `Time to rest!`}
      </Text>
    </View>
  )
}

const enhance = compose(
  withTimer({
    syncEvent: ({ isLast, moveForwardAuto, onComplit }, timer) => {
      if (!isLast && moveForwardAuto && onComplit && timer.time === timer.totalTime) {
        // whait sate update and move next
        setTimeout(() => {
          onComplit()
        }, 100)
      }
    }
  }),
  withProps(props => {
    return { restTimer: _.getOr({}, "screen.timer", props) }
  }),
  withHandlers({
    onPlay: ({ timer, startTimer, updateSequenceMeta }) => () => {
      const _timer = startTimer(timer.totalTime === timer.time ? { time: 0 } : {})
      updateSequenceMeta({ [_timer.id]: _timer })
    },
    onPause: ({ stopTimer, updateSequenceMeta }) => () => {
      const _timer = stopTimer()
      updateSequenceMeta({ [_timer.id]: _timer })
    },
    onReset: ({ updateTimer, updateSequenceMeta }) => () => {
      const _timer = updateTimer({ play: false, time: 0 })
      updateSequenceMeta({ [_timer.id]: _timer })
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (!_.isEqual(this.props.restTimer, prevProps.restTimer)) {
        const restTimer = _.getOr({}, `restTimer`, this.props)
        const metaTimer = _.getOr({}, `sequenceMeta[${restTimer.id}]`, this.props)
        const ap = this.props.autoPlay ? { play: true } : {}
        this.props.initTimer({ ...restTimer, ...ap, ...metaTimer, lastTick: Date.now() })
      }
    },
    componentDidMount() {
      const restTimer = _.getOr({}, `restTimer`, this.props)
      const metaTimer = _.getOr({}, `sequenceMeta[${restTimer.id}]`, this.props)
      const ap = this.props.autoPlay ? { play: true } : {}
      this.props.initTimer({ ...restTimer, ...ap, ...metaTimer, lastTick: Date.now() })
    },
    componentWillUnmount() {
      const { updateSequenceMeta, timer } = this.props
      updateSequenceMeta({ [timer.id]: timer })
    }
  })
)

export default enhance(Rest)
