import { TouchableOpacity, View } from "glamorous-native"
import { compose, withProps, setDisplayName, setPropTypes } from "recompose"
import React from "react"

import {
  BodyIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EditIcon,
  FeelingsIcon,
  NutritionIcon,
  TrainingIcon
} from "kui/icons"
import { Row } from "kui/components"
import { boxShadow } from "styles"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import colors from "kui/colors"
import fonts from "kui/fonts"

/* Consts */

const iconMap = {
  feelings: FeelingsIcon,
  nutrition: NutritionIcon,
  body: BodyIcon,
  training: TrainingIcon,
  edit: EditIcon
}

/* Base */

const Base = compose(
  setDisplayName("ButtonBase"),
  setPropTypes({
    onPress: PropTypes.func.isRequired
  })
)(props => {
  const { children, onPress, ...rest } = props
  return (
    <TouchableOpacity
      opacity={props.disabled ? 0.5 : 1}
      onPress={onPress}
      padding={10}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
})

/* Variants and Aliases */

const ButtonLabel = props => (
  <Text
    color={colors.white}
    fontFamily={fonts.montserratSemiBold}
    fontSize={12}
    lineHeight={16}
    {...props}
  />
)

export const PrimaryButton = props => {
  const { label, labelProps, children, ...rest } = props
  return (
    <Base
      height={48}
      minWidth={252}
      backgroundColor={props.disabled ? colors.transparent : colors.darkBlue60}
      alignItems="center"
      justifyContent="center"
      borderRadius={8}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <Row centerXY>
          <ButtonLabel {...labelProps}>{label}</ButtonLabel>
        </Row>
      )}
    </Base>
  )
}

export const SecondaryButton = props => {
  const { label, labelProps, children, ...rest } = props
  return (
    <Base
      height={48}
      minWidth={252}
      backgroundColor={colors.transparent}
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {children ? (
        children
      ) : (
        <Row centerXY>
          <ButtonLabel {...labelProps}>{label}</ButtonLabel>
        </Row>
      )}
    </Base>
  )
}

export const TextButton = compose(
  setDisplayName("TextButton"),
  setPropTypes({ label: PropTypes.string.isRequired })
)(props => {
  const { label, labelProps, Icon, ...rest } = props
  return (
    <Base {...rest}>
      <Row centerXY>
        {Icon && <Icon />}
        <ButtonLabel {...labelProps}>{label}</ButtonLabel>
      </Row>
    </Base>
  )
})

export const TextButtonForward = props => {
  const { label, labelProps, ...rest } = props
  return (
    <Base {...rest}>
      <Row centerXY>
        <ButtonLabel {...labelProps}>{label}</ButtonLabel>
        <ChevronRightIcon size={20} color={colors.blue40} />
      </Row>
    </Base>
  )
}

export const TextButtonBackward = props => {
  const { label, labelProps, ...rest } = props
  return (
    <Base {...rest}>
      <Row centerXY>
        <ChevronLeftIcon size={20} color={colors.blue40} />
        <ButtonLabel {...labelProps}>{label}</ButtonLabel>
      </Row>
    </Base>
  )
}

export const IconButton = compose(
  setPropTypes({
    icon: PropTypes.oneOf(Object.keys(iconMap))
  })
)(props => {
  const { icon, children, iconProps, ...rest } = props
  const IconComponent = icon ? iconMap[icon] : null
  return (
    <Base {...rest}>{IconComponent ? <IconComponent {...iconProps} /> : children}</Base>
  )
})

export const FloatButton = props => {
  const { children, size = 52, color = colors.violet40, ...rest } = props
  return (
    <IconButton
      width={size}
      height={size}
      borderRadius={size}
      backgroundColor={color}
      alignItems="center"
      justifyContent="center"
      position="absolute"
      {...boxShadow}
      shadowRadius={10}
      shadowColor={"rgba(41, 11, 97, 0.5)"}
      {...rest}
    >
      {children}
    </IconButton>
  )
}

export const FloatButtonAction = props => {
  const { text, Icon, ...rest } = props
  return (
    <Row centerY {...rest}>
      <View padding={4} borderRadius={4} marginRight={12}>
        <Text variant="caption1">{text}</Text>
      </View>
      <View>{Icon && <Icon />}</View>
    </Row>
  )
}

export const ProgressButton = compose(
  setPropTypes({
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired
  }),
  withProps(props => {
    return {
      color: colors.darkBlue60,
      backgroundColor: colors.darkBlue80,
      ...props
    }
  })
)(props => {
  const {
    label,
    labelProps,
    renderLabel,
    value,
    maxValue,
    color,
    backgroundColor,
    ...rest
  } = props
  const progress = maxValue ? value / maxValue : 0
  return (
    <Base
      height={48}
      minWidth={252}
      padding={0}
      borderRadius={8}
      justifyContent="center"
      overflow="hidden"
      {...rest}
    >
      <Row top={0} left={0} height="100%" width="100%" position="absolute">
        <View heigth="100%" flex={progress} backgroundColor={color}></View>
        <View heigth="100%" flex={1 - progress} backgroundColor={backgroundColor}></View>
      </Row>
      {renderLabel ? (
        renderLabel()
      ) : (
        <Row centerXY>
          <ButtonLabel {...labelProps}>{label}</ButtonLabel>
        </Row>
      )}
    </Base>
  )
})

export default Base
