import { View } from "glamorous-native"
import React from "react"

import { ChevronDownIcon } from "kui/icons"

export const ModalBackButton = () => (
  <View padding={10}>
    <ChevronDownIcon svgProps={{ viewBox: "0 0 20 20" }} size={40} />
  </View>
)
