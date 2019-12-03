import React, { useState } from "react"
import { View } from "glamorous-native"
import { compose, defaultProps } from "recompose"
import _ from "lodash/fp"

import { TextInput, InputRowText } from "kui/components/Input"
import Picker from "kui/components/Input/Picker"
import { Row } from "kui/components"
import Text from "kui/components/Text"
import { setSpecs } from "scenes/Home/WorkoutBuilder/common"

const timeToText = value => {
  const min = Math.floor(value / 60)
  const sec = value % 60
  return value ? ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2) : ""
}

const textToTime = text => {
  const time = (text ? text.split(":") : []).map(v => parseInt(v))
  return (time[0] || 0) * 60 + (time[1] || 0)
}

const TimeSpec = ({ value, onChange, title }) => {
  const [text, setText] = useState(timeToText(value || 0))
  return (
    <InputRowText
      paddingVertical={4}
      label={title}
      labelProps={{ variant: "body2" }}
      inputProps={{
        returnKeyType: "done",
        keyboardType: "numeric",
        clearButtonMode: "never",
        textAlign: "center",
        maxLength: 5,
        placeholder: "__:__",
        value: text,
        onChange: v => {
          const m = v.match(/^(\d{2})(\d)$/)
          const vv = m ? m[1] + ":" + m[2] : v
          if (!vv || vv.match(/^(\d{1,2})(:[0-9]{0,2}){0,1}$/)) {
            setText(vv)
          }
        },
        onEndEditing: e => {
          const time = textToTime(e.nativeEvent.text)
          const newText = timeToText(time)
          setText(newText)
          onChange(time)
        }
      }}
    />
  )
}

const RoundsSpec = ({ value, onChange, title }) => {
  return (
    <Row centerY>
      {!!title && (
        <Text variant="body2" flex={0.4}>
          {title}
        </Text>
      )}
      <Row flex={0.6}>
        <View paddingRight={12} flex={1}></View>
        <View paddingLeft={12} flex={1}>
          <Picker
            box
            items={_.times(String, 101)}
            value={"" + (value || 0)}
            onChange={v => onChange(parseInt(v))}
            pickerHeader={title}
          />
        </View>
      </Row>
    </Row>
  )
}

const SpecView = props => {
  const { spec, value, onChange } = props
  const setSpec = setSpecs[spec]
  return (
    !!setSpec && (
      <View>
        {setSpec.type === "rounds" && (
          <RoundsSpec
            title={setSpec.label}
            value={value || setSpec.defaultValue}
            onChange={onChange}
          />
        )}
        {setSpec.type === "time" && (
          <TimeSpec
            title={setSpec.label}
            value={value || setSpec.defaultValue}
            onChange={onChange}
          />
        )}
        {setSpec.type === "text" && (
          <View marginVertical={8}>
            <TextInput
              label={setSpec.label}
              value={"" + (value || setSpec.defaultValue)}
              multiline={true}
              height={80}
              onChange={onChange}
            />
          </View>
        )}
      </View>
    )
  )
}

const enhanced = compose(
  defaultProps({
    spec: "",
    value: "",
    onChange: () => {}
  })
)

export default enhanced(SpecView)
