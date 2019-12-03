import { View } from "glamorous-native"
import { compose, withProps, lifecycle } from "recompose"
import React from "react"

import { CircleGauge } from "kui/components/Gauge"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"
import withTimer from "components/Timer"

const Ready = ({ timer, nextScreenLabel }) => (
  <View flex={1} paddingHorizontal={20} alignItems="center" justifyContent="center">
    <Text variant="h1" color={colors.darkBlue10} marginBottom={36}>
      The set starts in:
    </Text>
    <View>
      <CircleGauge
        value={timer.time}
        max={timer.totalTime}
        size={160}
        showValueWithin
        renderInside={() => (
          <View
            height="100%"
            width={160}
            alignItems="center"
            justifyContent="center"
            activeOpacity={0.5}
          >
            <Text variant="h2" fontSize={56} lineHeight={64}>
              {timer.totalTime - timer.time}
            </Text>
          </View>
        )}
        progressCircleProps={{
          progressColor: colors.rose40,
          backgroundColor: colors.darkBlue40,
          strokeWidth: 16
        }}
      />
    </View>
    <Text variant="body2" color={colors.darkBlue10} marginTop={24}>
      {"Exercise: " + nextScreenLabel || ""}
    </Text>
  </View>
)

const enhance = compose(
  withTimer({
    syncEvent: ({ onComplit }, timer) => {
      if (onComplit && timer.time === timer.totalTime) {
        // whait sate update and move next
        setTimeout(() => {
          onComplit()
        }, 100)
      }
    }
  }),
  withProps(props => {
    return { readyTimer: _.getOr({}, "screen.timer", props) }
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (!_.isEqual(this.props.readyTimer, prevProps.readyTimer)) {
        const readyTimer = _.getOr({}, `readyTimer`, this.props)
        this.props.initTimer({ ...readyTimer, play: true, lastTick: Date.now() })
      }
    },
    componentDidMount() {
      const readyTimer = _.getOr({}, `readyTimer`, this.props)
      this.props.initTimer({ ...readyTimer, play: true, lastTick: Date.now() })
    }
  })
)

export default enhance(Ready)
