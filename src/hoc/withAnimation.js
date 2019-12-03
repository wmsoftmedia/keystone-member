import { LayoutAnimation } from "react-native"
import { lifecycle } from "recompose"

const animate = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

const withAnimation = ({
  onMount = true,
  onUpdate = true,
  onUnmount = false,
  interestingProp = undefined
}) =>
  lifecycle({
    componentWillUpdate(nextProps) {
      const shouldAnimate = interestingProp
        ? nextProps[interestingProp] !== this.props[interestingProp]
        : true
      if (onUpdate && shouldAnimate) {
        animate()
      }
    },
    componentWillUnmount() {
      if (onUnmount) {
        animate()
      }
    },
    componentWillMount() {
      if (onMount) {
        animate()
      }
    }
  })

export default withAnimation
