import { compose, defaultProps, setPropTypes } from "recompose"
import { Text, TouchableOpacity } from "glamorous-native"
import PropTypes from "prop-types"
import React from "react"
import _ from "lodash/fp"

import { Row } from "kui/components"
import colors from "kui/colors"
import fonts from "kui/fonts"

export const TouchableItem = props => {
  const { disabled, selected, label, onPress } = props

  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      onPress={onPress}
      flex={1}
      justifyContent="center"
      alignItems="center"
      alignSelf="stretch"
      marginHorizontal={6}
      paddingVertical={8}
      paddingHorizontal={12}
      borderRadius={20}
      opacity={disabled ? 0.3 : 1}
      backgroundColor={selected ? colors.darkBlue60 : colors.transparent}
    >
      <Text
        fontFamily={fonts.montserrat}
        fontSize={10}
        lineHeight={16}
        textAlign="center"
        color={colors.white}
        opacity={selected ? 1 : 0.5}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const SwitchBase = props => {
  const {
    value,
    values,
    getValue,
    onChange,
    touchableItem,
    getItemProps,
    ...rest
  } = props
  const Item = touchableItem ? touchableItem : TouchableItem

  return (
    <Row marginHorizontal={-6} {...rest}>
      {values.map((v, i) => {
        const _value = getValue ? getValue(v) : i
        const selected = _value === value
        const disabled = _.isObject(v) && v.disabled
        const label = _.isObject(value) ? v.label : v
        const itemProps = getItemProps ? getItemProps(v) : {}
        return (
          <Item
            key={i}
            label={label}
            disabled={disabled}
            onPress={() => onChange(_value)}
            selected={selected}
            itemProps={itemProps}
          />
        )
      })}
    </Row>
  )
}

const enhance = compose(
  setPropTypes({
    values: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
    onChange: PropTypes.func,
    getValue: PropTypes.func,
    touchableItem: PropTypes.func,
    getItemProps: PropTypes.func
  }),
  defaultProps({
    values: [],
    onChange: () => {},
    getValue: null,
    touchableItem: null,
    getItemProps: null
  })
)

export const Switch = enhance(SwitchBase)

export default Switch
