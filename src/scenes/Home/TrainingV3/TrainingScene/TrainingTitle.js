import { View, TouchableOpacity } from "glamorous-native"
import { compose, lifecycle, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"
import _ from "lodash/fp"

import Text from "kui/components/Text"
import withTimer from "components/Timer"

const DEFAULT_STORE_INTERVAL = 10

const TrainingTitle = props => {
  const { time, totalTime, play } = props.timer
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <TouchableOpacity
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        onPress={play ? props.onPause : props.onPlay}
      >
        <Text variant="h2">
          {moment.utc(time * 1000).format("HH:mm:ss")}
          {" | "}
          {moment.utc(totalTime * 1000).format("HH:mm:ss")}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const enhanced = compose(
  withNavigation,
  withTimer({
    syncEvent: (props, timer) => {
      if (timer.time % DEFAULT_STORE_INTERVAL === 0 || timer.time === timer.totalTime) {
        props.updateModelTimer(props.workout.id, timer, true)
      }
    }
  }),
  withHandlers({
    onPlay: ({ startTimer, workout }) => () => {
      const totalTime = _.getOr(0, "duration", workout)
      startTimer({ id: workout.id, totalTime })
    },
    onPause: ({ stopTimer }) => () => {
      stopTimer()
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const { workout, timer, updateModelTimer, updateTimer } = this.props
      const modelTimer = _.getOr({}, "workout.modelTimer", this.props)
      const prevTimer = _.getOr({}, "workout.modelTimer", prevProps)
      if (modelTimer.action !== prevTimer.action) {
        updateTimer({ play: modelTimer.play, action: modelTimer.action })
        updateModelTimer(
          workout.id,
          {
            ...timer,
            ...modelTimer,
            time: timer.time
          },
          true
        )
      }
    },
    componentDidMount() {
      const totalTime = _.getOr(0, "duration", this.props.workout)
      const time = _.getOr(0, "meta.timer.time", this.props.workout)
      this.props.startTimer({ id: this.props.workout.id, totalTime, time })
    },
    componentWillUnmount() {
      const { workout, timer, updateModelTimer } = this.props
      const modelTimer = _.getOr({}, "workout.modelTimer", this.props)
      if (!_.isEqual(timer, modelTimer)) {
        updateModelTimer(workout && workout.id, timer, true)
      }
    }
  })
)

export default enhanced(TrainingTitle)
