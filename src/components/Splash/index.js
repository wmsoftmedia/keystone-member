import { Animated, Easing, StyleSheet } from "react-native"
import { View } from "glamorous-native"
import { compose, defaultProps, lifecycle, withProps, withState } from "recompose"
import React from "react"

import { Bubble1, Bubble2, Bubble3, KeystoneK } from "kui/icons"
import { Gradient } from "components/Background"
import AnimatedEllipsis from "components/AnimatedEllipsis"
import CenterView from "components/CenterView"
import Text from "kui/components/Text"
import colors from "kui/colors"

const Bubble = props => {
  const { conf, variant, ...rest } = props
  return (
    <View position="absolute" {...rest}>
      {variant === "b1" && <Bubble1 opacity={0.2} {...conf} />}
      {variant === "b2" && <Bubble2 opacity={0.2} {...conf} />}
      {variant === "b3" && <Bubble3 opacity={0.2} {...conf} />}
    </View>
  )
}

const Bubbles = ({ animation }) => {
  const scaleX = animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] })
  const scaleY = animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] })
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { transform: [{ scaleX }, { scaleY }] }]}
    >
      <Bubble variant={"b1"} right={30} top={38} />
      <Bubble variant={"b2"} left={-28} top={96} conf={{ size: 64, opacity: 0.1 }} />
      <Bubble variant={"b3"} right={47} top={256} conf={{ size: 16, opacity: 0.1 }} />
      <Bubble variant={"b3"} left={39} bottom={"30%"} conf={{ opacity: 0.1 }} />
      <Bubble variant={"b2"} right={-34} bottom={"25%"} conf={{ opacity: 0.2 }} />
      <Bubble
        variant={"b3"}
        left={"50%"}
        bottom={28}
        conf={{ size: 34, opacity: 0.05 }}
      />
      <Bubble variant={"b1"} left={-34} bottom={-39} conf={{ size: 94 }} />
    </Animated.View>
  )
}

const Splash = props => {
  const { hasMessage, hideLogo, message, disableEllipsis, breather, ...rest } = props
  const opacity = breather
  const scaleX = breather.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] })
  const scaleY = breather.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] })
  return (
    <CenterView {...rest}>
      <Gradient />
      <Bubbles animation={breather} />
      {!hideLogo && (
        <Animated.View style={{ opacity, transform: [{ scaleX }, { scaleY }] }}>
          <KeystoneK scale={0.8} opacity={1} />
        </Animated.View>
      )}
      {hasMessage && (
        <View position="absolute" bottom={82}>
          <Text color={colors.darkBlue20}>
            {message}
            {!disableEllipsis && <AnimatedEllipsis />}
          </Text>
        </View>
      )}
    </CenterView>
  )
}

const enhance = compose(
  defaultProps({
    hideLogo: false,
    disableEllipsis: false,
    message: ""
  }),
  withProps(({ message }) => ({
    hasMessage: message && message !== ""
  })),
  withState("breather", "setBreather", new Animated.Value(0.05)),
  lifecycle({
    componentDidMount() {
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.props.breather, {
            toValue: 1,
            duration: 2000,
            ease: Easing.linear,
            useNativeDriver: true
          }),
          Animated.timing(this.props.breather, {
            toValue: 0.05,
            duration: 2000,
            ease: Easing.linear,
            useNativeDriver: true
          })
        ])
      ).start()
    }
  })
)

export default enhance(Splash)
