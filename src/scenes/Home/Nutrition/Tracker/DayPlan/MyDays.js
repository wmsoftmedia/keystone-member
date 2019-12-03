import { compose } from "recompose"
import React from "react"

import { AllMyMinDaysTransformed } from "graphql/query/food/allMyDays"
import { FoodList } from "components/FoodList"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import AddButton from "scenes/Home/Nutrition/components/Button/AddButton"
import DayLine from "components/FoodList/DayLine"
import InfoMessage from "components/InfoMessage"

const enhance = compose(
  AllMyMinDaysTransformed,
  withExtendedErrorHandler({ dataKeys: ["AllMyDays"] }),
  withLoader({ dataKeys: ["AllMyDays"] })
)

export default enhance(({ allMyDays, onSelect, goToKitchen }) => (
  <FoodList
    items={allMyDays}
    onClick={onSelect}
    LineComp={DayLine}
    searchable={true}
    searchProps={{
      placeholder: "Search my days...",
      ActionButton: AddButton,
      actionProps: { onPress: goToKitchen }
    }}
    listProps={{
      ListEmptyComponent: () => (
        <InfoMessage
          title="No day plans yet."
          subtitle={`You don't have any day plans created.\nClick on + above to create your first day.`}
        />
      ),
      searchNotFound: () => <InfoMessage title="No day plans found." />
    }}
  />
))
