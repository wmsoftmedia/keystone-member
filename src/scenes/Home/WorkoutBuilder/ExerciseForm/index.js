import React from "react"
import { View, ScrollView } from "glamorous-native"
import { compose, withHandlers, withState, defaultProps } from "recompose"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import _ from "lodash/fp"

import { withSettings } from "hoc"
import { ModalScreen } from "components/Background"
import { TextInput, InputRowText } from "kui/components/Input"
import Picker from "kui/components/Input/Picker"
import { PrimaryButton } from "kui/components/Button"
import Line from "kui/components/Line"
import Text from "kui/components/Text"

const effortUnits = ["reps", "cals", "meters", "sec", "min"]
const loadUnits = ["kg", "BW", "RPE", "% BW", "% 1RM"]

const ExerciseForm = props => {
  const { createExercise, exerciseForm, onSaveForm, updateValue, weightUnit } = props
  const { effort, setEffort, load, setLoad, tempo, setTempo, weightConverter } = props

  return (
    <ModalScreen>
      <ScrollView flex={1}>
        <View flex={1} padding={20}>
          {createExercise ? (
            <View>
              <TextInput
                marginBottom={24}
                label="Enter exercise name"
                value={exerciseForm.name}
                autoCapitalize="sentences"
                updateValue
                onChange={v => updateValue("name", v)}
              />
            </View>
          ) : (
            <View marginBottom={24}>
              <Text variant="h1">{exerciseForm.name}</Text>
              {!!exerciseForm.description && (
                <Text variant="caption1" marginTop={12}>
                  {exerciseForm.description}
                </Text>
              )}
            </View>
          )}

          <Line marginBottom={4} marginHorizontal={0} />
          <InputRowText
            paddingVertical={4}
            label="Effort"
            renderSuffix={() => (
              <Picker
                width={80}
                marginRight={-12}
                items={effortUnits}
                value={exerciseForm.effortUnit}
                onChange={v => updateValue("effortUnit", v)}
                pickerHeader={"Effort unit"}
              />
            )}
            labelProps={{ variant: "body2" }}
            inputProps={{
              width: 60,
              returnKeyType: "done",
              keyboardType: "numeric",
              clearButtonMode: "never",
              textAlign: "center",
              maxLength: 6,
              placeholder: "--",
              value: "" + effort,
              onChange: setEffort,
              onEndEditing: e => updateValue("effortValue", e.nativeEvent.text, true)
            }}
          />
          <Line marginTop={4} marginBottom={4} marginHorizontal={0} />
          <InputRowText
            paddingVertical={4}
            label="Load"
            renderSuffix={() => (
              <Picker
                width={80}
                marginRight={-12}
                items={loadUnits.map(lu => ({
                  value: lu,
                  label: lu === "kg" ? weightUnit : lu
                }))}
                value={
                  exerciseForm.loadUnit === "kg" ? weightUnit : exerciseForm.loadUnit
                }
                onChange={v => updateValue("loadUnit", v)}
                pickerHeader={"Load unit"}
              />
            )}
            labelProps={{ variant: "body2" }}
            inputProps={{
              width: 60,
              returnKeyType: "done",
              keyboardType: "numeric",
              clearButtonMode: "never",
              textAlign: "center",
              maxLength: 6,
              placeholder: "--",
              value: "" + load,
              onChange: setLoad,
              onEndEditing: e => updateValue("loadValue", e.nativeEvent.text, true)
            }}
          />
          <Line marginTop={4} marginBottom={4} marginHorizontal={0} />
          <InputRowText
            paddingVertical={4}
            label="Tempo"
            labelProps={{ variant: "body2" }}
            inputProps={{
              width: 128,
              returnKeyType: "done",
              keyboardType: "numeric",
              clearButtonMode: "never",
              textAlign: "center",
              placeholder: "--",
              value: "" + tempo,
              onChange: setTempo,
              onEndEditing: e => updateValue("tempoValue", e.nativeEvent.text, true)
            }}
          />
          <Line marginTop={4} marginBottom={4} marginHorizontal={0} />
        </View>
      </ScrollView>
      <PrimaryButton
        marginHorizontal={20}
        marginBottom={20}
        disabled={createExercise && !exerciseForm.name}
        label={createExercise ? "CREATE EXERCISE" : "SAVE DETAILS"}
        onPress={onSaveForm}
      />
    </ModalScreen>
  )
}

const normalizeValue = value => {
  const maybeNum = Math.abs(+_.replace(/[^\d.-]/g, "", _.replace(/[,.]+/g, ".", value)))
  return maybeNum || ""
}

const emptyExercise = {
  type: "exercise",
  name: "",
  description: "",
  mediaLink: "",
  loadValue: "",
  loadUnit: loadUnits[0],
  effortValue: "",
  effortUnit: effortUnits[0],
  tempoValue: ""
}

const enhanced = compose(
  defaultProps({
    exercise: {},
    createExercise: false
  }),
  withMappedNavigationParams(),
  withNavigation,
  withSettings,
  withState("exerciseForm", "setExerciseForm", ({ exercise }) => ({
    ...emptyExercise,
    ...exercise
  })),
  withState("effort", "setEffort", ({ exerciseForm }) => exerciseForm.effortValue),
  withState("load", "setLoad", ({ exerciseForm, weightConverter }) =>
    exerciseForm.loadUnit === "kg"
      ? weightConverter(exerciseForm.loadValue)
      : exerciseForm.loadValue
  ),
  withState("tempo", "setTempo", ({ exerciseForm }) => exerciseForm.tempoValue),
  withHandlers({
    onSaveForm: ({ navigation, onSave, exerciseForm }) => () => {
      onSave && onSave(exerciseForm)
      navigation.goBack()
    },
    updateValue: props => (name, value, n = false) => {
      const { exerciseForm, setExerciseForm, setEffort, setLoad, setTempo } = props
      const v = n ? normalizeValue(value) : value
      if (name === "loadValue" && exerciseForm.loadUnit === "kg") {
        setExerciseForm({ ...exerciseForm, [name]: props.reverseWeightConverter(v) })
      } else {
        setExerciseForm({ ...exerciseForm, [name]: v })
      }
      name === "effortValue" && setEffort(v)
      name === "loadValue" && setLoad(v)
      name === "tempoValue" && setTempo(v)
    }
  })
)

export default enhanced(ExerciseForm)
