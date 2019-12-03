import React from "react"
import { compose, withProps, withHandlers } from "recompose"

import { withKeystoneWorkoutTemplates } from "graphql/query/workout/keystoneWorkouts"
import { getOr } from "keystone"

import WorkoutsList from "../WorkoutsList"

const KeystoneWorkoutWrapper = props => {
  return <WorkoutsList noDataMessage="No Keystone workouts to show." {...props} />
}

const withKeystoneWorkoutsData = compose(
  withKeystoneWorkoutTemplates,
  withProps(props => {
    const workouts = getOr([], "data.allWorkoutTemplates.nodes", props)
    const isLoading = getOr(false, "data.loading", props)
    return { workouts, isLoading }
  }),
  withHandlers({
    handleRefresh: props => done => {
      props.data
        .refetch()
        .then(done)
        .catch(done)
    }
  })
)

export default withKeystoneWorkoutsData(KeystoneWorkoutWrapper)
