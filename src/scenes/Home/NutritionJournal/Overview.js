import { View } from "glamorous-native"
import { compose, withProps } from "recompose"
import React from "react"
import numeral from "numeral"

import { Row } from "kui/components"
import { SOURCES, calcPortionsInDay } from "scenes/Home/NutritionJournal/journal"
import { withLoader } from "hoc/withLoader"
import TargetChart from "scenes/Home/NutritionJournal/DayPlan/TargetChart"
import Text from "kui/components/Text"
import WaterWidget from "scenes/Home/NutritionJournal/DayPlan/WaterWidget"
import colors from "kui/colors"
import withDayData from "graphql/query/foodJournal/day"

const FoodJournalOverview = ({ target, dayStat, date }) => {
  const hasDayTarget =
    !!target.protein || !!target.fat || !!target.carbs || !!target.vegetables
  const maxPortions = SOURCES.map(s => s.toLowerCase()).reduce(
    (sum, s) => sum + (target[s] ? target[s] : 0),
    0
  )
  const consumedPortions = SOURCES.reduce(
    (sum, s) => sum + (dayStat[s] ? dayStat[s] : 0),
    0
  )
  const isOverTarget = hasDayTarget && maxPortions < consumedPortions

  return (
    <View paddingBottom={20}>
      <Row paddingHorizontal={20} paddingBottom={20} centerY>
        <TargetChart
          dayStat={dayStat}
          target={target}
          diameter={88}
          width={12}
          backgroundColor={colors.darkBlue70}
          withTotal={false}
        />
        <View paddingLeft={16}>
          <Text variant="h1" color={isOverTarget ? colors.red50 : colors.white}>
            {numeral(consumedPortions).format("0.[00]")}
            {hasDayTarget && (
              <Text color={isOverTarget ? colors.red50 : colors.darkBlue40}>
                /{maxPortions}
              </Text>
            )}
            <Text
              color={isOverTarget ? colors.red50 : colors.darkBlue40}
              variant="caption1"
              lineHeight={28}
            >
              {" "}
              {consumedPortions === 1 ? "portion" : "portions"}
            </Text>
          </Text>
          <Text variant="caption2" color={colors.blue20}>
            DAILY TOTAL {hasDayTarget && "TARGET"}
          </Text>
        </View>
      </Row>
      <WaterWidget target={target.water} emptyColor={colors.darkBlue90} date={date} />
    </View>
  )
}

const enhance = compose(
  withDayData,
  withLoader({ message: "Loading Nutrition Journal..." }),
  withProps(({ day }) => ({
    target: day.target,
    meals: day.meals,
    dayStat: calcPortionsInDay(day.meals)
  }))
)

export default enhance(FoodJournalOverview)
