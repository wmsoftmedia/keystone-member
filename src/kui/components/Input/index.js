import React from "react"
import styled, { TextInput as RNTextInput, View } from "glamorous-native"

import { Row } from "kui/components"
import Picker from "kui/components/Input/Picker"
import Text from "kui/components/Text"
import colors from "kui/colors"
import { feetToFtIn, ftInToFeet } from "keystone"
import { convertHeight } from "keystone"

const Input = styled(p => <RNTextInput {...p} />)(
  {
    paddingHorizontal: 8,
    borderWidth: 1,
    fontSize: 12,
    lineHeight: 16,
    minWidth: 60,
    textAlignVertical: "center"
  },
  ({ focused, compact = true }) => ({
    height: compact ? 40 : 48,
    color: colors.white,
    borderRadius: 8,
    backgroundColor: focused ? colors.darkBlue80 : colors.darkBlue90,
    borderColor: focused ? colors.darkBlue40 : colors.darkBlue70
  })
)

export const TextInput = ({ input, style, onChange, label, ...rest }) => {
  return (
    <View>
      {!!label && (
        <Text
          paddingBottom={8}
          color={colors.darkBlue10}
          opacity={0.5}
          fontSize={12}
          lineHeight={16}
        >
          {label}
        </Text>
      )}
      <Input
        clearButtonMode="while-editing"
        placeholderTextColor={colors.blue20_50}
        underlineColorAndroid="transparent"
        returnKeyType="done"
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={input ? input.onChange : onChange}
        style={style}
        {...rest}
      />
    </View>
  )
}

const ErrorLabel = ({ children }) => (
  <Text
    color={colors.red50}
    alignSelf="center"
    position="absolute"
    bottom={4}
    fontSize={12}
    lineHeight={16}
  >
    {children}
  </Text>
)

export const TextField = props => {
  const { error, showError, ...rest } = props
  return (
    <View paddingBottom={24}>
      <TextInput {...rest} />
      {showError && (error && <ErrorLabel>{error}</ErrorLabel>)}
    </View>
  )
}

export const InputRow = ({
  label,
  suffix,
  renderInput,
  renderPrefix,
  renderSuffix,
  labelProps,
  ...rest
}) => {
  return (
    <Row centerY spread height={56} {...rest}>
      <View>
        <Text fontSize={15} lineHeight={24} color={colors.white} {...labelProps}>
          {label}
        </Text>
      </View>
      <Row centerY>
        {renderPrefix && renderPrefix()}
        {renderInput && renderInput()}
        {renderSuffix ? (
          renderSuffix()
        ) : suffix ? (
          <Text
            marginLeft={12}
            minWidth={20}
            color={colors.white}
            fontSize={12}
            lineHeight={16}
          >
            {suffix}
          </Text>
        ) : null}
      </Row>
    </Row>
  )
}

export const InputRowText = ({ inputProps, ...rest }) => (
  <InputRow
    renderInput={() => <TextInput width={80} compact {...inputProps} />}
    {...rest}
  />
)

export const InputRowPicker = ({ pickerProps, ...rest }) => {
  const options = { ...pickerProps, pickerHeader: rest.label }
  return <InputRow renderInput={() => <Picker minWidth={140} {...options} />} {...rest} />
}

/* Specific decorator for Redux Form  */
export const ReduxFormField = props => {
  const { meta, input, ...rest } = props
  const { error, touched, active } = meta
  return (
    <TextField
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      onChange={input.onChange}
      showError={touched}
      error={error}
      focused={active}
      {...rest}
    />
  )
}

export const HeightTextInput = ({
  unit,
  value,
  onChange = () => {},
  labelProps,
  ...rest
}) => {
  const defaultInputProps = {
    returnKeyType: "done",
    keyboardType: "numeric",
    clearButtonMode: "never"
  }
  const defaultLabelProps = {
    fontSize: 15,
    lineHeight: 24,
    color: colors.white,
    paddingLeft: 6
  }

  const [feets, setFeets] = React.useState("")
  const [inches, setInches] = React.useState("")
  const [height, setHeight] = React.useState("")

  React.useEffect(() => {
    const ftIn = feetToFtIn(convertHeight("cm", "feet", false, value), true)
    setFeets(ftIn.ft || "")
    setInches(ftIn.in || "")
    setHeight(value || "")
  }, [unit])

  const updateValue = v =>
    onChange(v === "" || isNaN(v) ? "" : convertHeight(unit, "cm", true, v))

  if (unit === "feet") {
    return (
      <Row centerY>
        <Row centerY flex={1} style={{ paddingRight: 12 }}>
          <View flex={1}>
            <TextInput
              value={"" + feets}
              onChange={v => v.match(/^\d*$/) && setFeets(v)}
              onEndEditing={_ =>
                updateValue(ftInToFeet({ ft: feets, in: isNaN(+inches) ? 0 : +inches }))
              }
              style={{ width: "100%" }}
              {...defaultInputProps}
              {...rest}
            />
          </View>
          <Text {...defaultLabelProps} {...labelProps}>
            ft
          </Text>
        </Row>
        <Row centerY flex={1} style={{ paddingLeft: 12 }}>
          <View flex={1}>
            <TextInput
              value={"" + inches}
              onChange={v => v.match(/^\d*\.{0,1}\d*$/) && setInches(v)}
              onEndEditing={_ =>
                updateValue(ftInToFeet({ ft: feets, in: isNaN(+inches) ? 0 : +inches }))
              }
              style={{ width: "100%" }}
              {...defaultInputProps}
              {...rest}
            />
          </View>
          <Text {...defaultLabelProps} {...labelProps}>
            in
          </Text>
        </Row>
      </Row>
    )
  } else {
    return (
      <Row centerY>
        <View flex={1}>
          <TextInput
            value={"" + height}
            onChange={v => v.match(/^\d*\.{0,1}\d*$/) && setHeight(v)}
            onEndEditing={_ => updateValue(height)}
            {...defaultInputProps}
            {...rest}
          />
        </View>
        <Text {...defaultLabelProps} {...labelProps}>
          {unit}
        </Text>
      </Row>
    )
  }
}
