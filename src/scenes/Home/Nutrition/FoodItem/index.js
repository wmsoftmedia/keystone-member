import { ScrollView, View } from "glamorous-native"
import { actions } from "react-redux-form/native"
import {
  branch,
  compose,
  mapProps,
  pure,
  setDisplayName,
  setPropTypes,
  withHandlers,
  withProps
} from "recompose"
import { connect } from "react-redux"
import React from "react"

import { FOOD_ITEM_CONTEXT_TRACKER } from "constants"
import { MacroSummary } from "scenes/Home/Nutrition/components/TotalInfo"
import { ModalScreen } from "components/Background"
import { Row } from "kui/components"
import {
  SOURCE_CACHE_DB_FOOD,
  SOURCE_CACHE_OLD_MY_FOOD,
  SOURCE_DB_FOOD,
  SOURCE_DB_FOOD_OLD,
  mealItemNutritionFacts,
  servingToNutritionFacts
} from "keystone/food"
import { StarIcon } from "kui/icons"
import { formatCals } from "keystone"
import { getMealItemAddress } from "scenes/Home/Nutrition/utils"
import Label from "kui/components/Label"
import Line from "kui/components/Line"
import MacroControls from "scenes/Home/Nutrition/FoodItem/MacroControls"
import NutritionFacts from "scenes/Home/Nutrition/FoodItem/NutritionFacts"
import PropTypes from "prop-types"
import ServingControls from "scenes/Home/Nutrition/FoodItem/ServingControls"
import ServingLabel from "scenes/Home/Nutrition/FoodItem/ServingLabel"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const FoodItem = props => {
  const { item, label, provider } = props
  const { isFavourite, isFood, isQuickAdd } = props
  const { servingController, quickAddController } = props

  return (
    <ModalScreen grabby>
      {isFavourite && (
        <View position="absolute" right={2} top={2} opacity={0.1}>
          <StarIcon size={32} color={colors.darkBlue50} />
        </View>
      )}
      <ScrollView>
        <View flex={1}>
          <Row centerY paddingHorizontal={20}>
            <Row flex={1} centerY>
              <Text numberOfLines={3} ellipsizeMode="tail" variant={"body1"}>
                {label}
              </Text>
            </Row>
            <View alignItems="center" justifyContent="flex-end">
              <Text variant="body2" paddingLeft={10}>
                {formatCals(item.cals || 0)}
              </Text>
            </View>
          </Row>
          <Row spread paddingHorizontal={20}>
            <MacroSummary item macros={item.macros} hideCals hideFibre />
            {isFood && <ServingLabel item={item} />}
          </Row>
          {(item.origin || provider !== "Generic") && (
            <View>
              <Line marginTop={12} />
              <Row
                alignItems="center"
                paddingTop={12}
                paddingHorizontal={20}
                justifyContent="flex-end"
              >
                {provider !== "Generic" && (
                  <Label variant="foodProvider" text={provider} />
                )}
                {item.origin && (
                  <Label variant="foodSource" text={item.origin} marginLeft={12} />
                )}
              </Row>
            </View>
          )}
          <Line marginTop={12} />
          <View paddingTop={28} paddingHorizontal={20}>
            {isFood && <ServingControls {...servingController} item={item} />}
            {isQuickAdd && <MacroControls {...quickAddController} item={item} />}
          </View>
          {isFood && <NutritionFacts facts={item.macros} />}
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

const enhance = compose(
  setDisplayName("FoodItem"),
  withProps(props => {
    const { item } = props
    const isFood = item.type === "food"
    const source = _.getOr("", "meta.source", item)
    const hasProvider =
      isFood &&
      (source === "fatsecret" || item.provider === "FS" || item.provider === "KS")
    const isMyFood =
      isFood &&
      (source === "myfood" ||
        source === SOURCE_CACHE_DB_FOOD ||
        source === SOURCE_DB_FOOD ||
        source === SOURCE_CACHE_OLD_MY_FOOD ||
        source === SOURCE_DB_FOOD_OLD)
    const provider = hasProvider
      ? _.getOr("Generic", "meta.brand", item) || "Generic"
      : isMyFood
      ? "My Food"
      : "Macros"
    const isQuickAdd = !isFood || (item.origin && item.origin === "Quick Add")
    const isFavourite = _.getOr(false, "isFavourite", item)
    const label = _.getOr("--", "label", item) || (isQuickAdd ? "Quick Add" : "--")
    return { item, label, isQuickAdd, isFood, isFavourite, provider }
  }),
  setPropTypes({
    item: PropTypes.shape({
      type: PropTypes.string,
      macros: PropTypes.object.isRequired,
      label: PropTypes.string.isRequired,
      servingAmount: PropTypes.any,
      servingUnit: PropTypes.string,
      servings: PropTypes.array
    }).isRequired,
    isFood: PropTypes.bool.isRequired,
    isQuickAdd: PropTypes.bool,
    isFavourite: PropTypes.bool.isRequired,
    provider: PropTypes.string.isRequired,
    servingController: PropTypes.shape({
      onServingAmountChange: PropTypes.func.isRequired,
      onServingUnitChange: PropTypes.func.isRequired
    }),
    quickAddController: PropTypes.shape({
      onLabelChange: PropTypes.func.isRequired,
      onCalsChange: PropTypes.func.isRequired,
      onProteinChange: PropTypes.func.isRequired,
      onFatChange: PropTypes.func.isRequired,
      onCarbsChange: PropTypes.func.isRequired
    })
  }),
  pure
)

// Contextual enhancers

const enhanceDefault = compose(
  setDisplayName("DefaultFoodItem"),
  setPropTypes({
    address: PropTypes.string.isRequired
  }),
  connect((state, ownProps) => {
    const { item, address } = ownProps
    const cachedItem = _.getOr(item, address, state)
    const { food, serving } = cachedItem
    const facts = mealItemNutritionFacts(cachedItem)
    const foodItem = {
      ...item,
      ...food,
      type: "food",
      cals: facts.calories,
      macros: facts,
      label: food.name,
      servingAmount: serving.num,
      servingUnit: serving.name,
      servings: food.servings.map(s => ({ ...s, description: s.name }))
    }
    return { item: foodItem, address }
  }),
  withHandlers({
    update: ({ dispatch, address }) => key => v =>
      dispatch(actions.change(`${address}.${key}`, v))
  }),
  mapProps(({ navigation, item, update }) => {
    return {
      item,
      // TODO: Fix this controller as it's probably going to be causing
      // race conditions on slower devices cause of how redux is wired in
      // here. Ssee anhanceTracked for more reference.
      servingController: {
        onServingAmountChange: servingAmount => {
          update("serving.num")(servingAmount)
          navigation.setParams({ item: { ...item, servingAmount } })
        },
        onServingUnitChange: servingUnit => {
          const serving = item.servings.find(s => s.name === servingUnit)
          update("serving")(serving)
          navigation.setParams({ item: { ...item, serving, servingUnit } })
        }
      }
    }
  })
)

/**
 * CONTEXT: FOOD_ITEM_CONTEXT_TRACKER
 * This enhancer MUST ONLY be used in context of a Tracker.
 * It is responsible for connecting the controls to tracker's cache.
 */
const enhanceTracked = compose(
  setDisplayName("TrackedFoodItem"),
  setPropTypes({
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    mealIndex: PropTypes.number.isRequired
  }),
  // TODO: The only reason redux is here is because we need `dispatch`.
  // Dispatch is needed to perform async tracker updates.
  // It's probably better to implement a generic segue that will
  // update global state upon submission or reactive changes
  // inside (instead of wiring redux in here directly.
  connect((state, ownProps) => {
    const { mealIndex, index } = ownProps
    const itemAddress = getMealItemAddress(index, mealIndex)
    return { itemAddress }
  }),
  withHandlers({
    update: ({ dispatch, itemAddress }) => key => v =>
      dispatch(actions.change(`${itemAddress}.${key}`, v))
  }),
  // TODO: Food Item state is held in navigation params at the moment.
  // We need to have a better pattern for performing state updates in
  // specific "local" screens. Update logic and state must be contained
  // in these controllers to prevent implementation details leaking
  // into the view.
  mapProps(({ navigation, item, update }) => ({
    item,
    servingController: {
      onServingAmountChange: servingAmount => {
        const serving = item.servings.find(s => s.description === item.servingUnit)
        const macros = servingToNutritionFacts(serving, servingAmount)
        const newItem = { ...item, cals: macros.cals, macros, servingAmount }
        navigation.setParams({ item: newItem })
        update("servingAmount")(servingAmount)
      },
      onServingUnitChange: servingUnit => {
        const serving = item.servings.find(s => s.description === servingUnit)
        const macros = servingToNutritionFacts(serving, item.servingAmount)
        const newItem = { ...item, cals: macros.cals, macros, serving, servingUnit }
        navigation.setParams({ item: newItem })
        update("servingUnit")(servingUnit)
      }
    },
    quickAddController: {
      onLabelChange: label => {
        navigation.setParams({ item: { ...item, label } })
        update("label")(label)
      },
      onCalsChange: cals => {
        const newItem = { ...item, cals, macros: { ...item.macros, cals } }
        navigation.setParams({ item: newItem })
        update("macros.cals")(cals)
      },
      onProteinChange: protein => {
        const newItem = { ...item, macros: { ...item.macros, protein } }
        navigation.setParams({ item: newItem })
        update("macros.protein")(protein)
      },
      onFatChange: fat => {
        const newItem = { ...item, macros: { ...item.macros, fat } }
        navigation.setParams({ item: newItem })
        update("macros.fat")(fat)
      },
      onCarbsChange: carbs => {
        const newItem = { ...item, macros: { ...item.macros, carbs } }
        navigation.setParams({ item: newItem })
        update("macros.carbs")(carbs)
      }
    }
  }))
)

export default branch(
  /**
   * Passing context prop will determine which decoration to perform
   * Chosen enhancer will attache required props, callbacks etc.
   */
  ({ context }) => context === FOOD_ITEM_CONTEXT_TRACKER,
  enhanceTracked,
  enhanceDefault
)(enhance(FoodItem))
