// packages
import { Control, Form } from "react-redux-form/native"
import { View } from "glamorous-native"
import { compose, setDisplayName, withHandlers, withProps } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"

import { FOOD_ITEM_CONTEXT_DEFAULT, KITCHEN_MEAL_FORM } from "constants"
import { Input } from "scenes/Home/Nutrition/Kitchen/SearchBar"
import { MealItemLineCompact } from "components/FoodList/MealItemLine"
import { ModalScreen } from "components/Background"
import { getOr } from "keystone"
import { mealNutritionFacts } from "keystone/food"
import { routes } from "navigation/routes"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import Line from "kui/components/Line"
import TotalInfo from "scenes/Home/Nutrition/components/TotalInfo"

export const FORM_NAME = KITCHEN_MEAL_FORM

const MealItemList = compose(
  setDisplayName("MealItemList"),
  withProps(props => ({ items: props.value ? props.value : [] })),
  withHandlers({
    onDelete: ({ onChange, items }) => item =>
      onChange(items.filter(i => i.id !== item.id))
  }),
  withNavigation,
  withHandlers({
    onItemPress: ({ navigation }) => (item, index) => {
      const params = {
        context: FOOD_ITEM_CONTEXT_DEFAULT,
        item,
        address: `${KITCHEN_MEAL_FORM}.items[${index}]`
      }
      navigation.navigate(routes.FoodItem, params)
    }
  })
)(FoodList)

const MealScreen = props => {
  return (
    <ModalScreen>
      <Form model={KITCHEN_MEAL_FORM} onSubmit={props.onSubmit} style={{ flex: 1 }}>
        <View paddingBottom={8} paddingHorizontal={20} paddingTop={20}>
          <Control
            label="Enter meal name"
            model=".name"
            component={Input}
            clearButton
            keyboardType="default"
            autoCapitalize="sentences"
          />
        </View>
        <View paddingHorizontal={20} justifyContent="center">
          <TotalInfo macros={props.macrosTotal} onPress={props.openSearch} />
        </View>
        <Line />
        <View flex={1}>
          <Control
            model=".items"
            component={MealItemList}
            LineComp={MealItemLineCompact}
            listProps={{
              ListEmptyComponent: () => (
                <InfoMessage
                  title="Your meal is empty"
                  subtitle="Click + to add some food to this meal"
                />
              )
            }}
            manageMode
          />
        </View>
      </Form>
    </ModalScreen>
  )
}

const enhance = compose(
  connect(state => {
    const items = getOr([], `${KITCHEN_MEAL_FORM}.items`, state)
    return {
      macrosTotal: mealNutritionFacts({ items }),
      isEmpty: items.length === 0
    }
  })
)

export default enhance(MealScreen)
