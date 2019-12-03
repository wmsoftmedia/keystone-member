import { View } from "glamorous-native"
import { actions } from "react-redux-form/native"
import { compose } from "recompose"
import { connect } from "react-redux"
import React from "react"
import moment from "moment"
import numeral from "numeral"
import _ from "lodash/fp"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { MEASUREMENTS_TRACKER_FORM } from "constants"
import { METRIC_TYPES, MEASUREMENT_KEYS, metricDisplay } from "scenes/Home/Body/display"
import { Gradient } from "components/Background"
import { feetToIn, inToFeet } from "keystone"
import { withErrorHandler, withLoader, withSettings, withMemberId } from "hoc"
import TrackerForm from "scenes/Home/Body/Tracker/TrackerForm"
import colors from "kui/colors"
import withBodyMetrics from "graphql/query/body/byDate"
import withMutations from "graphql/mutation/body/upsert"

const makeParts = (
  metrics,
  weightConverter,
  weightUnit,
  heightConverter,
  heightUnit
) => measurement => {
  if (!measurement.parts || measurement.parts.length <= 0) return measurement

  const metricParts =
    metrics && metrics[measurement.key] ? metrics[measurement.key] : null

  if (!metricParts) return measurement

  const converter =
    measurement.type === METRIC_TYPES.WEIGHT
      ? weightConverter
      : measurement.type === METRIC_TYPES.LENGTH
      ? heightUnit === "feet"
        ? compose(
            feetToIn,
            heightConverter
          )
        : heightConverter
      : v => v

  const parts = measurement.parts.map(p => {
    return {
      ...p,
      value: metricParts[p.key]
        ? numeral(converter(metricParts[p.key])).format("0.[00]")
        : "",
      measure: measurement.measure
    }
  })

  const value = parts.reduce((acc, p) => acc + (p.value ? +p.value : 0), 0)

  return { ...measurement, parts, value: numeral(value).format("0.[00]") }
}

const makeMetric = (
  metrics,
  weightConverter,
  weightUnit,
  heightConverter,
  heightUnit,
  temperatureConverter,
  temperatureUnit
) => key => {
  const value = metrics && metrics[key] ? metrics[key] : ""
  const display = metricDisplay({ key })

  const converter =
    display.type === METRIC_TYPES.WEIGHT
      ? weightConverter
      : display.type === METRIC_TYPES.LENGTH
      ? heightUnit === "feet"
        ? compose(
            feetToIn,
            heightConverter
          )
        : heightConverter
      : display.type === METRIC_TYPES.TEMPERATURE
      ? temperatureConverter
      : v => v

  const displayUnit =
    display.type === METRIC_TYPES.WEIGHT
      ? weightUnit
      : display.type === METRIC_TYPES.LENGTH
      ? heightUnit === "feet"
        ? "in"
        : heightUnit
      : display.type === METRIC_TYPES.TEMPERATURE
      ? temperatureUnit === "celsius"
        ? "°C"
        : "°F"
      : display.measure

  return {
    ...display,
    value: value ? numeral(converter(value)).format("0.[00]") : "",
    measure: displayUnit
  }
}

const getValueByKey = data => key => {
  const metric = data.find(d => d.rawKey === key)
  if (metric) {
    if (metric.parts) {
      const value = metric.parts.reduce(
        (acc, p) => ({ ...acc, [p.key]: p.value ? +p.value : null }),
        {}
      )
      return metric.value && +metric.value ? value : null
    } else {
      const value = metric.value ? +metric.value : null
      return value || null
    }
  } else {
    return null
  }
}

class Tracker extends React.Component {
  constructor(props) {
    super(props)
    props.loadData(
      props,
      props.weightConverter,
      props.weightUnit,
      props.heightConverter,
      props.heightUnit,
      props.temperatureConverter,
      props.temperatureUnit
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props.loadData(
      nextProps,
      nextProps.weightConverter,
      nextProps.weightUnit,
      nextProps.heightConverter,
      nextProps.heightUnit,
      nextProps.temperatureConverter,
      nextProps.temperatureUnit
    )
  }

  handleSave = (
    reverseWeightConverter,
    reverseHeightConverter,
    reverseTemperatureConverter
  ) => formData => {
    const { saveBodyMetrics } = this.props
    const convertedData = formData.measurements.map(metric => {
      return {
        ...metric,
        value:
          metric.type === METRIC_TYPES.WEIGHT
            ? reverseWeightConverter(metric.value)
            : metric.type === METRIC_TYPES.TEMPERATURE
            ? reverseTemperatureConverter(metric.value)
            : metric.value,
        ...(metric.parts
          ? {
              parts: metric.parts.map(p => {
                const converter =
                  metric.measure === "in"
                    ? compose(
                        reverseHeightConverter,
                        inToFeet
                      )
                    : reverseHeightConverter
                return {
                  ...p,
                  value: converter(p.value)
                }
              })
            }
          : {})
      }
    })

    return saveBodyMetrics({
      date: moment(this.props.date).format(DATE_FORMAT_GRAPHQL),
      bodyWeight: getValueByKey(convertedData)("bodyWeight"),
      bodyFatPercentage: getValueByKey(convertedData)("bodyFatPercentage"),
      bodyFatMass: getValueByKey(convertedData)("bodyFatMass"),
      skeletalMuscleMass: getValueByKey(convertedData)("skeletalMuscleMass"),
      circumference: getValueByKey(convertedData)("circumference"),
      sleepHours: getValueByKey(convertedData)("sleepHours"),
      heartRateVar: getValueByKey(convertedData)("heartRateVar"),
      heartRate: getValueByKey(convertedData)("heartRate"),
      bodyTemp: getValueByKey(convertedData)("bodyTemp")
    }).catch(e => {
      console.error(e)
    })
  }

  render() {
    return (
      <View flex={1}>
        <Gradient />
        <TrackerForm
          favourites={this.props.favourites}
          onSubmit={this.handleSave(
            this.props.reverseWeightConverter,
            this.props.reverseHeightConverter,
            this.props.reverseTemperatureConverter
          )}
        />
      </View>
    )
  }
}

const loadFormData = (
  dispatch,
  weightConverter,
  weightUnit,
  heightConverter,
  heightUnit,
  temperatureConverter,
  temperatureUnit
) => ({ data }) => {
  const bodyMetrics = _.getOr({}, "metricDayByDate", data) || {}
  const measurements = MEASUREMENT_KEYS.map(
    makeMetric(
      bodyMetrics,
      weightConverter,
      weightUnit,
      heightConverter,
      heightUnit,
      temperatureConverter,
      temperatureUnit
    )
  ).map(
    makeParts(
      bodyMetrics,
      weightConverter,
      weightUnit,
      heightConverter,
      heightUnit,
      temperatureConverter,
      temperatureUnit
    )
  )

  dispatch(actions.load(MEASUREMENTS_TRACKER_FORM, { measurements }))
}

const mapDispatchToProps = dispatch => ({
  loadData: (
    data,
    weightConverter,
    weightUnit,
    heightConverter,
    heightUnit,
    temperatureConverter,
    temperatureUnit
  ) =>
    loadFormData(
      dispatch,
      weightConverter,
      weightUnit,
      heightConverter,
      heightUnit,
      temperatureConverter,
      temperatureUnit
    )(data)
})

const screen = compose(
  withSettings,
  withErrorHandler,
  withMutations,
  withMemberId,
  withBodyMetrics,
  withLoader({
    color: colors.white,
    backgroundColor: colors.transparent,
    message: "Loading..."
  }),
  connect(
    null,
    mapDispatchToProps
  )
)

export default screen(Tracker)
