import _ from "lodash/fp"
import colors from "kui/colors"

export const SOURCES = ["PROTEIN", "FAT", "CARBS", "VEGETABLES"]
export const SOURCE_COLORS = {
  DEFAULT: colors.red50,
  PROTEIN: colors.orange50,
  FAT: colors.green60,
  CARBS: colors.turquoise60,
  VEGETABLES: colors.blue50
}

export const sourceToColor = source =>
  SOURCE_COLORS[source.toUpperCase()]
    ? SOURCE_COLORS[source.toUpperCase()]
    : SOURCE_COLORS.DEFAULT

export const calcPortionsInMeal = items =>
  SOURCES.reduce(
    (res, source) => ({
      ...res,
      [source]: items
        .filter(f => f.sources.includes(source))
        .reduce((sum, item) => sum + (item.portions || 0), 0)
    }),
    {}
  )

export const calcPortionsInDay = meals =>
  calcPortionsInMeal(_.flatten(meals.map(meal => meal.food)))
