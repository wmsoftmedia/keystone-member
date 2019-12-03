import { compose, defaultProps, withProps } from "recompose"
import React from "react"
import styled, { TouchableOpacity } from "glamorous-native"

import { MinusIcon, PlusIcon } from "kui/icons"
import Row from "components/Row"
import colors from "colors"

const Container = styled.view({
  maxHeight: 80,
  flex: 1,
  alignItems: "center"
})

const Btn = styled(p => <TouchableOpacity activeOpacity={0.8} {...p} />)({
  height: "100%",
  flex: 0.25,
  alignItems: "center",
  justifyContent: "center"
})

const InputContainer = styled.view({
  height: "100%",
  flex: 0.5
})

const inputConfig = {
  returnKeyType: "done",
  keyboardAppearance: "dark",
  keyboardType: "numeric",
  textAlign: "center",
  selectionColor: colors.white50,
  placeholder: "--",
  placeholderTextColor: colors.white10,
  selectTextOnFocus: true,
  underlineColorAndroid: colors.transparent
}

const defaultIconConfig = {
  color: colors.white,
  size: 36
}

const IncrementalInput = compose(
  defaultProps({
    value: "",
    label: "",
    onDown: () => {},
    onUp: () => {},
    disabled: false,
    btnProps: {},
    labelProps: {},
    inputProps: {},
    renderProps: () => null,
    iconConfig: defaultIconConfig
  }),
  withProps(props => {
    const { value } = props
    return { ...props, value: String(value || "") }
  })
)(props => {
  const {
    label,
    value,
    onChange,
    onDown,
    onUp,
    renderProps,
    iconConfig,
    buttonProps
  } = props
  return (
    <Container>
      <Row flex={1}>
        <Btn onPress={onDown} {...buttonProps}>
          <MinusIcon {...iconConfig} />
        </Btn>
        {renderProps && (
          <InputContainer>{renderProps({ onChange, value, label })}</InputContainer>
        )}
        <Btn onPress={onUp} {...buttonProps}>
          <PlusIcon {...iconConfig} />
        </Btn>
      </Row>
    </Container>
  )
})

export const withIncrement = compose(
  defaultProps({
    value: "",
    label: "",
    onDown: () => {},
    onUp: () => {},
    disabled: false
  }),
  Component => {
    return props => {
      const onUp = () => {
        props.onChange(props.onUp(props.value))
      }
      const onDown = () => {
        props.onChange(props.onDown(props.value))
      }
      return <Component {...props} onUp={onUp} onDown={onDown} />
    }
  }
)

export default withIncrement(IncrementalInput)
