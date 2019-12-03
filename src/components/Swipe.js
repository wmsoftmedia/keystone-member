import { Animated, Easing } from "react-native"

const swiperAnimationConfig = {
  toValue: { x: 0, y: 0 },
  duration: 250,
  easing: Easing.elastic(0.5)
}

export const DEFAULT_SWIPE_PROPS = {
  swipeReleaseAnimationConfig: swiperAnimationConfig,
  swipeReleaseAnimationFn: Animated.timing,
  rightActionReleaseAnimationFn: Animated.timing,
  rightActionReleaseAnimationConfig: swiperAnimationConfig
}
