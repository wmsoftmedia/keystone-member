import { View } from "glamorous-native"
import { Dimensions } from "react-native"
import { defaultProps } from "recompose"
import React from "react"
import AutoHeightImage from "react-native-auto-height-image"

const BGView = ({ children, bgColor, bgImage, ...rest }) => {
  const { width } = Dimensions.get("window")
  return (
    <View flex={1} {...rest}>
      {bgImage && (
        <AutoHeightImage
          position="absolute"
          top={0}
          left={0}
          source={bgImage}
          width={width}
        />
      )}
      {children}
    </View>
  )
}

export default defaultProps({
  bgImage: null
})(BGView)
