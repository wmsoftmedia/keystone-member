import { View } from "glamorous-native"
import { WebView } from "react-native-webview"
import React from "react"

import colors from "kui/colors"

const privacyLink = "https://keystone.fit/privacy?zen=true"

class Privacy extends React.Component {
  render() {
    return (
      <View flex={1} backgroundColor={colors.white}>
        <WebView source={{ uri: privacyLink }} startInLoadingState />
      </View>
    )
  }
}

export default Privacy
