import { ActivityIndicator, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { View } from "glamorous-native"
import React from "react"

import { cardTopStyle } from "styles"
import AnimatedEllipsis from "components/AnimatedEllipsis"
import CenterView from "components/CenterView"
import Text from "kui/components/Text"
import colors, { gradients } from "kui/colors"

export const Gradient = props => {
  const { card = false, colors = gradients.bg } = props
  return (
    <LinearGradient
      colors={card ? gradients.card : colors}
      style={[StyleSheet.absoluteFill]}
    />
  )
}

export const Screen = ({ children, ...rest }) => (
  <View flex={1} {...rest}>
    <Gradient />
    {children}
  </View>
)

export const ModalScreen = ({ children, grabby = false, gradient = true, ...rest }) => (
  <View flex={1} {...cardTopStyle} backgroundColor={gradients.card[0]} {...rest}>
    {gradient && (
      <LinearGradient
        colors={gradients.card}
        style={[StyleSheet.absoluteFill, { ...cardTopStyle, marginTop: 20 }]}
      />
    )}
    {grabby && (
      <View
        marginVertical={16}
        borderRadius={10}
        height={2}
        width={104}
        backgroundColor={colors.darkBlue70}
        opacity={0.5}
        alignSelf="center"
      />
    )}
    {children}
  </View>
)

export const LoadingSplash = ({ message = "Loading", ...rest }) => (
  <CenterView {...StyleSheet.absoluteFill} zIndex={1001} opacity={0.9} {...rest}>
    <Gradient />
    <ActivityIndicator animating size="small" color={colors.white} />
    <Text color={colors.white} paddingTop={8}>
      {message}
      <AnimatedEllipsis />
    </Text>
  </CenterView>
)
