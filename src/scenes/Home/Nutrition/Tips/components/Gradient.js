import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet } from "react-native"
import React from "react"

import { gradients } from "kui/colors"

export default ({ borderRadius = 12 }) => {
  return (
    <LinearGradient
      colors={gradients.gaugeGradient}
      style={[StyleSheet.absoluteFill, { borderRadius }]}
      start={[0, 1]}
      end={[1, 0]}
    />
  )
}
