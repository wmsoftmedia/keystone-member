import { Control } from "react-redux-form/native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Text, View } from "glamorous-native"
import React from "react"

import { Row } from "kui/components"
import { TextInput } from "kui/components/Input"
import RotarySelector from "kui/components/RotarySelector"
import colors from "kui/colors"
import fonts from "kui/fonts"

const renderValue = value => (
  <View position="relative" justifyContent="center" alignItems="center" flex={1}>
    <Text color={colors.white} fontSize={36}>
      {value}
    </Text>
    <Text position="absolute" color={colors.white50} top={76}>
      /10
    </Text>
  </View>
)

const renderInput = React.memo(props => {
  const { index, label, onChange, value } = props
  return (
    <Row
      backgroundColor={colors.darkBlue90}
      marginHorizontal={20}
      marginVertical={6}
      borderRadius={12}
      height={188}
    >
      <View alignItems="center" justifyContent="center">
        <RotarySelector
          value={value}
          startValue={0}
          endValue={10}
          minValue={0}
          maxValue={10}
          onChange={onChange}
          renderValue={renderValue}
        />
      </View>
      <View
        flex={1}
        paddingLeft={6}
        paddingRight={16}
        paddingTop={28}
        paddingBottom={36}
        justifyContent="space-between"
      >
        <Text
          fontSize={18}
          lineHeight={28}
          color={colors.white}
          fontFamily={fonts.montserratSemiBold}
        >
          {label}
        </Text>
        <View>
          <Text fontSize={12} lineHeight={16} color={colors.blue20_50}>
            A short entry to explain why you have this rating
          </Text>
          <View paddingTop={8}>
            <Control
              model={`.feelings[${index}].notes`}
              component={p => {
                return (
                  <TextInput
                    value={p.value}
                    onChange={p.onChange}
                    onFocus={p.onFocus}
                    compact
                  />
                )
              }}
            />
          </View>
        </View>
      </View>
    </Row>
  )
})

const LifestyleFields = React.memo(props => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={46}
      keyboardOpeningTime={0}
    >
      <Text
        textAlign="center"
        color={colors.white}
        fontSize={28}
        lineHeight={36}
        paddingTop={4}
        paddingBottom={28 - 6}
      >
        Rate your Feelings
      </Text>
      <Control
        model={`.feelings[0].value`}
        index={0}
        label="Motivation"
        component={renderInput}
      />
      <Control
        model={`.feelings[1].value`}
        index={1}
        label="Gratitude"
        component={renderInput}
      />
      <Control
        model={`.feelings[2].value`}
        index={2}
        label="Sleep"
        component={renderInput}
      />
      <Control
        model={`.feelings[3].value`}
        index={3}
        label="Stress Opt."
        component={renderInput}
      />
    </KeyboardAwareScrollView>
  )
})

export default LifestyleFields
