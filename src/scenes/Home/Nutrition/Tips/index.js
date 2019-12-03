import { View, ScrollView } from "glamorous-native"
import { compose } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { HungerIcon, TipsIcon, ProteinIcon, FireIcon, WheatIcon } from "kui/icons"
import { PrimaryButton, TextButtonForward } from "kui/components/Button"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { generalTips, hungerManagement } from "scenes/Home/Nutrition/Tips/tips"
import { routes } from "navigation/routes"
import Card from "kui/components/Card"
import Gradient from "scenes/Home/Nutrition/Tips/components/Gradient"
import SimpleList, {
  SimpleListItemTemplate
} from "scenes/Home/Nutrition/Tips/components/SimpleList"
import Text from "kui/components/Text"
import colors from "kui/colors"

const Tips = ({ navigation }) => {
  return (
    <Screen>
      <ScrollView>
        <View flex={1} paddingBottom={28} paddingHorizontal={20}>
          <Row justifyContent="space-between" paddingBottom={24}>
            <SourceCard
              title={`Protein\nSources`}
              icon={ProteinIcon}
              onPress={() =>
                navigation.navigate(routes.NutritionTipsSource, {
                  screenTitle: "Protein Sources",
                  nutritionFact: "protein"
                })
              }
            />
            <SourceCard
              title={`Fat\nSources`}
              icon={FireIcon}
              onPress={() =>
                navigation.navigate(routes.NutritionTipsSource, {
                  screenTitle: "Fat Sources",
                  nutritionFact: "fat"
                })
              }
              marginHorizontal={12}
            />
            <SourceCard
              title={`Carb\nSources`}
              icon={WheatIcon}
              onPress={() =>
                navigation.navigate(routes.NutritionTipsSource, {
                  screenTitle: "Carb Sources",
                  nutritionFact: "carbs"
                })
              }
            />
          </Row>

          <View paddingBottom={24}>
            <Header
              title="Hunger Management"
              icon={HungerIcon}
              onSeeAll={() => navigation.navigate(routes.NutritionHungerManagement)}
            />
            <SimpleList
              items={hungerManagement.slice(0, 2)}
              ListItemTemplate={SimpleListItemTemplate}
            />
          </View>

          <View>
            <Header
              title="General Tips"
              icon={TipsIcon}
              onSeeAll={() => navigation.navigate(routes.NutritionGeneralTips)}
            />
            <SimpleList
              items={generalTips.slice(0, 3)}
              ListItemTemplate={SimpleListItemTemplate}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const Header = ({ title, icon, onSeeAll }) => {
  const Icon = icon
  return (
    <Row spread centerY marginBottom={11}>
      <Row>
        {icon && (
          <View paddingRight={8}>
            <Icon size={28} color={colors.white} />
          </View>
        )}
        <Text variant="h2" fontSize={16}>
          {title}
        </Text>
      </Row>
      <TextButtonForward padding={5} onPress={onSeeAll} label="SEE ALL" />
    </Row>
  )
}

const SourceCard = ({ title, icon, onPress, ...rest }) => {
  const Icon = icon
  return (
    <Card
      paddingBottom={16}
      paddingTop={19}
      paddingHorizontal={8}
      flex={1}
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      {...rest}
    >
      <Gradient />
      {icon && <Icon size={28} color={colors.white} />}
      <Text variant="body2" textAlign="center" paddingTop={8} paddingBottom={12}>
        {title}
      </Text>
      <PrimaryButton
        onPress={onPress}
        label="DETAILS"
        width={78}
        minWidth={78}
        height={40}
      />
    </Card>
  )
}

export default compose(withNavigation)(Tips)
