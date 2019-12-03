// packages
import { Form, Control } from "react-redux-form/native"
import { View } from "glamorous-native"
import { compose, setDisplayName, withHandlers, withProps } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"

import { FOOD_ITEM_CONTEXT_DEFAULT, KITCHEN_RECIPE_FORM } from "constants"
import { IconButton } from "kui/components/Button"
import { InputRowText, TextInput } from "kui/components/Input"
import { ModalScreen } from "components/Background"
import { PlusIcon } from "kui/icons"
import { Row } from "kui/components"
import { mealNutritionFacts } from "keystone/food"
import { round } from "keystone"
import { routes } from "navigation/routes"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import Line from "kui/components/Line"
import MealItemLine from "components/FoodList/MealItemLine"
import Text from "kui/components/Text"
import TotalInfo from "scenes/Home/Nutrition/components/TotalInfo"
import _ from "lodash/fp"
import colors from "kui/colors"

export const FORM_NAME = KITCHEN_RECIPE_FORM

const floatNumNormalizer = _.replace(/[^\d.,]/g, "")
const commaNormalizer = _.replace(",", ".")
const zeroNormalizer = val => (val === "0" ? 1 : val)
const inputNormalizer = compose(
  floatNumNormalizer,
  commaNormalizer,
  zeroNormalizer
)

const InputRowTextRRF = props => {
  const { value, label, focused, placeholder } = props
  const { onChange, onFocus, onBlur } = props
  return (
    <InputRowText
      label={label}
      inputProps={{
        clearButtonMode: "never",
        placeholder,
        maxLength: 6,
        textAlign: "center",
        keyboardType: "numeric",
        value: String(value),
        onChange,
        onFocus,
        onBlur,
        focused,
        selectTextOnFocus: true
      }}
    />
  )
}

const IngredientsList = compose(
  setDisplayName("IngredientsList"),
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
        address: `${KITCHEN_RECIPE_FORM}.ingredients[${index}]`
      }
      navigation.navigate(routes.FoodItem, params)
    }
  })
)(FoodList)

const RecipeScreen = props => {
  const { macrosTotal, servingsNum } = props
  const { onSubmit, openSearch } = props
  return (
    <ModalScreen>
      <Form model={KITCHEN_RECIPE_FORM} onSubmit={onSubmit} style={{ flex: 1 }}>
        <View paddingTop={28} paddingHorizontal={20}>
          <Control
            label="Enter recipe name"
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
        <View paddingHorizontal={20} paddingVertical={4}>
          <Control
            model=".servings"
            label={"Total Servings"}
            parser={inputNormalizer}
            component={InputRowTextRRF}
            placeholder="1"
            keyboardType="numeric"
          />
        </View>
        <Row paddingHorizontal={20} alignItems="flex-start">
          <View flex={5}>
            <Text variant="caption2" color={colors.darkBlue30}>
              ENERGY PER SERVE
            </Text>
            <Text variant="h2">
              {round(macrosTotal.calories / servingsNum) || "--"} cal
            </Text>
          </View>
          <View flex={4}>
            <Text variant="caption2" color={colors.darkBlue30} paddingBottom={4}>
              MACROS PER SERVE
            </Text>
            <Row spread>
              <Text variant="caption1">Protein</Text>
              <Text variant="caption1">
                {round(macrosTotal.protein / servingsNum) || "--"} g
              </Text>
            </Row>
            <Row spread>
              <Text variant="caption1">Fat</Text>
              <Text variant="caption1">
                {round(macrosTotal.fat / servingsNum) || "--"} g
              </Text>
            </Row>
            <Row spread>
              <Text variant="caption1">Carbs</Text>
              <Text variant="caption1">
                {round(macrosTotal.carbs / servingsNum) || "--"} g
              </Text>
            </Row>
            <Row spread>
              <Text variant="caption1">Fibre</Text>
              <Text variant="caption1">
                {round(macrosTotal.fibre / servingsNum) || "--"} g
              </Text>
            </Row>
          </View>
        </Row>
        <Row paddingHorizontal={20} centerY spread>
          <Text variant="caption1" color={colors.darkBlue30}>
            Recipe Ingredients
          </Text>
          <IconButton marginRight={-10} onPress={openSearch}>
            <PlusIcon size={24} />
          </IconButton>
        </Row>
        <Line />
        <View flex={1}>
          <Control
            model=".ingredients"
            component={IngredientsList}
            LineComp={MealItemLine}
            listProps={{
              ListEmptyComponent: () => (
                <InfoMessage
                  title="This recipe has no ingredients"
                  subtitle="Click + to add some food to this recipe"
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
    const items = _.getOr([], `${KITCHEN_RECIPE_FORM}.ingredients`, state)
    const servingsNum = _.getOr(1, `${KITCHEN_RECIPE_FORM}.servings`, state) || 1
    return {
      macrosTotal: mealNutritionFacts({ items }),
      servingsNum,
      isEmpty: items.length === 0
    }
  })
)

export default enhance(RecipeScreen)
