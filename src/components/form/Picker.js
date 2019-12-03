import Picker from "components/Picker"
import { withProps } from "recompose"

export default withProps(props => ({
  value: props.modelValue || props.value
}))(Picker)
