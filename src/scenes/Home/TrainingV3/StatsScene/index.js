import { Text, View } from "glamorous-native"
import React from "react"

import colors from "colors"

import wall from "../../../../../assets/images/workouts-bg.jpg"

import BGView from "components/BGView"
import Footer, { TrainingScenes } from "../components/Footer"

const StatsScene = props => {
  return (
    <View flex={1} backgroundColor={colors.blue8}>
      <View flex={1}>
        <BGView bgImage={wall} paddingTop={200}>
          <View backgroundColor={colors.blue8}>
            <Text color={colors.white} textAlign="center">
              STATS
            </Text>
          </View>
        </BGView>
      </View>
      <View backgroundColor={colors.blue8}>
        <Footer scene={TrainingScenes.STATS} />
      </View>
    </View>
  )
}

export default StatsScene
