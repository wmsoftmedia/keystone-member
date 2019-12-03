import { Control, Form, actions } from "react-redux-form/native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Screen } from "components/Background"
import { View } from "glamorous-native"
import { compose, withProps } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"
import * as Sentry from "sentry-expo"
import moment from "moment"
import numeral from "numeral"
import _ from "lodash/fp"

import { BODY_TRACKER_FORM } from "constants"
import { COMPLEX_METRICS, COMPLEX_PARTS, metricDisplay } from "scenes/Home/Body/display"
import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { Row } from "kui/components"
import { inputPropsMapper } from "keystone/forms/rrf"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { normalizeMeasurementField } from "scenes/Home/Body/Tracker/validate"
import { withLoader, withRRFLoader } from "hoc"
import Card from "kui/components/Card"
import MeasurementField from "scenes/Home/Body/Tracker/MeasurementField"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withBodyMetrics from "graphql/query/body/byDate"
import withMetricConverter from "scenes/Home/Body/withMetricConverter"
import withMutations from "graphql/mutation/body/upsert"

const DataEntry = ({ metricKey, onSubmit, measurement, isComplex, total }) => {
  return (
    <Screen>
      <Form
        flex={1}
        model={BODY_TRACKER_FORM}
        onSubmit={onSubmit}
        validators={{ [metricKey]: v => (isComplex && !!total) || (!isComplex && !!v) }}
      >
        <Text variant="h1" paddingVertical={20} textAlign="center" fontSize={22}>
          Add your {measurement.label.toLowerCase()}
        </Text>
        <KeyboardAwareScrollView enableOnAndroid keyboardOpeningTime={100}>
          {isComplex ? (
            <View>
              <MeasurementsCard marginBottom={20}>
                {measurement.parts.map(p => (
                  <View key={p.key}>
                    <Control
                      model={`.${metricKey}.${p.key}`}
                      component={MeasurementField}
                      parser={_.replace(",", ".")}
                      normalize={normalizeMeasurementField}
                      measurement={{ measure: measurement.measure, label: p.label }}
                      mapProps={inputPropsMapper}
                    />
                  </View>
                ))}
              </MeasurementsCard>
              <MeasurementsCard marginBottom={20}>
                <Row spread centerY paddingVertical={16} paddingRight={8}>
                  <Text variant="body2">Total {measurement.label}</Text>
                  <Text variant="body2">
                    {total ? total : "_ _ _"} {measurement.measure}
                  </Text>
                </Row>
              </MeasurementsCard>
            </View>
          ) : (
            <MeasurementsCard>
              <Control
                model={`.${metricKey}`}
                component={MeasurementField}
                parser={_.replace(",", ".")}
                normalize={normalizeMeasurementField}
                measurement={measurement}
                mapProps={inputPropsMapper}
              />
            </MeasurementsCard>
          )}
        </KeyboardAwareScrollView>
      </Form>
    </Screen>
  )
}

export const MeasurementsCard = p => (
  <Card
    paddingRight={16}
    paddingLeft={20}
    paddingVertical={8}
    backgroundColor={colors.darkBlue90}
    marginHorizontal={20}
    elevation={4}
    shadowOpacity={0.2}
    shadowColor={colors.black}
    shadowOffset={{ width: 5, height: 5 }}
    shadowRadius={10}
    {...p}
  />
)

const enhance = compose(
  withMetricConverter,
  withBodyMetrics,
  withMutations,
  withNavigation,
  withLoader({ message: "Loading..." }),
  withProps(({ metricKey }) => ({ isComplex: COMPLEX_METRICS.includes(metricKey) })),
  connect(
    (state, { isComplex, metricKey }) => {
      if (!isComplex) return {}

      const metric = _.getOr(null, `${BODY_TRACKER_FORM}.circumference`, state)
      const total = COMPLEX_PARTS[metricKey].reduce(
        (acc, p) => acc + (metric && metric[p] ? +metric[p] : 0),
        0
      )

      return { total }
    },
    (
      dispatch,
      {
        metricKey,
        bodyMetrics,
        saveBodyMetrics,
        date,
        converter,
        reverseConverter,
        navigation,
        isComplex
      }
    ) => {
      // dispatch(actions.setPristine(BODY_TRACKER_FORM))
      return {
        loadData: () => {
          dispatch(
            actions.load(BODY_TRACKER_FORM, {
              [metricKey]: isComplex
                ? bodyMetrics && bodyMetrics[metricKey]
                  ? COMPLEX_PARTS[metricKey].reduce(
                      (acc, p) => ({
                        ...acc,
                        [p]: bodyMetrics[metricKey][p]
                          ? numeral(converter(bodyMetrics[metricKey][p])).format("0.[00]")
                          : null
                      }),
                      {}
                    )
                  : {}
                : bodyMetrics && bodyMetrics[metricKey]
                ? numeral(converter(bodyMetrics[metricKey])).format("0.[00]")
                : ""
            })
          )
        },
        onSubmit: formData => {
          dispatch(actions.setPristine(BODY_TRACKER_FORM))

          const metric = formData && formData[metricKey] ? formData[metricKey] : null
          const total = isComplex
            ? COMPLEX_PARTS[metricKey].reduce(
                (acc, p) => acc + (metric && metric[p] ? +metric[p] : 0),
                0
              )
            : null

          saveBodyMetrics({
            date: moment(date).format(DATE_FORMAT_GRAPHQL),
            [metricKey]: isComplex
              ? metric && total && total > 0
                ? COMPLEX_PARTS[metricKey].reduce(
                    (acc, p) => ({
                      ...acc,
                      [p]: metric[p] ? reverseConverter(+metric[p]) : null
                    }),
                    {}
                  )
                : null
              : metric
              ? reverseConverter(+metric)
              : null
          })
            .then()
            .catch(e => {
              logErrorWithMemberId(mId => {
                Sentry.captureException(
                  new Error(
                    `MId:{${mId}}, Scope:{Body.DataEntry.onSubmit}, ${JSON.stringify(e)}`
                  )
                )
              })
            })
          navigation.goBack()
        }
      }
    }
  ),
  withRRFLoader,
  withProps(({ metricKey, displayUnit }) => {
    return { measurement: { ...metricDisplay({ key: metricKey }), measure: displayUnit } }
  })
)

export default enhance(DataEntry)
