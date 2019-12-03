// packages
import { Form, Control, actions } from "react-redux-form/native"
import { ScrollView, View } from "glamorous-native"
import { compose, setDisplayName, withHandlers, withProps } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"

import { DayMealItemLineCompact } from "components/FoodList/MealItemLine"
import { FOOD_ITEM_CONTEXT_DEFAULT, KITCHEN_DAY_FORM } from "constants"
import { FoodList } from "components/FoodList"
import { PlusIcon } from "kui/icons"
import { Screen } from "components/Background"
import { TextButton } from "kui/components/Button"
import { TextInput } from "kui/components/Input"
import { confirm } from "native"
import { dayNutritionFacts } from "keystone/food"
import { genUuid } from "keystone"
import { routes } from "navigation/routes"
import Card from "kui/components/Card"
import InfoMessage from "components/InfoMessage"
import Line from "kui/components/Line"
import MealHeader from "scenes/Home/Nutrition/Kitchen/NewDay/MealHeader"
import TotalInfo from "scenes/Home/Nutrition/components/TotalInfo"
import _ from "lodash/fp"
import colors from "kui/colors"

export const FORM_NAME = KITCHEN_DAY_FORM

const DayPlanList = compose(
  setDisplayName("DayPlanList"),
  withProps(props => ({ items: props.value ? props.value : [] })),
  withHandlers({
    onDelete: ({ onChange, items }) => item =>
      onChange(items.filter(i => i.id !== item.id))
  }),
  withNavigation,
  withHandlers({
    onItemPress: ({ navigation, mealIndex }) => (item, index) => {
      const params = {
        context: FOOD_ITEM_CONTEXT_DEFAULT,
        item,
        address: `${KITCHEN_DAY_FORM}.meals[${mealIndex}].items[${index}]`
      }
      navigation.navigate(routes.FoodItem, params)
    }
  })
)(FoodList)

const DayScreen = props => {
  const { meals, macrosTotal } = props
  const { openSearch, onSubmit, addMeal, deleteMeal } = props
  return (
    <Screen>
      <Form model={KITCHEN_DAY_FORM} onSubmit={onSubmit} style={{ flex: 1 }}>
        <View paddingHorizontal={20}>
          <Control
            label="Enter day name"
            model=".name"
            component={TextInput}
            clearButton
            keyboardType="default"
            autoCapitalize="sentences"
          />
        </View>
        <View paddingHorizontal={20} paddingVertical={12}>
          <TotalInfo macros={macrosTotal} />
        </View>
        <Line />
        <ScrollView flex={1}>
          {meals.map((meal, i) => {
            return (
              <Card
                key={i}
                paddingVertical={8}
                marginHorizontal={20}
                backgroundColor={colors.darkBlue90}
                marginTop={12}
              >
                <MealHeader
                  index={i}
                  meal={meal}
                  onDelete={index => deleteMeal(index, meal.items.length > 0)}
                  onFoodSearch={openSearch}
                />
                <Line marginHorizontal={16} marginTop={4} />
                <Control
                  model={`.meals[${i}].items`}
                  component={DayPlanList}
                  LineComp={DayMealItemLineCompact}
                  mealIndex={i}
                  listProps={{
                    ListEmptyComponent: () => (
                      <InfoMessage
                        titleProps={{ fontSize: 12, color: colors.white50 }}
                        title="This meal is empty"
                      />
                    )
                  }}
                  manageMode
                />
              </Card>
            )
          })}
          {meals.length === 0 && (
            <InfoMessage
              title="This day is empty"
              subtitle="Click 'Add Meal' to add some food"
            />
          )}
          <TextButton
            activeOpacity={0.9}
            marginTop={meals.length > 0 ? 12 : 0}
            marginHorizontal={20}
            label="ADD MEAL"
            Icon={() => (
              <View paddingRight={4}>
                <PlusIcon />
              </View>
            )}
            onPress={addMeal}
            height={56}
            justifyContent="center"
            backgroundColor={colors.darkBlue80_10}
            borderRadius={12}
          />
        </ScrollView>
      </Form>
    </Screen>
  )
}

const enhance = compose(
  connect(
    state => {
      const meals = _.getOr([], `${KITCHEN_DAY_FORM}.meals`, state)
      return {
        meals,
        macrosTotal: dayNutritionFacts({ meals })
      }
    },
    dispatch => ({
      addMeal: () =>
        dispatch(actions.push(`${KITCHEN_DAY_FORM}.meals`, { id: genUuid(), items: [] })),
      deleteMeal: (index, shouldConfirm = true) => {
        const cb = () => dispatch(actions.remove(`${KITCHEN_DAY_FORM}.meals`, index))
        if (shouldConfirm) {
          confirm(cb, "Are you sure you want to delete this meal?")
        } else {
          cb()
        }
      }
    })
  )
)

export default enhance(DayScreen)
