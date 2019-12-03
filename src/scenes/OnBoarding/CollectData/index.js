import { Form, actions } from "react-redux-form/native"
import { Dimensions } from "react-native"
import { ScrollView, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import { connect } from "react-redux"
import React from "react"
import * as Sentry from "sentry-expo"
import _ from "lodash/fp"

import { ChevronLeftIcon } from "kui/icons"
import { FIELDS } from "scenes/OnBoarding/CollectData/FormFields"
import { IconButton, PrimaryButton, SecondaryButton } from "kui/components/Button"
import { ON_BOARDING_FORM } from "constants"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { getWeightUnit, convertWeight, getHeightUnit } from "keystone"
import { withLoader, withRRFLoader } from "hoc"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withMeasurements from "graphql/query/member/measurementsByDate"
import withProfileData from "graphql/query/member/profileData"
import withSettingMutation from "graphql/mutation/profile/updateSettings"
import withUpdateProfile from "graphql/mutation/profile/updateProfile"
import withUpdateMemberById from "graphql/mutation/profile/updateMemberById"
import withUpsertMemberMetric from "graphql/mutation/profile/upsertMetric"

const width = Dimensions.get("window").width

class CollectData extends React.Component {
  scrollNext = (animated = true) => {
    const {
      featureList,
      props: { fieldIndex, setFieldIndex }
    } = this
    const nextFieldIndex = fieldIndex + 1
    featureList.scrollTo({ animated, x: nextFieldIndex * width })
    setFieldIndex(nextFieldIndex)
  }

  scrollPrev = (animated = true) => {
    const {
      featureList,
      props: { fieldIndex, setFieldIndex, resetValidation }
    } = this
    const nextFieldIndex = fieldIndex - 1
    featureList.scrollTo({ animated, x: nextFieldIndex * width })
    setFieldIndex(nextFieldIndex)
    resetValidation()
  }

  handleSubmit = form => {
    const {
      member,
      updateMemberProfile,
      upsertMemberMetric,
      submitSetting,
      onBoardingDone
    } = this.props
    const {
      id: memberId,
      goal,
      gender,
      dateOfBirth,
      weight: { value: weight, weightUnit },
      height: { value: height, heightUnit }
    } = form
    try {
      updateMemberProfile({
        goal,
        gender,
        dateOfBirth: dateOfBirth === "" ? null : dateOfBirth,
        height: height || null,
        memberId,
        member
      })
      if (+weight > 0) {
        upsertMemberMetric({
          memberId,
          value: convertWeight(weightUnit, "kg", false, weight),
          key: "BODY_WEIGHT"
        })
        submitSetting("weight_unit")(weightUnit.toLowerCase())
      }
      if (+height > 0) {
        submitSetting("height_unit")(heightUnit.toLowerCase())
      }
    } catch (e) {
      Sentry.captureException(
        new Error(
          `MId:{${member.id}}, Scope:{OnBoarding.CollectData.onSubmit}, ${_.toString(e)}`
        )
      )
    }
    onBoardingDone()
  }

  render() {
    const { scrollNext, handleSubmit, scrollPrev } = this
    const {
      fieldIndex,
      onMomentumScrollEnd,
      onBoardingDone,
      onSubmit,
      valid
    } = this.props
    const fieldsNumber = FIELDS.length

    return (
      <Screen>
        <View flex={1} paddingBottom={20}>
          <Form
            flex={1}
            model={ON_BOARDING_FORM}
            onSubmit={handleSubmit}
            validators={FIELDS[fieldIndex].validation}
          >
            <ScrollView
              horizontal
              scrollEnabled={false}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              innerRef={component => (this.featureList = component)}
              onMomentumScrollEnd={onMomentumScrollEnd}
            >
              {FIELDS.map(({ title, Field }, i) => (
                <View width={width} paddingHorizontal={20} flex={1} key={i}>
                  <Row>
                    <View flex={0.1}>
                      {i !== 0 && (
                        <IconButton
                          onPress={() => scrollPrev()}
                          paddingLeft={0}
                          paddingTop={6}
                        >
                          <ChevronLeftIcon size={28} color={colors.white} />
                        </IconButton>
                      )}
                    </View>
                    <Text
                      flex={0.8}
                      variant="h1"
                      textAlign="center"
                      paddingBottom={18}
                      fontSize={22}
                      lineHeight={28}
                    >
                      {title}
                    </Text>
                  </Row>
                  {!!Field && <Field />}
                </View>
              ))}
            </ScrollView>
          </Form>
          <Text variant="button1" paddingBottom={16} textAlign="center">
            STEP {fieldIndex + 1}/{fieldsNumber}
          </Text>
          <View paddingBottom={24} paddingHorizontal={20}>
            <Pagination pages={fieldsNumber} selectedPage={fieldIndex} />
          </View>
          {fieldIndex < fieldsNumber - 1 ? (
            <View paddingHorizontal={20}>
              <PrimaryButton
                label="NEXT"
                onPress={() => scrollNext()}
                marginBottom={16}
                disabled={!valid}
              />
              <SecondaryButton
                label="SKIP ALL"
                onPress={onBoardingDone}
                labelProps={{ color: colors.white50 }}
              />
            </View>
          ) : (
            <View paddingBottom={64} paddingHorizontal={20}>
              <PrimaryButton label="LET'S GO" onPress={onSubmit} disabled={!valid} />
            </View>
          )}
        </View>
      </Screen>
    )
  }
}

const Pagination = ({ pages, selectedPage = 0 }) => {
  return (
    <Row spread>
      {_.range(0, pages).map(p => (
        <View
          key={p}
          height={4}
          borderRadius={2}
          backgroundColor={p <= selectedPage ? colors.blue40 : colors.darkBlue80}
          flex={1 / (pages + 1)}
        />
      ))}
    </Row>
  )
}

const enhance = compose(
  withProfileData,
  withMeasurements,
  withLoader({
    color: colors.white50,
    backgroundColor: colors.blue8,
    operationName: ["MemberProfile", "allSettings", "MemberMeasurementsByDate"]
  }),
  withProps(({ measurements, data }) => {
    const measurement =
      measurements.length > 0 ? measurements.filter(m => m.key === "BODY_WEIGHT") : []
    return {
      weight: measurement.length > 0 ? measurement[0].value : null,
      height: _.getOr(null, "member.height", data)
    }
  }),
  withProps(({ data }) => ({ member: data.member })),
  withUpdateProfile,
  withUpsertMemberMetric,
  withUpdateMemberById,
  withSettingMutation,
  connect(
    state => {
      const valid = _.getOr(false, "formsRoot.forms.onBoardingForm.$form.valid", state)
      return { valid }
    },
    (dispatch, { member, weight, height }) => {
      const weightUnit = getWeightUnit(member)
      const heightUnit = getHeightUnit(member)
      // dispatch(actions.setPristine(ON_BOARDING_FORM))
      return {
        loadData: () => {
          dispatch(
            actions.load(ON_BOARDING_FORM, {
              ...member,
              weight: {
                value: convertWeight("kg", weightUnit, true, weight),
                weightUnit
              },
              height: { value: height || 0, heightUnit }
            })
          )
        },
        onSubmit: () => {
          dispatch(actions.submit(ON_BOARDING_FORM))
          dispatch(actions.setPristine(ON_BOARDING_FORM))
        },
        resetValidation: () => {
          dispatch(actions.resetValidity(ON_BOARDING_FORM))
        }
      }
    }
  ),
  withRRFLoader,
  withState("fieldIndex", "setFieldIndex", 0),
  withHandlers({
    onMomentumScrollEnd: ({ setFieldIndex }) => event => {
      const selectedPage = Math.round(event.nativeEvent.contentOffset.x / width)
      setFieldIndex(selectedPage)
    },
    onBoardingDone: ({ updateMemberById, member }) => () => {
      try {
        updateMemberById({ id: member.id, isOnBoarded: true })
      } catch (e) {
        Sentry.captureException(
          new Error(
            `MId:{${
              member.id
            }}, Scope:{OnBoarding.CollectData.onBoardingDone}, ${_.toString(e)}`
          )
        )
      }
    }
  })
)

export default enhance(CollectData)
