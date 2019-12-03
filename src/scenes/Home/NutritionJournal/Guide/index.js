import { Dimensions } from "react-native"
import { Image, ScrollView, View } from "glamorous-native"
import React from "react"

import { ModalScreen } from "components/Background"
import Text from "kui/components/Text"
import { SourceInfo } from "scenes/Home/NutritionJournal/common"

const width = Dimensions.get("window").width

const PortionsGiude = () => {
  const imageWidht = width - 40
  const imageHeight = (196 * imageWidht) / 372
  return (
    <ModalScreen>
      <ScrollView>
        <View flex={1} paddingBottom={20} paddingTop={28} paddingHorizontal={20}>
          <Text variant="body2" paddingBottom={16}>
            Hand as a measurement tool
          </Text>
          <Text variant="body1">
            As a measurement tool, we use our hand, which is easy, because that means you
            can do it anywhere and it doesn’t require a tracking device, a scale, or a
            calculator.
          </Text>
          <Text variant="body2" paddingTop={20}>
            Protein
          </Text>
          <Text variant="body1">Your palm determines your protein portions.</Text>
          <View paddingTop={10}>
            <Image
              source={SourceInfo["PROTEIN"].image}
              width={imageWidht}
              height={imageHeight}
              resizeMode="contain"
            />
          </View>
          <Text variant="body2" paddingTop={20}>
            Fat
          </Text>
          <Text variant="body1">Your thumb determines your fat portions.</Text>
          <View borderRadius={8} paddingTop={10}>
            <Image
              flex={1}
              source={SourceInfo["FAT"].image}
              width={imageWidht}
              height={imageHeight}
              resizeMode="contain"
            />
          </View>
          <Text variant="body2" paddingTop={20}>
            Carbs
          </Text>
          <Text variant="body1">Your cupped hand determines your carbs portions.</Text>
          <View borderRadius={8} paddingTop={10}>
            <Image
              flex={1}
              source={SourceInfo["CARBS"].image}
              width={imageWidht}
              height={imageHeight}
              resizeMode="contain"
            />
          </View>
          <Text variant="body2" paddingTop={20}>
            Vegetables
          </Text>
          <Text variant="body1">Your fist determines your veggie portions.</Text>
          <View borderRadius={8} paddingTop={10}>
            <Image
              flex={1}
              source={SourceInfo["VEGETABLES"].image}
              width={imageWidht}
              height={imageHeight}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

export default PortionsGiude
