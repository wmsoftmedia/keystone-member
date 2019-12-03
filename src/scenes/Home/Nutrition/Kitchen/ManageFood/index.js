// packages
import { View } from "glamorous-native"
import { compose, setDisplayName, withProps, withState } from "recompose"
import React from "react"

import { Switch } from "kui/components/Switch"
import SearchMyDays from "scenes/Home/Nutrition/Kitchen/ManageFood/SearchMyDays"
import SearchMyFood from "scenes/Home/Nutrition/Kitchen/ManageFood/SearchMyFood"
import SearchMyMeals from "scenes/Home/Nutrition/Kitchen/ManageFood/SearchMyMeals"
import SearchMyRecipes from "scenes/Home/Nutrition/Kitchen/ManageFood/SearchMyRecipes"
import Template from "scenes/Home/Nutrition/Kitchen/Template"

const MY_FOOD_TAB = "FOOD"
const MY_MEALS_TAB = "MEALS"
const MY_DAYS_TAB = "DAYS"
const MY_RECIPES_TAB = "RECIPES"
const foodSearchTabs = [MY_FOOD_TAB, MY_RECIPES_TAB, MY_MEALS_TAB, MY_DAYS_TAB]
const DEFAULT_TAB_INDEX = 0

const KitchenRoot = props => (
  <Template>
    <View paddingHorizontal={20}>
      <Switch values={foodSearchTabs} value={props.tab} onChange={props.setTab} />
    </View>
    <View flex={1}>
      {props.isMyFoodTab && <SearchMyFood navigation={props.navigation} />}
      {props.isMyRecipesTab && <SearchMyRecipes navigation={props.navigation} />}
      {props.isMyMealsTab && <SearchMyMeals navigation={props.navigation} />}
      {props.isMyDaysTab && <SearchMyDays navigation={props.navigation} />}
    </View>
  </Template>
)

const enhance = compose(
  setDisplayName("KitchenRoot"),
  withState("tab", "setTab", DEFAULT_TAB_INDEX),
  withProps(props => ({
    isMyFoodTab: foodSearchTabs[props.tab] === MY_FOOD_TAB,
    isMyRecipesTab: foodSearchTabs[props.tab] === MY_RECIPES_TAB,
    isMyMealsTab: foodSearchTabs[props.tab] === MY_MEALS_TAB,
    isMyDaysTab: foodSearchTabs[props.tab] === MY_DAYS_TAB
  }))
)

export default enhance(KitchenRoot)
