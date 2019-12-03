import { View, ScrollView, TouchableOpacity } from "glamorous-native"
import { compose, withHandlers, withProps, lifecycle } from "recompose"
import React from "react"
import moment from "moment"

import { CircleGauge } from "kui/components/Gauge"
import { PlayIcon, StopIcon } from "kui/icons"
import { Row } from "kui/components"
import { targetValue, formatUnit } from "scenes/Home/TrainingV3/utils"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"
import withTimer from "components/Timer"

const Round = props => {
  const { timer, onPlay, onPause, onReset, screen, converter } = props
  const { exercises, roundIndex } = screen

  const ActionIcon = timer.play ? StopIcon : PlayIcon

  const time = timer.totalTime - timer.time
  const utcTime = moment.utc(time * 1000)
  const timeValue = time < 3600 ? utcTime.format("mm:ss") : utcTime.format("HH:mm:ss")

  return (
    <View flex={1} paddingTop={60}>
      <View alignItems="center" paddingHorizontal={20}>
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
            progressColor: colors.blue40,
            backgroundColor: colors.blue80,
            strokeWidth: 16
          }}
        />
        <Text variant="h0" marginTop={20}>
          {timeValue}
        </Text>
      </View>
      <View flex={1}>
        <ScrollView flex={1} paddingHorizontal={20} marginTop={10}>
          {exercises.map((exercise, index) => {
            const meta =
              _.getOr([], "edgeMeta.rounds", exercise).find(
                r => r.index === roundIndex
              ) || {}

            const es =
              targetValue(exercise, "Calories", roundIndex) ||
              targetValue(exercise, "Repetitions", roundIndex) ||
              targetValue(exercise, "Distance", roundIndex) ||
              targetValue(exercise, "Duration", roundIndex)

            const ls = targetValue(exercise, "Load", roundIndex, converter)

            const effortUnit = formatUnit(es && es.unit) || ""
            const effortValue =
              meta.effort !== undefined ? meta.effort : (es && es.printValue) || ""

            const loadUnit =
              meta.load !== undefined ? "kg" : formatUnit(ls && ls.unit) || ""
            const loadValue =
              meta.load !== undefined
                ? converter.weightConverter(meta.load)
                : (ls && ls.printValue) || ""

            return (
              <View key={index}>
                <Line marginHorizontal={0} color={colors.darkBlue60} />
                <Row centerY paddingVertical={10}>
                  <View flex={1}>
                    <Text variant="body1">{exercise.name}</Text>
                  </View>
                  <View width={75} paddingLeft={4}>
                    <Text variant="body2">{effortValue + " " + effortUnit}</Text>
                  </View>
                  <View width={75} paddingLeft={4} alignItems="flex-end">
                    <Text variant="body2">
                      {loadValue +
                        (loadUnit[0] === "%" ? "" : " ") +
                        (loadUnit === "kg" ? converter.weightUnit : loadUnit)}
                    </Text>
                  </View>
                </Row>
              </View>
            )
          })}
          <Line marginHorizontal={0} color={colors.darkBlue60} />
        </ScrollView>
      </View>
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
    return { limitTimer: _.getOr({}, "screen.timer", props) }
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
      if (!_.isEqual(this.props.limitTimer, prevProps.limitTimer)) {
        const limitTimer = _.getOr({}, `limitTimer`, this.props)
        const metaTimer = _.getOr({}, `sequenceMeta[${limitTimer.id}]`, this.props)
        const ap = this.props.autoPlay ? { play: true } : {}
        this.props.initTimer({ ...limitTimer, ...ap, ...metaTimer, lastTick: Date.now() })
      }
    },
    componentDidMount() {
      const limitTimer = _.getOr({}, `limitTimer`, this.props)
      const metaTimer = _.getOr({}, `sequenceMeta[${limitTimer.id}]`, this.props)
      const ap = this.props.autoPlay ? { play: true } : {}
      this.props.initTimer({ ...limitTimer, ...ap, ...metaTimer, lastTick: Date.now() })
    },
    componentWillUnmount() {
      const { updateSequenceMeta, timer } = this.props
      updateSequenceMeta({ [timer.id]: timer })
    }
  })
)

export default enhance(Round)
