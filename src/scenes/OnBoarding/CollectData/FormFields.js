import { Control } from "react-redux-form/native"
import { View } from "glamorous-native"
import DatePicker from "react-native-datepicker"
import React from "react"
import moment from "moment"

import { DATE_FORMAT_DISPLAY, DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { Row } from "kui/components"
import { Switch } from "kui/components/Switch"
import { TextInput, HeightTextInput } from "kui/components/Input"
import { convertWeight } from "keystone"
import RadioButtonList from "components/form/RadioButton"
import _ from "lodash/fp"
import colors from "kui/colors"
import fonts from "kui/fonts"

export const WEIGHT_SETTINGS = ["kg", "lbs"]
export const HEIGHT_SETTINGS = ["cm", "feet"]

export const FIELDS = [
  {
    title: "My Goal",
    Field: () => (
      <Control
        model=".goal"
        component={RadioButtonList}
        controlProps={{
          values: ["Lose Weight", "Get Toned", "Build Muscle", "Get Fit"]
        }}
      />
    ),
    validation: { goal: val => !!val }
  },
  {
    title: "My Gender",
    Field: () => (
      <Control
        model=".gender"
        component={RadioButtonList}
        controlProps={{
          values: ["Not Specified", "Male", "Female", "Other"]
        }}
      />
    ),
    validation: { gender: () => true }
  },
  {
    title: "My Date of Birth",
    Field: () => (
      <Control
        model=".dateOfBirth"
        component={({ value, onChange }) => {
          const maxDate = moment().subtract(18, "years")
          const selectedDate = value ? moment(value).toDate() : null
          return (
            <View>
              <DatePicker
                date={selectedDate}
                mode="date"
                format={DATE_FORMAT_DISPLAY}
                onDateChange={date =>
                  onChange(moment(date, DATE_FORMAT_DISPLAY).format(DATE_FORMAT_GRAPHQL))
                }
                maxDate={maxDate.toDate()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                placeholder="Date of Birth"
                style={{ width: "100%" }}
                customStyles={{
                  dateInput: {
                    paddingHorizontal: 8,
                    borderWidth: 1,
                    alignItems: "flex-start",
                    borderRadius: 8,
                    backgroundColor: colors.darkBlue90,
                    borderColor: colors.darkBlue70
                  },
                  dateText: {
                    color: colors.white,
                    fontSize: 12,
                    lineHeight: 16,
                    fontFamily: fonts.montserrat
                  }
                }}
              />
            </View>
          )
        }}
      />
    ),
    validation: {
      dateOfBirth: val =>
        !val || moment(val || undefined) <= moment().subtract(18, "years")
    }
  },
  {
    title: "My Weight",
    Field: () => <Control model=".weight" component={WeightField} />,
    validation: {
      weight: ({ value, weightUnit }) => {
        if (_.trim(value || "") === "") {
          return true
        }
        const kgWeight = convertWeight(weightUnit, "kg", false, +value)
        return !!value && kgWeight >= 20 && kgWeight <= 500
      }
    }
  },
  {
    title: "My Height",
    Field: () => <Control model=".height" component={HeightField} />,
    validation: {
      height: ({ value }) => {
        if (_.trim(value || "") === "") {
          return true
        }
        const cmHeight = +value
        return !!cmHeight && cmHeight >= 40 && cmHeight <= 300
      }
    }
  }
]

const WeightField = ({ value, onChange }) => {
  const weight = value.value
  const unit = value.weightUnit
  return (
    <View>
      <Row paddingBottom={20} centerX>
        <Switch
          flex={0.5}
          values={WEIGHT_SETTINGS.map(s => s.toUpperCase())}
          value={WEIGHT_SETTINGS.findIndex(t => t === unit)}
          onChange={i =>
            onChange({
              value: convertWeight(unit, WEIGHT_SETTINGS[i], true, weight),
              weightUnit: WEIGHT_SETTINGS[i]
            })
          }
        />
      </Row>
      <TextInput
        placeholder="Your weight"
        keyboardType="numeric"
        returnKeyType="done"
        selectTextOnFocus={true}
        maxLength={6}
        value={weight ? String(weight) : ""}
        onChange={v => onChange({ value: _.replace(",", ".", v), weightUnit: unit })}
      />
    </View>
  )
}

const HeightField = ({ value, onChange }) => {
  const height = value.value
  const unit = value.heightUnit
  return (
    <View>
      <Row paddingBottom={20} centerX>
        <Switch
          flex={0.5}
          values={HEIGHT_SETTINGS.map(s => s.toUpperCase())}
          value={HEIGHT_SETTINGS.findIndex(t => t === unit)}
          onChange={i => onChange({ value: height, heightUnit: HEIGHT_SETTINGS[i] })}
        />
      </Row>
      <HeightTextInput
        unit={unit}
        placeholder="Your height"
        keyboardType="numeric"
        returnKeyType="done"
        selectTextOnFocus={true}
        maxLength={6}
        value={height ? String(height) : ""}
        onChange={v => onChange({ value: _.replace(",", ".", v), heightUnit: unit })}
        labelProps={{ variant: "body2" }}
      />
    </View>
  )
}
