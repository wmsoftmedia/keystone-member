import { compose, withHandlers } from "recompose"
import { connect } from "react-redux"
import { withApollo } from "react-apollo"
import { withNavigation } from "react-navigation"
import React from "react"

import { IconButton } from "kui/components/Button"
import { PlusIcon } from "kui/icons"
import { mealLabelByIndex } from "scenes/Home/Nutrition/utils"
import { routes } from "navigation/routes"
import addItems from "scenes/Home/Nutrition/Tracker/actions"
import colors from "kui/colors"

const AddFood = props => (
  <IconButton {...props}>
    <PlusIcon color={colors.darkBlue30} size={24} />
  </IconButton>
)

const enhanced = compose(
  withApollo,
  withNavigation,
  connect(dispatch => ({ dispatch })),
  withHandlers({
    onPress: props => () => {
      const { navigation, mealIndex } = props
      navigation.navigate(routes.FoodSearchRoot, {
        onAdd: items => props.dispatch(addItems(props.client, props.mealIndex, items)),
        mealName: mealLabelByIndex(mealIndex),
        addToText: "ADD TO DIARY",
        backText: "BACK TO SEARCH"
      })
    }
  })
)
export default enhanced(AddFood)
