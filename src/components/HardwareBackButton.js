import React from "react"
import { BackHandler } from "react-native"

class HardwareBackButton extends React.Component {
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }
  onBackPress = () => {
    const { onBackPress, goBack = false } = this.props
    onBackPress()
    return !goBack
  }

  render() {
    const { children = null } = this.props
    return children
  }
}

export default HardwareBackButton
