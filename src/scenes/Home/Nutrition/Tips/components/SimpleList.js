import { TouchableOpacity, View } from "glamorous-native"
import { withNavigation } from "react-navigation"
import React from "react"

import { ChevronRightIcon } from "kui/icons"
import { Row } from "kui/components"
import { routes } from "navigation/routes"
import Card from "kui/components/Card"
import Gradient from "scenes/Home/Nutrition/Tips/components/Gradient"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import colors from "kui/colors"

const TipsList = ({ items = [], ListItemTemplate }) => {
  const lastElementIndex = items.length - 1
  return (
    <Card>
      <Gradient />

      <View padding={16}>
        {items.map((item, i) => (
          <ListItemTemplate key={i} {...item} showSeparator={i !== lastElementIndex} />
        ))}
      </View>
    </Card>
  )
}

export const SimpleListItemTemplate = withNavigation(
  ({ title, summaryText, fullContent, navigation, showSeparator = true }) => {
    return (
      <View>
        <Text variant="body2" paddingBottom={12}>
          {title}
        </Text>
        <Text variant="caption1">{summaryText}</Text>

        {Boolean(fullContent) && (
          <TouchableOpacity
            flexDirection="row"
            alignSelf="flex-start"
            onPress={() =>
              navigation.navigate(routes.NutritionTipsFullContent, {
                renderContent: fullContent,
                screenTitle: title
              })
            }
          >
            <Row>
              <Text variant="button1" paddingTop={10} paddingRight={2}>
                READ MORE
              </Text>
              <ChevronRightIcon color={colors.blue50} />
            </Row>
          </TouchableOpacity>
        )}

        {showSeparator && (
          <Line
            marginHorizontal={0}
            color={colors.darkBlue20}
            opacity={0.2}
            marginVertical={20}
          />
        )}
      </View>
    )
  }
)

export default TipsList
