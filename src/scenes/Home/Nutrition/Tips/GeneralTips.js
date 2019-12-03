import { View, ScrollView } from "glamorous-native"
import React from "react"

import { Screen } from "components/Background"
import { generalTips } from "scenes/Home/Nutrition/Tips/tips"
import SimpleList, {
  SimpleListItemTemplate
} from "scenes/Home/Nutrition/Tips/components/SimpleList"

const GeneralTips = () => {
  return (
    <Screen>
      <ScrollView>
        <View flex={1} paddingBottom={28} paddingHorizontal={20}>
          <SimpleList items={generalTips} ListItemTemplate={SimpleListItemTemplate} />
        </View>
      </ScrollView>
    </Screen>
  )
}

export default GeneralTips
