import { View } from "glamorous-native"
import React from "react"

import { Gradient } from "components/Background"

const KitchenPage = props => {
  const { children } = props
  return (
    <View flex={1}>
      <Gradient />
      {children}
    </View>
  )
}

export default KitchenPage
