import { Control, Form, actions } from "react-redux-form/native"
import { View } from "glamorous-native"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import DatePicker from "react-native-datepicker"
import React from "react"
import * as Sentry from "sentry-expo"
import moment from "moment"
import _ from "lodash/fp"

import { DATE_FORMAT_DISPLAY, DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { withSettings } from "hoc"
import { PROFILE_SETTINGS_FORM } from "constants"
import { Screen } from "components/Background"
import { TextInput, HeightTextInput } from "kui/components/Input"
import RadioButtonList from "components/form/RadioButton"
import colors from "kui/colors"
import fonts from "kui/fonts"
import withUpdateProfile from "graphql/mutation/profile/updateProfile"

export const SETTINGS = {
  NAME: "NAME",
  GENDER: "GENDER",
  DATE_OF_BIRTH: "DATE_OF_BIRTH",
  GOAL: "GOAL",
  HEIGHT: "HEIGHT"
}

const FORMS = {
  NAME: () => {
    return (
      <View>
        <Control
          model=".firstName"
          component={TextInput}
          controlProps={{
            placeholder: "First name",
            autoCapitalize: "words",
            label: "First name",
            marginBottom: 24
          }}
        />
        <Control
          model=".lastName"
          component={TextInput}
          controlProps={{
            placeholder: "Last name",
            autoCapitalize: "words",
            label: "Last name"
          }}
        />
      </View>
    )
  },
  GENDER: () => {
    return (
      <Control
        model=".gender"
        component={RadioButtonList}
        controlProps={{
          values: ["Male", "Female", "Other"]
        }}
      />
    )
  },
  DATE_OF_BIRTH: () => {
    return (
      <Control
        model=".dateOfBirth"
        component={({ value, onChange }) => {
          const maxDate = moment().subtract(18, "years")
          const selectedDate = value ? moment(value) : maxDate.add(1, "day")
          return (
            <View>
              <DatePicker
                date={selectedDate.toDate()}
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
    )
  },
  GOAL: () => {
    return (
      <Control
        model=".goal"
        component={RadioButtonList}
        controlProps={{
          values: ["Lose Weight", "Get Toned", "Build Muscle", "Get Fit"]
        }}
      />
    )
  },
  HEIGHT: p => {
    return (
      <Control
        model=".height"
        component={HeightTextInput}
        parser={_.replace(",", ".")}
        mapProps={{
          value: props => String(props.modelValue)
        }}
        controlProps={{
          unit: p.heightUnit,
          placeholder: "Your height",
          keyboardType: "numeric",
          returnKeyType: "done",
          selectTextOnFocus: true,
          maxLength: 5,
          labelProps: {
            variant: "body2"
          }
        }}
      />
    )
  }
}

const VALIDATION = {
  NAME: {
    firstName: val => !!val && val.trim() != "",
    lastName: val => !!val && val.trim() != ""
  },
  GENDER: { gender: val => !!val },
  DATE_OF_BIRTH: {
    dateOfBirth: val => !!val && moment(val) <= moment().subtract(18, "years")
  },
  GOAL: { goal: val => !!val },
  HEIGHT: { height: val => !!val && +val >= 50 && +val <= 300 }
}

const SettingsForm = props => {
  const { form, onSubmit, heightUnit } = props
  const Fields = FORMS[form]
  return (
    <Screen>
      <View flex={1} paddingHorizontal={20} paddingTop={8}>
        <Form
          model={PROFILE_SETTINGS_FORM}
          onSubmit={onSubmit}
          validators={VALIDATION[form]}
        >
          <Fields heightUnit={heightUnit} />
        </Form>
      </View>
    </Screen>
  )
}

const mapDispatchToProps = (
  dispatch,
  { navigation, member, form, updateMemberProfile }
) => {
  dispatch(actions.load(PROFILE_SETTINGS_FORM, member))
  dispatch(actions.setPristine(PROFILE_SETTINGS_FORM))
  return {
    onSubmit: ({
      id: memberId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      goal,
      height
    }) => {
      try {
        switch (form) {
          case SETTINGS.NAME:
            updateMemberProfile({
              memberId,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              member
            })
            break
          case SETTINGS.GENDER:
            updateMemberProfile({ memberId, gender, member })
            break
          case SETTINGS.DATE_OF_BIRTH:
            updateMemberProfile({ memberId, dateOfBirth, member })
            break
          case SETTINGS.GOAL:
            updateMemberProfile({ memberId, goal, member })
            break
          case SETTINGS.HEIGHT:
            updateMemberProfile({ memberId, height: parseFloat(height) || 0, member })
            break
        }
      } catch (e) {
        Sentry.captureException(
          new Error(
            `MId:{${memberId}}, Scope:{Profile.SettingsForm.onSubmit}, ${_.toString(e)}`
          )
        )
      }
      dispatch(actions.setPristine(PROFILE_SETTINGS_FORM))
      navigation.goBack()
    }
  }
}

const enhance = compose(
  withSettings,
  withNavigation,
  withUpdateProfile,
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(SettingsForm)
