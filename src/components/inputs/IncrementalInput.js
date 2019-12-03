import { compose, defaultProps, withProps } from "recompose"
import React from "react"
import styled, { TouchableOpacity } from "glamorous-native"

import { PlusIcon, MinusIcon } from "kui/icons"
import Row from "components/Row"

const Container = styled.view({
  flex: 1,
  alignItems: "center"
})

const Btn = styled(p => <TouchableOpacity activeOpacity={0.8} {...p} />)({
  paddingHorizontal: 20,
  paddingVertical: 6
})

const InputContainer = styled.view({
  height: "100%",
  width: 140
})

const defaultIconConfig = {
  size: 24
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
    btnProps,
    inputProps
  } = props
  return (
    <Container>
      <Row>
        <Btn onPress={onDown} {...btnProps}>
          <MinusIcon {...iconConfig} />
        </Btn>
        <InputContainer {...inputProps}>
          {renderProps({ onChange, value, label })}
        </InputContainer>
        <Btn onPress={onUp} {...btnProps}>
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
