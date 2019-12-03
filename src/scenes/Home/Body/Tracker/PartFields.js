import { Control } from "react-redux-form/native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Text, View } from "glamorous-native"
import { compose } from "recompose"
import { connect } from "react-redux"
import React from "react"

import { MEASUREMENTS_TRACKER_FORM } from "constants"
import { InputRow } from "kui/components/Input"
import { MeasurementsCard } from "scenes/Home/Body/Tracker/MeasurementFields"
import { Row } from "kui/components"
import { inputPropsMapper } from "keystone/forms/rrf"
import { normalizeMeasurementField } from "scenes/Home/Body/Tracker/validate"
import MeasurementField from "scenes/Home/Body/Tracker/MeasurementField"
import _ from "lodash/fp"
import colors from "kui/colors"
import fonts from "kui/fonts"

const Total = compose(
  connect((state, ownProps) => {
    const { measurement } = ownProps
    const targetField = `${MEASUREMENTS_TRACKER_FORM}.measurements[${measurement.index}].value`
    const total = _.getOr(0, targetField, state)
    return { total }
  })
)(props => {
  const { measurement, total } = props
  const { measure, label } = measurement
  return (
    <InputRow
      label={`Total ${label}`}
      labelProps={{ fontFamily: fonts.montserratSemiBold }}
      inputProps={{
        maxLength: 6,
        keyboardType: "numeric"
      }}
      renderInput={() => (
        <Row centerY justifyContent="flex-end">
          <Text
            color={colors.white}
            fontFamily={fonts.montserratSemiBold}
            lineHeight={16}
            fontSize={15}
          >
            {total && +total !== 0 ? total : "_ _ _"} {measure}
          </Text>
        </Row>
      )}
    />
  )
})

const PartFields = props => {
  const { measurement } = props
  const { parts, index: measurementIndex } = measurement

  return (
    <View flex={1}>
      <KeyboardAwareScrollView enableOnAndroid keyboardOpeningTime={100}>
        <MeasurementsCard>
          {parts.map((part, i) => (
            <Control
              key={i}
              model={`${MEASUREMENTS_TRACKER_FORM}.measurements[${measurementIndex}].parts[${i}].value`}
              label={part.label}
              normalize={normalizeMeasurementField}
              mapProps={inputPropsMapper}
              component={p => <MeasurementField measurement={part} {...p} />}
              parser={_.replace(",", ".")}
            />
          ))}
        </MeasurementsCard>
        <MeasurementsCard justifyContent="center" marginTop={20} height={72}>
          <Total measurement={measurement} />
        </MeasurementsCard>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default PartFields
