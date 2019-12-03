import { View } from "glamorous-native"
import { compose, withState } from "recompose"
import React from "react"

import FoodList from "scenes/Home/Nutrition/components/Basket/FoodSearch/FoodList"
import SearchBar from "scenes/Home/Nutrition/components/Basket/FoodSearch/SearchBar"

const enhanceFoodSearch = compose(withState("term", "setTerm", ""))

const FoodSearch = props => {
  return (
    <View flex={1}>
      <SearchBar term={props.term} setTerm={props.setTerm} addFood={props.addFood} />
      <View flex={1}>
        <FoodList {...props} />
      </View>
    </View>
  )
}

export default enhanceFoodSearch(FoodSearch)
