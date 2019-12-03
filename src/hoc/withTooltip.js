import { compose, withProps } from "recompose"
import { copilot } from "react-native-copilot"

import { Message } from "kui/components/Tooltip"
import colors from "kui/colors"

const defaultOptions = {
  backdropColor: colors.bg1_90,
  stepNumberComponent: () => null,
  tooltipComponent: Message,
  verticalOffset: 0,
  animated: true
}

export const withTooltip = (options = defaultOptions) =>
  compose(
    copilot(options),
    withProps(({ start, copilotEvents, currentStep }) => ({
      startTooltip: start,
      tooltipEvents: copilotEvents,
      currentTooltipStep: currentStep
    }))
  )

export default withTooltip()
