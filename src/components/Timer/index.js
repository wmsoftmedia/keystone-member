import { compose, withHandlers, withState, lifecycle } from "recompose"
import _ from "lodash/fp"

const emptyTimer = () => ({ time: 0, totalTime: 0, play: false })

const defaultConfig = {
  syncEvent: () => {},
  interval: 1000,
  tickTime: 500
}

export default config => {
  const conf = { ...defaultConfig, ...config }
  return compose(
    withState("timer", "setTimer", props => {
      return emptyTimer()
    }),
    withState("intervalId", "setIntervalId", null),
    withHandlers({
      onIntervalEvent: props => () => {
        const { timer, intervalId, setIntervalId, setTimer } = props
        if (timer.play) {
          const curTime =
            timer.time +
            Math.floor((Date.now() - timer.lastTick) / conf.interval)
          if (curTime != timer.time) {
            const newTimer =
              curTime < timer.totalTime
                ? { ...timer, time: curTime, lastTick: Date.now() }
                : {
                    ...timer,
                    time: timer.totalTime,
                    play: false,
                    lastTick: Date.now()
                  }

            setTimer(newTimer)
            conf.syncEvent(props, newTimer)
          }
        } else {
          clearInterval(intervalId)
          setIntervalId(null)
        }
      }
    }),
    withHandlers({
      startTimer: props => timer => {
        const { onIntervalEvent, intervalId, setTimer, setIntervalId } = props
        clearInterval(intervalId)
        setIntervalId(setInterval(onIntervalEvent, conf.tickTime))
        const _timer = {
          ...props.timer,
          lastTick: Date.now(),
          play: true,
          ...timer
        }
        setTimer(_timer)
        return _timer
      },
      stopTimer: ({ timer, setTimer }) => () => {
        const _timer = { ...timer, play: false }
        setTimer(_timer)
        return _timer
      },
      updateTimer: props => newTimer => {
        const { setTimer, intervalId, setIntervalId, onIntervalEvent } = props
        const _timer = { ...props.timer, ...newTimer }
        if (_timer.play) {
          clearInterval(intervalId)
          setIntervalId(setInterval(onIntervalEvent, conf.tickTime))
        } else {
          clearInterval(intervalId)
        }
        setTimer(_timer)
        return _timer
      },
      initTimer: props => newTimer => {
        const { onIntervalEvent, intervalId, setTimer, setIntervalId } = props
        const _timer = { ...emptyTimer(), ...newTimer }
        if (_timer.play) {
          clearInterval(intervalId)
          setIntervalId(setInterval(onIntervalEvent, conf.tickTime))
        } else {
          clearInterval(intervalId)
        }
        setTimer(_timer)
        return _timer
      }
    }),
    lifecycle({
      componentWillUnmount() {
        clearInterval(this.props.intervalId)
      }
    })
  )
}
