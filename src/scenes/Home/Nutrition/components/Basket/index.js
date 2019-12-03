import { ScrollView, View } from "glamorous-native"
import { compose, withProps, withHandlers, withStateHandlers } from "recompose"
import React from "react"

import { Screen } from "components/Background"
import { Switch } from "kui/components/Switch"
import { getNavigationParam } from "keystone"
import { routes } from "navigation/routes"
import FoodSearch from "scenes/Home/Nutrition/components/Basket/FoodSearch"
import Footer from "scenes/Home/Nutrition/components/Footer"
import MyFavouritesList from "scenes/Home/Nutrition/components/Basket/MyFavouritesList"
import MyFoodList from "scenes/Home/Nutrition/components/Basket/MyFoodList"
import MyMealsList from "scenes/Home/Nutrition/components/Basket/MyMealsList"
import MyRecipesList from "scenes/Home/Nutrition/components/Basket/MyRecipesList"

export const SEARCH_TAB = "SEARCH"
export const MY_FAVS_TAB = "FAVS"
export const MY_FOOD_TAB = "CUSTOM"
export const MY_MEALS_TAB = "MY MEALS"
export const MY_RECIPES_TAB = "RECIPES"

const DEFAULT_TABS = [SEARCH_TAB, MY_FAVS_TAB, MY_FOOD_TAB, MY_RECIPES_TAB]
const DEFAULT_ADD_TO_TEXT = "ADD"
const DEFAULT_TAB_INDEX = 0

const enhance = compose(
  withProps(props => ({
    tabs: getNavigationParam(props.navigation, "tabs") || DEFAULT_TABS,
    addToText: getNavigationParam(props.navigation, "addToText") || DEFAULT_ADD_TO_TEXT
  })),
  withStateHandlers(
    props => ({
      selectedFood: new Map(),
      tab: props.tabs[DEFAULT_TAB_INDEX],
      tabIndex: DEFAULT_TAB_INDEX
    }),
    {
      setTabIndex: (state, props) => tabIndex => ({
        tabIndex,
        tab: props.tabs[tabIndex]
      }),
      toggleItem: ({ selectedFood }) => item => {
        const itemId = item.externalId ? item.externalId : item.id
        if (selectedFood.has(itemId)) {
          selectedFood.delete(itemId)
          return { selectedFood: new Map(selectedFood) }
        } else {
          return { selectedFood: new Map(selectedFood.set(itemId, item)) }
        }
      },
      addFood: ({ selectedFood }) => item => {
        const itemId = item.externalId ? item.externalId : item.id
        if (!selectedFood.has(itemId)) {
          return { selectedFood: new Map(selectedFood.set(itemId, item)) }
        }
        return { selectedFood: new Map(selectedFood) }
      }
    }
  ),
  withProps(props => ({
    items: Array.from(props.selectedFood.values()),
    isSearchTab: props.tab === SEARCH_TAB,
    isMyFavsTab: props.tab === MY_FAVS_TAB,
    isMyFoodTab: props.tab === MY_FOOD_TAB,
    isMyMealsTab: props.tab === MY_MEALS_TAB,
    isMyRecipesTab: props.tab === MY_RECIPES_TAB,
    switchStyles: {
      root: {
        paddingHorizontal: 10 + 20 * (DEFAULT_TABS.length - props.tabs.length)
      }
    }
  })),
  withHandlers({
    onFooterPress: props => () => {
      props.navigation.pop(2)
      getNavigationParam(props.navigation, "onAdd")(props.items)
    }
  })
)

const Basket = props => {
  const { navigation, items, toggleItem, onFooterPress } = props
  return (
    <Screen>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 8
          }}
        >
          <Switch
            values={props.tabs}
            value={props.tabIndex}
            onChange={props.setTabIndex}
          />
        </ScrollView>
      </View>

      <View flex={1}>
        {props.isSearchTab && (
          <FoodSearch
            selectedIds={props.selectedFood}
            toggleFood={props.toggleItem}
            addFood={props.addFood}
          />
        )}
        {props.isMyFavsTab && (
          <MyFavouritesList
            selectedIds={props.selectedFood}
            toggleFood={props.toggleItem}
          />
        )}
        {props.isMyFoodTab && (
          <MyFoodList selectedIds={props.selectedFood} toggleFood={props.toggleItem} />
        )}
        {props.isMyMealsTab && (
          <MyMealsList selectedIds={props.selectedFood} toggleMeal={props.toggleItem} />
        )}
        {props.isMyRecipesTab && (
          <MyRecipesList
            selectedIds={props.selectedFood}
            toggleRecipe={props.toggleItem}
          />
        )}
      </View>

      <Footer
        food={props.items}
        onPress={() =>
          navigation.navigate(routes.FoodBasket, {
            items,
            toggleItem,
            onConfirmPress: onFooterPress,
            confirmLabel: props.addToText,
            backLabel: "BACK TO SEARCH"
          })
        }
      />
    </Screen>
  )
}

export default enhance(Basket)
