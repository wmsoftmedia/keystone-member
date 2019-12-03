import { View, ScrollView } from "glamorous-native"
import React from "react"

import { hungerManagement } from "scenes/Home/Nutrition/Tips/tips"
import CardList, {
  SeparateListItemTemplate
} from "scenes/Home/Nutrition/Tips/components/CardList"

const HungerManagement = () => {
  return (
    <ScrollView>
      <View flex={1} paddingBottom={16} paddingHorizontal={20}>
        <CardList items={hungerManagement} ListItemTemplate={SeparateListItemTemplate} />
      </View>
    </ScrollView>
  )
}

export default HungerManagement
