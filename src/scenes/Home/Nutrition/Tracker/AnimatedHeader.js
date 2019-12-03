import { Animated, View } from "react-native"
import React from "react"

import PFCWidget from "scenes/Home/Nutrition/components/PFCWidget"
import colors from "kui/colors"

const PFC_WIDGET_HEIGHT = 137

const AnimatedHeader = ({ animationRange, totals, profile, blockHeader, offset }) => {
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
        height={PFC_WIDGET_HEIGHT + offset}
        pointerEvents="box-none"
      >
        <View position="absolute" bottom={0} width="100%" pointerEvents="box-none">
          <Animated.View style={[animatePFCWidget]} pointerEvents="none">
            <View
              flex={1}
              backgroundColor={colors.bg1_90}
              paddingHorizontal={20}
              paddingBottom={8}
              paddingTop={40}
              shadowOpacity={1}
              shadowColor={colors.black50}
              shadowOffset={{ width: 10, height: 10 }}
              shadowRadius={30}
              elevation={6}
            >
              <PFCWidget totals={totals} profile={profile} />
            </View>
          </Animated.View>
          {/* Stupid way to block tap/scroll events
              under this header (when it's visible)
              cause pointerEvents doesn't work
          */}
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
