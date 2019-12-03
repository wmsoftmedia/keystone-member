import { Text, TouchableOpacity, View } from "glamorous-native"
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons"
import MIcon from "react-native-vector-icons/MaterialIcons"
import React from "react"

import PropTypes from "prop-types"

import colors from "../../colors"

const IconButton = props => {
  const { disabled, onPress, ...rest } = props
  return (
    <Icon.Button
      opacity={disabled ? 0.3 : 1}
      onPress={disabled ? undefined : onPress}
      backgroundColor={"transparent"}
      {...rest}
    />
  )
}

IconButton.defaultProps = {
  size: 20,
  iconStyle: {
    borderRadius: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 0,
    marginLeft: 0,
    marginRight: 0
  },
  borderRadius: 0,
  padding: 0,
  paddingHorizontal: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  margin: 0,
  marginLeft: 0,
  marginRight: 0
}

IconButton.propTypes = {
  size: PropTypes.number.isRequired,
  iconStyle: PropTypes.object.isRequired,
  onPress: PropTypes.func
}

export default IconButton

// ---------------------- Variations ------------------------

export const IconButtonRemove = ({ ...rest }) => (
  <IconButton color={colors.warningRed} name={"close"} {...rest} />
)

export const IconButtonClose = ({ ...rest }) => (
  <IconButton color={colors.primary3} name={"close"} {...rest} />
)

export const IconButtonAdd = ({ ...rest }) => (
  <IconButton color={colors.primary3} name={"add"} {...rest} />
)

export const IconButtonConfirm = ({ ...rest }) => (
  <IconButton color={colors.primary3} name={"check"} {...rest} />
)

export const IconButtonColumnAdd = ({ title, titleProps, ...rest }) => (
  <IconButton
    height={46}
    color={colors.primary2}
    name={"add"}
    backgroundColor={colors.black6}
    paddingLeft={5}
    size={24}
    {...rest}
  >
    <Text fontSize={18} color={colors.textLight} fontWeight={"700"} {...titleProps}>
      {title}
    </Text>
  </IconButton>
)

export const IconButtonFooter = ({
  title,
  titleProps,
  onPress,
  icon,
  iconFamily = "md",
  color = colors.primary5,
  size = 24,
  ...rest
}) => {
  const Icon = iconFamily === "mdc" ? MCIcon : MIcon
  return (
    <View backgroundColor={colors.black6} {...rest}>
      <View
        flex={1}
        activeOpacity={0.7}
        flexDirection="column"
        onPress={onPress}
        alignItems={"center"}
        padding={10}
        justifyContent="center"
      >
        <View>
          <Icon color={color} name={icon} size={size} />
        </View>
        {title && (
          <Text fontSize={18} color={color} {...titleProps}>
            {title}
          </Text>
        )}
      </View>
    </View>
  )
}

export const IconButtonColumnAddMeal = ({
  title,
  titleProps,
  onPress,
  icon,
  ...rest
}) => (
  <View backgroundColor={colors.black6} {...rest}>
    <TouchableOpacity
      flex={1}
      activeOpacity={0.7}
      flexDirection="row"
      onPress={onPress}
      alignItems={"center"}
      paddingVertical={10}
      paddingHorizontal={10}
    >
      <Text
        fontSize={18}
        color={colors.textLight}
        fontWeight={"700"}
        paddingRight={5}
        {...titleProps}
      >
        {title}
      </Text>
      <MIcon color={colors.primary5} name={icon} paddingLeft={5} size={24} />
      <Text fontSize={14} fontWeight="800" color={colors.primary5}>
        +
      </Text>
    </TouchableOpacity>
  </View>
)
