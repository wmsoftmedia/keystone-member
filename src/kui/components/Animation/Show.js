import React from "react"
import { Animated } from "react-native"

class Show extends React.Component {
  static defaultProps = {
    duration: 300,
    visible: true
  }

  state = {
    animation: this.props.visible ? new Animated.Value(1) : new Animated.Value(0),
    visible: this.props.visible
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.setState({ visible: true })
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: this.props.duration,
          useNativeDriver: true
        }).start()
      } else {
        Animated.timing(this.state.animation, {
          toValue: 0,
          duration: this.props.duration,
          useNativeDriver: true
        }).start(() => {
          this.setState({ visible: false })
        })
      }
    }
  }

  render() {
    const { children, style, visible, ...rest } = this.props
    return (
      this.state.visible && (
        <Animated.View
          {...rest}
          style={[
            {
              opacity: this.state.animation,
              transform: [
                {
                  scale: this.state.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1]
                  })
                }
              ]
            },
            this.props.style
          ]}
        >
          {children}
        </Animated.View>
      )
    )
  }
}

export default Show
