import React from "react"
import { compose, withHandlers, withState } from "recompose"
import { View } from "glamorous-native"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import _ from "lodash/fp"

import { ModalScreen } from "components/Background"
import { Row } from "kui/components"
import Picker from "kui/components/Input/Picker"
import { PrimaryButton } from "kui/components/Button"
import Text from "kui/components/Text"

const TimeSelector = ({ onSave, time, setTime, subtitle }) => {
  return (
    <ModalScreen padding={20}>
      <View flex={1}>
        {!!subtitle && (
          <Text variant="body2" marginBottom={20}>
            {subtitle}
          </Text>
        )}
        <Row>
          <View paddingRight={12} flex={1}>
            <Picker
              box
              label="Min"
              items={_.times(String, 121)}
              value={"" + time.min}
              onChange={v => setTime({ ...time, min: parseInt(v) })}
              pickerHeader={"Minutes"}
            />
          </View>
          <View paddingLeft={12} flex={1}>
            <Picker
              box
              label="Sec"
              items={_.times(String, 60)}
              value={"" + time.sec}
              onChange={v => setTime({ ...time, sec: parseInt(v) })}
              pickerHeader={"Seconds"}
            />
          </View>
        </Row>
      </View>
      <PrimaryButton disabled={!time.min && !time.sec} label="SAVE" onPress={onSave} />
    </ModalScreen>
  )
}

const enhanced = compose(
  withMappedNavigationParams(),
  withNavigation,
  withState("time", "setTime", ({ value }) =>
    value ? { min: Math.floor(value / 60), sec: value % 60 } : { min: 0, sec: 0 }
  ),
  withHandlers({
    onSave: ({ navigation, time, onTimeSelect }) => () => {
      const value = (time.min || 0) * 60 + (time.sec || 0)
      onTimeSelect && onTimeSelect(value)
      navigation.goBack()
    }
  })
)

export default enhanced(TimeSelector)
