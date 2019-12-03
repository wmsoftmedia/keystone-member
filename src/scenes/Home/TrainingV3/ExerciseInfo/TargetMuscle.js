import React from "react"
import { View, Image } from "glamorous-native"

import { Row } from "kui/components"
import Text from "kui/components/Text"
import colors from "kui/colors"
import muscleGroups, { DEFAULT_SIZE } from "scenes/Home/TrainingV3/ExerciseInfo/Images"

const TargetMuscle = ({ size = DEFAULT_SIZE, targetMuscle }) => {
  const images = targetMuscle
    ? targetMuscle
        .toLowerCase()
        .split(" ")
        .join("_")
        .split(",")
    : []
  const labels = images.reduce(
    (acc, img) => {
      if (muscleGroups[img].pos === "front") {
        acc.front.push(muscleGroups[img].label)
      } else if (muscleGroups[img].pos === "back") {
        acc.back.push(muscleGroups[img].label)
      } else if (muscleGroups[img].pos === "both") {
        acc.front.push(muscleGroups[img].label)
        acc.back.push(muscleGroups[img].label)
      }
      return acc
    },
    { front: [], back: [] }
  )
  return (
    <View>
      <View>
        <Image
          source={muscleGroups.blank.img}
          width={size}
          height={size}
          resizeMode={"contain"}
        />
        {images.map((image, i) => {
          const Component = muscleGroups[image].img
          return (
            <View key={i} style={{ position: "absolute", top: 0, left: 0 }}>
              <Component size={size} />
            </View>
          )
        })}
      </View>
      <Row paddingHorizontal={16} alignItems="flex-start">
        <View flex={1} paddingRight={4}>
          <Text variant="body1" textAlign="center">
            {labels.front.join(", ")}
          </Text>
        </View>
        <View flex={1} paddingLeft={4}>
          <Text variant="body1" textAlign="center">
            {labels.back.join(", ")}
          </Text>
        </View>
      </Row>
    </View>
  )
}

export default TargetMuscle
