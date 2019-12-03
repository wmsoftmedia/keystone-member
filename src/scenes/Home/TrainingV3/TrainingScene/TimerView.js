import React from "react"
import { View, TouchableOpacity } from "glamorous-native"
import { withHandlers, withProps, compose, lifecycle } from "recompose"
import moment from "moment"
import _ from "lodash/fp"

import withTimer from "components/Timer"
import { PlayIcon, StopIcon } from "kui/icons"
import { CircleGauge } from "kui/components/Gauge"
import Text from "kui/components/Text"
import { Row } from "kui/components"

import colors from "kui/colors"

const DEFAULT_STORE_INTERVAL = 10

const timerStyles = {
  rest: {
    bgColor: colors.green60,
    progressColor: colors.yellow50,
    progressBgColor: colors.green70
  },
  progress: {
    bgColor: colors.blue70,
    progressColor: colors.blue40,
    progressBgColor: colors.blue80
  }
}

const TimerView = props => {
  const { timer, showWidget, timeValue, type, title, subtitle } = props
  const ActionIcon = timer.play ? StopIcon : PlayIcon

  const style = timerStyles[type] || timerStyles["rest"]

  return (
    showWidget && (
      <View
        position="absolute"
        width="100%"
        bottom={60}
        backgroundColor={style.bgColor}
        padding={20}
        borderTopLeftRadius={40}
        borderTopRightRadius={40}
      >
        <Row alignItems="center">
          <CircleGauge
            value={timer.time}
            max={timer.totalTime}
            size={80}
            showValueWithin
            renderInside={() => (
              <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
                <ActionIcon color={colors.white} />
              </TouchableOpacity>
            )}
            progressCircleProps={{
              progressColor: style.progressColor,
              backgroundColor: style.progressBgColor
            }}
          />
          <View flex={1} paddingLeft={16}>
            <Row alignItems="center" justifyContent="space-between">
              <Text variant="h2" color={colors.darkBlue10}>
                {title}
              </Text>
              <Text variant="h1" color={colors.darkBlue10} paddingLeft={16}>
                {timeValue}
              </Text>
            </Row>
            <Text variant="caption1" color={colors.darkBlue10} marginTop={6}>
              {subtitle}
            </Text>
          </View>
        </Row>
      </View>
    )
  )
}

const enhanced = compose(
  withTimer({
    syncEvent: (props, timer) => {
      const { updateModelTimer } = props
      if (timer.time % DEFAULT_STORE_INTERVAL === 0 || timer.time === timer.totalTime) {
        updateModelTimer("global", { ...timer, action: Date.now() })
      }
    }
  }),
  withProps(props => {
    const { timer } = props
    restTimer = props.restTimer || {}

    const showWidget = timer.time < timer.totalTime && timer.time != 0

    const time = timer.totalTime - timer.time
    const utcTime = moment.utc(time * 1000)

    const timeValue = time < 3600 ? utcTime.format("m:ss") : utcTime.format("HH:mm:ss")

    return {
      showWidget,
      timeValue,
      type: restTimer.type,
      title: restTimer.title,
      subtitle: restTimer.subtitle
    }
  }),
  withHandlers({
    onPress: props => () => {
      const newTimer = { ...props.timer, play: !props.timer.play }
      props.updateTimer(newTimer)
      props.updateModelTimer("global", { ...newTimer, action: Date.now() })
    }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const { timer, updateTimer, updateModelTimer } = this.props
      const restTimer = this.props.restTimer || {}
      const prevRestTimer = prevProps.restTimer || {}
      if (restTimer.requestTimeAction !== prevRestTimer.requestTimeAction) {
        updateModelTimer("global", { ...timer, action: Date.now() })
      }
      if (restTimer.action !== prevRestTimer.action) {
        updateTimer({ ...this.props.restTimer, lastTick: Date.now() })
      }
    }
  })
)

export default enhanced(TimerView)
