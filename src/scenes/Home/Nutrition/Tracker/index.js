import { compose } from "recompose"
import { withProps, withHandlers } from "recompose"
import React from "react"
import moment from "moment"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { deleteFavouriteFood } from "graphql/mutation/food/deleteFavourite"
import { emptyTotals, isCurrent, isFutureDate, mealTotals, sortMoments } from "keystone"
import { extractItemId } from "keystone/food"
import { getProfileForMetric } from "scenes/Home/Nutrition/utils"
import { saveFavouriteFood } from "graphql/mutation/food/addFavourite"
import {
  upsertMemberNutritionMetric,
  withNutritionTracker
} from "scenes/Home/Nutrition/Tracker/graphql"
import { withAllFavouritesTransformed } from "graphql/query/food/allMyFavourites"
import { withErrorHandler, withLoader, withMemberId } from "hoc"
import Tracker from "scenes/Home/Nutrition/Tracker/Tracker"
import colors, { gradients } from "kui/colors"

const NutritionTrackerContainer = props => {
  const { date, progress, totals, favourites, currentProfile } = props
  const { saveTracker, toggleFavourite } = props

  return (
    <Tracker
      {...props}
      date={date}
      totals={totals}
      profile={currentProfile}
      progress={progress.body}
      favourites={favourites}
      addFavourite={toggleFavourite}
      onSubmit={saveTracker(date, progress.id, currentProfile)}
    />
  )
}

// EFFECTS & DECORATION ---------------------------------------------

const parseTrackerProgress = tracker => {
  if (
    !tracker ||
    !tracker.nodes ||
    tracker.nodes.length === 0 ||
    !tracker.nodes[0].body
  ) {
    return { id: null, body: { meals: [] } }
  }
  const progress = tracker.nodes[0]
  const body = JSON.parse(progress.body)
  return { body, id: progress.id }
}

const getTotals = snapshot => {
  if (snapshot.length === 0 || !snapshot[0]) {
    return emptyTotals
  }
  const metric = snapshot[0]
  const body = JSON.parse(metric.body)
  return mealTotals(body.meals)
}

const withData = compose(
  withNutritionTracker,
  withAllFavouritesTransformed
)

const withMutations = compose(
  saveFavouriteFood,
  upsertMemberNutritionMetric,
  deleteFavouriteFood
)

const withFavourites = withProps(props => {
  const { allFavourites: favs } = props
  const { addFavourite, deleteFavourite } = props
  const favourites = (favs || []).reduce((acc, fav) => {
    const externalFav = fav.externalId ? { [fav.externalId]: fav.meta.favId } : {}
    return { ...acc, ...externalFav, [fav.id]: fav.meta.favId }
  }, {})
  const toggleFavourite = (newFavouriteState, entry) => {
    const foodId = extractItemId(entry)
    if (newFavouriteState) {
      return addFavourite(entry)
    } else {
      return deleteFavourite(favourites[foodId])
    }
  }
  return { favourites, toggleFavourite }
})

const withCurrentProfile = withProps(props => {
  const { date: rawDate } = props
  //temporary solution to make every date a formatted date
  const date = rawDate.format ? rawDate.format(DATE_FORMAT_GRAPHQL) : rawDate
  const profiles = props.data.currentMember.nutritionProfiles.nodes
    .filter(p => p.startDate)
    .filter(p => {
      const startDate = moment(p.startDate)
      return startDate.isBefore(moment(rawDate)) || startDate.isSame(moment(rawDate))
    })
    .sort((p1, p2) => sortMoments(moment(p2.startDate), moment(p1.startDate)))
  const trackedProfile = getProfileForMetric(props.data.currentMember.tracker)
  const currentProfile =
    trackedProfile && !isFutureDate(rawDate)
      ? trackedProfile
      : profiles.find(p => isCurrent(p, moment(date).day()))
  return { currentProfile }
})

const enhanced = compose(
  withMemberId,
  withData,
  withMutations,
  withErrorHandler,
  withLoader({ color: colors.white, backgroundColor: gradients.bg1[0] }),
  withProps(props => {
    const { tracker } = props.data.currentMember
    const progress = parseTrackerProgress(tracker)
    const totals = getTotals(tracker.nodes)
    return { progress, totals }
  }),
  withFavourites,
  withCurrentProfile,
  withProps(props => {
    const { date: rawDate } = props
    //temporary solution to make every date a formatted date
    const date = rawDate.format ? rawDate.format(DATE_FORMAT_GRAPHQL) : rawDate
    return { date }
  }),
  withHandlers({
    onStatClick: props => () => {
      props.navigation.replace("NutritionTrends")
    },
    onDayClick: props => () => {
      props.navigation.navigate({
        routeName: "NutritionDaySelector",
        key: "NutritionDaySelector"
      })
    },
    onKitchenClick: props => () => {
      props.navigation.replace("KitchenManager")
    }
  })
)

export default enhanced(NutritionTrackerContainer)
