import React from "react"
import { Animated, StyleSheet, Text, View } from "react-native"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import { defaultProps, setPropTypes, compose } from "recompose"
import PropTypes from "prop-types"

import colors from "colors"

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  circle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.white10
  },
  value: {
    color: colors.white,
    fontSize: 36
  }
})

class RotarySelector extends React.Component {
  panRef = React.createRef()

  calcValue = angle => {
    return -Math.round((angle * this.props.endValue) / (2 * Math.PI))
  }

  calcAngle = value => {
    return this.props.endValue
      ? -(2 * Math.PI * value) / this.props.endValue
      : 0
  }

  limitAngle = value => {
    const { minValue, maxValue } = this.props
    if (minValue && maxValue) {
      const minAngle = Math.abs(this.calcAngle(minValue))
      const maxAngle = Math.abs(this.calcAngle(maxValue))
      const absValue = Math.abs(this.calcAngle(value))
      return absValue > minAngle
        ? absValue < maxAngle
          ? value
          : maxAngle
        : minAngle
    } else {
      return value
    }
  }

  constructor(props) {
    super(props)
    this.state = { value: props.value || "" }

    this._prevAngle = new Animated.Value(Number.MAX_VALUE)
    this._rotateAngle = new Animated.Value(this.calcAngle(props.value || 0))

    this._pointX = new Animated.Value(0)
    this._pointY = new Animated.Value(0)

    this._rotateStr = Animated.add(
      this._rotateAngle,
      new Animated.Value(-0.785398) // arctang -45*. Sorry Tim, but i need this magic number :)
    ).interpolate({
      inputRange: [-1, 1],
      outputRange: ["1rad", "-1rad"]
    })

    this.onTiltGestureStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this._prevAngle.setValue(Number.MAX_VALUE)
        if (this.props.onChange) {
          this.props.onChange(this.calcValue(this._rotateAngle._value))
        }
      }
    }

    this.onTiltGestureEvent = Animated.event(
      [{ nativeEvent: { x: this._pointX, y: this._pointY } }],
      {
        listener: event => {
          const { minValue, maxValue, size } = this.props
          const x = event.nativeEvent.x - size / 2
          const y = size / 2 - event.nativeEvent.y

          const angle = -Math.atan2(y, x)

          var angleDiff = 0
          if (this._prevAngle._value === Number.MAX_VALUE) {
            angleDiff = 0
          } else {
            angleDiff = this._prevAngle._value - angle
          }

          if (angleDiff > Math.PI) {
            angleDiff -= Math.PI
          } else if (angleDiff < -Math.PI) {
            angleDiff += Math.PI
          }

          if (angleDiff > Math.PI / 2) {
            angleDiff -= Math.PI
          } else if (angleDiff < -Math.PI / 2) {
            angleDiff += Math.PI
          }

          const rotateAngle = this.limitAngle(
            this._rotateAngle._value + angleDiff
          )

          const value = this.calcValue(rotateAngle)
          if (
            ((!minValue && minValue !== 0) || minValue <= value) &&
            (!maxValue || value <= maxValue)
          ) {
            this._rotateAngle.setValue(rotateAngle)
            this._prevAngle.setValue(angle)
            this.setState({ value: value })
          } else if ((minValue || minValue === 0) && value <= minValue) {
            this.setState({ value: minValue })
            this._rotateAngle.setValue(this.calcAngle(minValue))
          } else if (maxValue && maxValue <= value) {
            this.setState({ value: maxValue })
            this._rotateAngle.setValue(this.calcAngle(maxValue))
          }
          this._updateOnGesture = true
        }
      }
    )
  }

  componentWillUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
      this._rotateAngle.setValue(this.calcAngle(nextProps.value || 0))
    }
  }

  render() {
    const { size, markerSize, borderWidth } = this.props
    const circleSize =
      size - markerSize / Math.SQRT2 - (markerSize / 2 - borderWidth / 2)

    return (
      <View width={size} height={size} opacity={this.props.disabled ? 0.5 : 1}>
        <PanGestureHandler
          ref={this.panRef}
          onGestureEvent={
            this.props.disabled ? undefined : this.onTiltGestureEvent
          }
          onHandlerStateChange={
            this.props.disabled ? undefined : this.onTiltGestureStateChange
          }
          minDist={10}
          minPointers={1}
          maxPointers={1}
          avgTouches
        >
          <View
            style={styles.container}
            collapsable={false}
            width={size}
            height={size}
          >
            <Animated.View
              style={{
                transform: [{ rotate: this._rotateStr }],
                width: size / Math.SQRT2,
                height: size / Math.SQRT2
              }}
            >
              <View
                height={markerSize}
                width={markerSize}
                borderRadius={markerSize / 2}
                backgroundColor={colors.white}
              />
            </Animated.View>
            <View
              style={styles.circle}
              borderWidth={borderWidth}
              width={circleSize}
              height={circleSize}
              borderRadius={circleSize / 2}
            >
              {this.props.renderValue(this.state.value)}
            </View>
          </View>
        </PanGestureHandler>
      </View>
    )
  }
}

const enhance = compose(
  setPropTypes({
    onChange: PropTypes.func
  }),
  defaultProps({
    minValue: null,
    maxValue: null,
    startValue: 0,
    endValue: 100,
    size: 150,
    markerSize: 20,
    borderWidth: 6,
    renderValue: value => <Text style={styles.value}>{value}</Text>
  })
)

export default enhance(RotarySelector)
