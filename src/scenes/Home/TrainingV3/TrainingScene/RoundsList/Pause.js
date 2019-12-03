import { View, TouchableOpacity } from "glamorous-native"
import React from "react"
import moment from "moment"

import { CircleGauge } from "kui/components/Gauge"
import { PlayIcon, CrossIcon } from "kui/icons"
import { Row } from "kui/components"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const pauseStyles = {
  rest: {
    bgColor: colors.green60,
    progressColor: colors.yellow50,
    progressBgColor: colors.green70
  },
  exercise: {
    bgColor: colors.blue70,
    progressColor: colors.blue40,
    progressBgColor: colors.blue80
  }
}

const Pause = props => {
  const { type, title, subtitle, totalTime, time } = props

  const _time = totalTime - time
  const utcTime = totalTime && moment.utc(_time * 1000)
  const timeValue =
    (totalTime && (_time < 3600 ? utcTime.format("m:ss") : utcTime.format("HH:mm:ss"))) ||
    ""

  const style = pauseStyles[type] || pauseStyles["rest"]

  return (
    <TouchableOpacity
      borderTopRightRadius={34}
      borderTopLeftRadius={34}
      backgroundColor={style.bgColor}
      activeOpacity={0.95}
      onPress={props.onResume}
    >
      <Row centerY paddingHorizontal={20} paddingVertical={16}>
        <CircleGauge
          value={time ? props.time : 100}
          max={time ? props.totalTime : 100}
          size={80}
          showValueWithin
          renderInside={() => (
            <View height="100%" width={160} alignItems="center" justifyContent="center">
              <PlayIcon />
            </View>
          )}
          progressCircleProps={{
            progressColor: style.progressColor,
            backgroundColor: style.progressBgColor,
            strokeWidth: 8
          }}
        />
        <Row flex={1} centerY marginLeft={16}>
          <View flex={1} paddingRight={8}>
            <Text
              variant="h2"
              lineHeight={20}
              fontSize={16}
              numberOfLines={2}
              ellipsizeMode={"tail"}
            >
              {_.trim(title)}
            </Text>
            <Text
              variant="caption1"
              marginTop={5}
              numberOfLines={2}
              ellipsizeMode={"tail"}
            >
              {_.trim(subtitle)}
            </Text>
          </View>

          <Text minWidth={40} variant="h1">
            {timeValue}
          </Text>
        </Row>
      </Row>

      <View
        position="absolute"
        bottom={-30}
        backgroundColor={colors.blue70}
        height={30}
        width={"100%"}
        shadowOpacity={0.6}
        shadowColor={colors.black}
        shadowOffset={{ width: 0, height: 0 }}
        shadowRadius={30}
      ></View>
      <TouchableOpacity
        position="absolute"
        margin={10}
        padding={10}
        top={-4}
        right={0}
        onPress={props.onClose}
      >
        <CrossIcon color={colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default Pause
