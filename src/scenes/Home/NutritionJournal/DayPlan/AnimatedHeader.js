import { Animated, Easing, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"

import CompactHeader from "scenes/Home/NutritionJournal/DayPlan/CompactHeader"
import colors from "kui/colors"

const WIDGET_HEIGHT = 100

export const swiperRecenterAnimationConfig = {
  toValue: { x: 0, y: 0 },
  duration: 100,
  easing: Easing.out(Easing.ease)
}

const AnimatedHeader = ({ animationRange, target, consumed, blockHeader, offset }) => {
  const animatePFCWidget = {
    opacity: animationRange.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, 1]
    })
  }

  const animateHeader = {
    transform: [
      {
        translateY: animationRange.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -offset]
        })
      }
    ]
  }

  return (
    <View position="absolute" width="100%" pointerEvents="box-none">
      <Animated.View
        position="absolute"
        style={[animateHeader]}
        width="100%"
        height={WIDGET_HEIGHT + offset}
        pointerEvents="box-none"
      >
        <View position="absolute" bottom={0} width="100%" pointerEvents="box-none">
          <Animated.View style={[animatePFCWidget]} pointerEvents="none">
            <View
              flex={1}
              backgroundColor={colors.bg1_10}
              paddingHorizontal={20}
              paddingBottom={8}
              paddingTop={40}
              shadowOpacity={1}
              shadowColor={colors.black50}
              shadowOffset={{ width: 10, height: 10 }}
              shadowRadius={30}
              elevation={8}
              minHeight={WIDGET_HEIGHT + 40}
            >
              <LinearGradient
                colors={[colors.bg1, colors.bg1_90]}
                style={[StyleSheet.absoluteFill]}
                start={[0.5, 0.7]}
                end={[0.5, 1]}
              />
              <CompactHeader target={target} consumed={consumed} />
            </View>
          </Animated.View>
          {blockHeader && (
            <View
              position="absolute"
              width="100%"
              height="100%"
              backgroundColor="transparent"
            />
          )}
        </View>
      </Animated.View>
    </View>
  )
}

export default AnimatedHeader
