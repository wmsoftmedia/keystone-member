import React from "react"
import { compose, withProps, withHandlers } from "recompose"

import { withAssignedWorkoutTemplates } from "graphql/query/workout/assignedWorkouts"
import { getOr } from "keystone"

import WorkoutsList from "../WorkoutsList"

const AssignedWorkoutsWrapper = props => {
  return <WorkoutsList noDataMessage="No assigned workouts to show." {...props} />
}

const withAssignedWorkoutsData = compose(
  withAssignedWorkoutTemplates,
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

export default withAssignedWorkoutsData(AssignedWorkoutsWrapper)
