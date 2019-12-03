import { Control } from "react-redux-form/native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Text, View } from "glamorous-native"
import { compose } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { MEASUREMENTS_TRACKER_FORM } from "constants"
import { IconButton } from "kui/components/Button"
import { InputRow } from "kui/components/Input"
import { Row } from "kui/components"
import { inputPropsMapper } from "keystone/forms/rrf"
import { normalizeMeasurementField } from "scenes/Home/Body/Tracker/validate"
import { routes } from "navigation/routes"
import Card from "kui/components/Card"
import MeasurementField from "scenes/Home/Body/Tracker/MeasurementField"
import _ from "lodash/fp"
import colors from "kui/colors"
import fonts from "kui/fonts"

export const MeasurementsCard = p => (
  <Card
    paddingRight={16}
    paddingLeft={20}
    paddingVertical={8}
    backgroundColor={colors.darkBlue90}
    marginHorizontal={20}
    {...p}
  />
)

const MeasurementFields = props => {
  const { measurements, navigation } = props
  const [withParts, withoutParts] = _.partition(
    "parts",
    measurements.map((m, index) => ({ ...m, index }))
  )
  return (
    <View flex={1}>
      <KeyboardAwareScrollView enableOnAndroid keyboardOpeningTime={100}>
        <Text
          color={colors.white}
          fontSize={24}
          lineHeight={36}
          textAlign="center"
          paddingBottom={12}
          paddingHorizontal={20}
          paddingTop={12}
        >
          Add your measurements
        </Text>
        <MeasurementsCard>
          {withoutParts.map((measurement, i) => (
            <Control
              key={i}
              index={i}
              model={`${MEASUREMENTS_TRACKER_FORM}.measurements[${i}].value`}
              measurement={measurement}
              normalize={normalizeMeasurementField}
              component={MeasurementField}
              mapProps={inputPropsMapper}
              parser={_.replace(",", ".")}
            />
          ))}
        </MeasurementsCard>
        {withParts.map((m, i) => (
          <MeasurementsCard key={i} marginTop={20} height={72} justifyContent="center">
            <InputRow
              label={m.label}
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
                    {m.value && +m.value !== 0 ? m.value : "_ _ _"} {m.measure}
                  </Text>
                  <View>
                    <IconButton
                      padding={0}
                      paddingLeft={20}
                      icon="edit"
                      onPress={() =>
                        navigation.navigate(routes.BodyTrackerParts, { measurement: m })
                      }
                    />
                  </View>
                </Row>
              )}
            />
          </MeasurementsCard>
        ))}
      </KeyboardAwareScrollView>
    </View>
  )
}

const enhance = compose(withNavigation)

export default enhance(MeasurementFields)
