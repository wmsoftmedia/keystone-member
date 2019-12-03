import React from "react"
import styled, { View } from "glamorous-native"

import PropTypes from "prop-types"
import colors from "colors"

import { H3 } from "../Typography"
import ActivityIndicator from "../ActivityIndicator"

const shadow = {
  shadowOpacity: 0.3,
  shadowRadius: 5,
  shadowColor: colors.black30,
  shadowOffset: { width: 2, height: -2 }
}

const Container = styled.touchableHighlight(
  { height: 46, width: "100%" },
  ({ disabled, loading, secondary }) => ({
    backgroundColor: loading
      ? colors.buttonPrimary
      : disabled
      ? colors.buttonPrimary
      : secondary
      ? colors.buttonSecondary
      : colors.buttonPrimary,
    opacity: disabled && !loading ? 0.5 : 1,
    ...shadow,
    shadowOpacity: disabled ? 0 : 1
  })
)

const Label = styled(H3)(
  {
    fontWeight: "600"
  },
  ({ disabled }) => ({
    color: disabled ? colors.white50 : colors.white
  })
)

const LargeButton = props => {
  const { onPress, label, loadingLabel, disabled, loading, style, ...rest } = props

  return (
    <Container
      onPress={onPress}
      underlayColor={colors.primary3}
      activeOpacity={1}
      disabled={disabled || loading}
      loading={loading}
      {...rest}
    >
      <View flex={1} flexDirection={"row"} justifyContent="center" alignItems="center">
        {loading && <ActivityIndicator animating />}
        <Label style={style.labelText}>{loading ? loadingLabel : label}</Label>
      </View>
    </Container>
  )
}

LargeButton.propTypes = {
  label: PropTypes.string,
  loadingLabel: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object,
  secondary: PropTypes.bool.isRequired
}

LargeButton.defaultProps = {
  onPress: () => {},
  delayLongPress: 0,
  delayPressIn: 0,
  delayPressOut: 0,
  activeOpacity: 0.5,
  style: {},
  loadingLabel: "Loading...",
  secondary: false
}

export { LargeButton as default }
