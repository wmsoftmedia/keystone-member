import { Text, View } from "glamorous-native"
import React from "react"

import colors from "colors"

import Footer, { TrainingScenes } from "../components/Footer"

const GoalsScene = props => {
  return (
    <View flex={1} backgroundColor={colors.blue8}>
      <View flex={1}>
        <Text color={colors.white} paddingTop={100} textAlign="center">
          GOALS
        </Text>
      </View>
      <View backgroundColor={colors.blue8}>
        <Footer scene={TrainingScenes.GOALS} />
      </View>
    </View>
  )
}

export default GoalsScene
