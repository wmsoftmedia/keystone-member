import { View } from "glamorous-native"
import React from "react"

import Gradient from "scenes/Home/Nutrition/Tips/components/Gradient"

const TipsList = ({ items = [], ListItemTemplate }) => {
  return (
    <View>
      {items.map((item, i) => (
        <ListItemTemplate key={i} {...item} />
      ))}
    </View>
  )
}

export const SeparateListItemTemplate = ({ summaryContent, backgroundImage }) => {
  const SummaryContent = summaryContent

  return (
    <View paddingBottom={12}>
      <View overflow="hidden">
        <Gradient />
        {Boolean(backgroundImage) && backgroundImage()}
        <View padding={16}>{Boolean(summaryContent) && <SummaryContent />}</View>
      </View>
    </View>
  )
}

export default TipsList
