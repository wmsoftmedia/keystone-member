import React from "react"
import { View, TouchableOpacity } from "glamorous-native"
import { compose, withState } from "recompose"
import _ from "lodash/fp"

import { Row } from "kui/components"
import Text from "kui/components/Text"
import Label from "kui/components/Label"
import Picker from "kui/components/Input/Picker"
import { TextInput } from "kui/components/Input"
import { PrimaryButton } from "kui/components/Button"
import { difficultyVariant } from "scenes/Home/TrainingV3/common"
import { emptyWorkout } from "scenes/Home/WorkoutBuilder/common"

const WorkoutForm = ({ workoutForm, setWorkoutForm, onSaveWorkout }) => {
  const min = Math.floor(workoutForm.duration / 60)
  const sec = workoutForm.duration % 60
  return (
    <View flex={1} padding={20}>
      <View flex={1}>
        <TextInput
          label="Enter workout name"
          value={workoutForm.name}
          placeholder="Workout name"
          autoCapitalize="sentences"
          onChange={v => setWorkoutForm({ ...workoutForm, name: v })}
        />
        <View marginTop={32}>
          <Text variant="body2">Duration</Text>
          <Row marginTop={4}>
            <View paddingRight={12} flex={1}>
              <Picker
                box
                label="Min"
                items={_.times(String, 121)}
                value={"" + min}
                onChange={v =>
                  setWorkoutForm({ ...workoutForm, duration: parseInt(v) * 60 + sec })
                }
                pickerHeader={"Minutes"}
              />
            </View>
            <View paddingLeft={12} flex={1}>
              <Picker
                box
                label="Sec"
                items={_.times(String, 60)}
                value={"" + sec}
                onChange={v =>
                  setWorkoutForm({ ...workoutForm, duration: min * 60 + parseInt(v) })
                }
                pickerHeader={"Seconds"}
              />
            </View>
          </Row>
        </View>
        <View marginTop={32}>
          <Text variant="body2">Select difficulty</Text>
          <Row marginTop={12}>
            <TouchableOpacity
              onPress={() => setWorkoutForm({ ...workoutForm, difficulty: "Hard" })}
            >
              <Label
                variant={
                  workoutForm.difficulty === "Hard"
                    ? difficultyVariant["Hard"].variant
                    : "future"
                }
                text="Hard"
                marginRight={12}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setWorkoutForm({ ...workoutForm, difficulty: "Moderate" })}
            >
              <Label
                variant={
                  workoutForm.difficulty === "Moderate"
                    ? difficultyVariant["Moderate"].variant
                    : "future"
                }
                text="Medium"
                marginRight={12}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setWorkoutForm({ ...workoutForm, difficulty: "Easy" })}
            >
              <Label
                variant={
                  workoutForm.difficulty === "Easy"
                    ? difficultyVariant["Easy"].variant
                    : "future"
                }
                text="Light"
              />
            </TouchableOpacity>
          </Row>
        </View>

        <View marginTop={32}>
          <TextInput
            label="Enter workout notes"
            value={workoutForm.notes}
            multiline={true}
            height={80}
            autoCorrect={true}
            autoCapitalize="sentences"
            onChange={v => setWorkoutForm({ ...workoutForm, notes: v })}
            blurOnSubmit
          />
        </View>
      </View>
      <PrimaryButton
        disabled={!workoutForm.name}
        label="SAVE WORKOUT"
        onPress={() => onSaveWorkout && onSaveWorkout(workoutForm)}
      />
    </View>
  )
}

const enhanced = compose(
  withState(
    "workoutForm",
    "setWorkoutForm",
    ({ workout }) => workout || emptyWorkout.info
  )
)

export default enhanced(WorkoutForm)
