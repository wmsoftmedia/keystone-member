import { View } from "glamorous-native"
import React from "react"

import { Gradient } from "components/Background"
import PartFields from "scenes/Home/Body/Tracker/PartFields"

const Parts = props => {
  const { measurement, ...rest } = props
  return (
    <View flex={1}>
      <Gradient />
      <PartFields measurement={measurement} {...rest} />
    </View>
  )
}

export default Parts
