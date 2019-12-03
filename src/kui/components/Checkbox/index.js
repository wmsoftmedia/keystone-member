import { TouchableOpacity } from "glamorous-native"
import { compose, setDisplayName, setPropTypes } from "recompose"
import React from "react"

import { CheckboxActiveIcon, CheckboxInactiveIcon } from "kui/icons"
import Text from "kui/components/Text"
import { Row } from "kui/components"
import colors from "kui/colors"
import PropTypes from "prop-types"

const Checkbox = compose(
  setDisplayName("Checkbox"),
  setPropTypes({
    onChange: PropTypes.func.isRequired
  })
)(props => {
  const { checked, onChange, label, labelProps, description, ...rest } = props
  return (
    <TouchableOpacity
      opacity={props.disabled ? 0.5 : 1}
      onPress={() => onChange(!checked)}
      {...rest}
    >
      <Row centerY>
        {checked ? <CheckboxActiveIcon /> : <CheckboxInactiveIcon />}
        {!!label && (
          <Text marginLeft={12} variant="body1" {...labelProps}>
            {label}
          </Text>
        )}
      </Row>
      {!!description && (
        <Text marginTop={8} variant="caption1" color={colors.white60}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  )
})

export default Checkbox
