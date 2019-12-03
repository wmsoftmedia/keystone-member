import { compose, withHandlers, withProps } from "recompose"
import React from "react"

import { confirm } from "native"
import { deleteFavouriteFood } from "graphql/mutation/food/deleteFavourite"
import { withAllFavouritesTransformed } from "graphql/query/food/allMyFavourites"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import FoodList from "components/FoodList"
import InfoMessage from "components/InfoMessage"
import colors from "kui/colors"

const enhance = compose(
  withAllFavouritesTransformed,
  deleteFavouriteFood,
  withExtendedErrorHandler({
    dataKeys: ["AllFavourites"]
  }),
  withLoader({
    color: colors.white,
    dataKeys: ["AllFavourites"],
    message: "Loading My Favourites..."
  }),
  withHandlers({
    onDelete: props => food => {
      confirm(
        () => props.deleteFavourite(food.meta.favId),
        "This item will be deleted from your Favourites."
      )
    },
    onClick: props => food => props.toggleFood(food)
  }),
  withProps(props => ({
    items: props.allFavourites,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="No favourites yet."
          subtitle="You don't have any items marked as favourite."
        />
      ),
      searchNotFound: () => <InfoMessage title="No favourites found." />
    },
    offline: true,
    manageMode: true,
    selectMode: true,
    selected: props.selectedIds,
    searchable: true,
    searchProps: {
      placeholder: "Search my favourites..."
    },
    sortField: "name"
  }))
)

export default enhance(FoodList)
