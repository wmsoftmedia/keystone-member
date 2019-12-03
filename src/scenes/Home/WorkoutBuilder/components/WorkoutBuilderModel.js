import { compose, lifecycle, branch } from "recompose"
import { connect } from "react-redux"
import _ from "lodash/fp"

import { withWorkoutTemplateModelById } from "graphql/query/workout/byId"
import { withLoader } from "hoc/withLoader"
import { UPDATE_WORKOUT_BUILDER, RESET_WORKOUT_BUILDER } from "../redux/actions"
import { emptyWorkout } from "scenes/Home/WorkoutBuilder/common"
import { modelDecoder } from "../codecs"
import colors, { gradients } from "kui/colors"

const withWorkoutData = compose(
  branch(props => props.workoutId, withWorkoutTemplateModelById),
  withLoader({
    color: colors.white,
    backgroundColor: gradients.bg1[0],
    message: "Loading workout..."
  })
)

const defaultConfig = {
  initReduxState: true
}

export default conf => {
  const config = { ...defaultConfig, ...conf }
  return compose(
    connect(),
    withWorkoutData,
    lifecycle({
      componentWillMount() {
        if (config.initReduxState) {
          this.props.dispatch({ type: RESET_WORKOUT_BUILDER })

          const workoutData = _.getOr(null, "data.workoutTemplateById", this.props)
          if (workoutData) {
            const workoutTemplateModel = workoutData.model
              ? JSON.parse(workoutData.model)
              : {}

            const model = modelDecoder(workoutTemplateModel, {
              ...emptyWorkout,
              id: workoutData.id,
              info: {
                ...emptyWorkout.info,
                name: workoutData.name || "",
                difficulty: workoutData.difficulty,
                duration: (workoutData.duration || 0) * 60,
                notes: workoutData.notes || ""
              }
            })

            this.props.dispatch({
              type: UPDATE_WORKOUT_BUILDER,
              value: {
                model
              }
            })
          }
        }
      }
    })
  )
}
