import { METRIC_TYPES, metricDisplay } from "scenes/Home/Body/display"
import { compose, withProps } from "recompose"
import { feetToIn, inToFeet } from "keystone"
import withSettings from "hoc/withSettings"

export const withMetricConverter = withProps(
  ({
    metricKey,
    weightUnit,
    weightConverter,
    heightUnit,
    heightConverter,
    reverseWeightConverter,
    reverseHeightConverter,
    temperatureUnit,
    temperatureConverter,
    reverseTemperatureConverter
  }) => {
    const aboutMetric = metricDisplay({ key: metricKey })

    const converter =
      aboutMetric.type === METRIC_TYPES.WEIGHT
        ? weightConverter
        : aboutMetric.type === METRIC_TYPES.LENGTH
        ? heightUnit === "feet"
          ? compose(
              feetToIn,
              heightConverter
            )
          : heightConverter
        : aboutMetric.type === METRIC_TYPES.TEMPERATURE
        ? temperatureConverter
        : v => v

    const reverseConverter =
      aboutMetric.type === METRIC_TYPES.WEIGHT
        ? reverseWeightConverter
        : aboutMetric.type === METRIC_TYPES.LENGTH
        ? heightUnit === "feet"
          ? compose(
              inToFeet,
              reverseHeightConverter
            )
          : reverseHeightConverter
        : aboutMetric.type === METRIC_TYPES.TEMPERATURE
        ? reverseTemperatureConverter
        : v => v

    const displayUnit =
      aboutMetric.type === METRIC_TYPES.WEIGHT
        ? weightUnit
        : aboutMetric.type === METRIC_TYPES.LENGTH
        ? heightUnit === "feet"
          ? "in"
          : heightUnit
        : aboutMetric.type === METRIC_TYPES.TEMPERATURE
        ? temperatureUnit === "celsius"
          ? "°C"
          : "°F"
        : aboutMetric.measure

    return { displayUnit, converter, reverseConverter }
  }
)

export default compose(
  withSettings,
  withMetricConverter
)
