// packages
import { compose, withProps, withHandlers } from "recompose"
import React from "react"

import { AllMyMinDaysTransformed } from "graphql/query/food/allMyDays"
import { confirm } from "native"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "kui/colors"
import deleteDay from "graphql/mutation/food/deleteDay"

const withData = AllMyMinDaysTransformed
const withMutations = deleteDay

const enhanceFoodList = compose(
  withData,
  withExtendedErrorHandler({
    dataKeys: ["AllMyDays"]
  }),
  withLoader({
    color: colors.white,
    backgroundColor: colors.transparent,
    dataKeys: ["AllMyDays"]
  }),
  withMutations,
  withHandlers({
    onAdd: props => () =>
      props.navigation.navigate({
        routeName: "KitchenDay",
        key: "KitchenDay"
      }),
    onClick: props => day =>
      props.navigation.navigate({
        routeName: "KitchenDay",
        key: "KitchenDay",
        params: {
          dayId: day.id
        }
      }),
    onDelete: props => day =>
      confirm(
        () => props.deleteDay(day.id),
        "Are you sure you want to permanently delete this day?"
      )
  }),
  withProps(props => ({
    items: props.allMyDays,
    offline: true,
    manageMode: true,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="You don't have any days created."
          subtitle={`Click on the + button to create your first day.`}
        />
      )
    },
    searchable: true,
    searchProps: {
      placeholder: "Search my days...",
      ActionButton: AddButton,
      actionProps: {
        onPress: props.onAdd
      }
    }
  }))
)

export default enhanceFoodList(FoodList)
