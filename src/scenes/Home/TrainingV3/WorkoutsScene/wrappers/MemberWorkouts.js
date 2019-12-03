import React from "react"
import { compose, withProps, withHandlers } from "recompose"

import { withMemberWorkoutTemplates } from "graphql/query/workout/memberWorkouts"
import { getOr } from "keystone"

import WorkoutsList from "../WorkoutsList"

const MemberWorkoutsWrapper = props => {
  return <WorkoutsList {...props} />
}

const withMemberWorkoutsData = compose(
  withMemberWorkoutTemplates,
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

export default withMemberWorkoutsData(MemberWorkoutsWrapper)
