import { compose, lifecycle, withProps, branch } from "recompose"
import { connect } from "react-redux"
import * as Sentry from "sentry-expo"

import { genUuid, today } from "keystone"
import { gradients } from "kui/colors"
import { withLoader } from "hoc/withLoader"
import { withWorkoutSessionById } from "graphql/query/workout/sessionById"
import { withWorkoutTemplateModelById } from "graphql/query/workout/byId"
import _ from "lodash/fp"
import colors from "colors"

import { UPDATE_TRAINING, RESET_TRAINING } from "../redux/actions"

const DEFAULT_WORKOUT_DURATION = 60

const withWorkoutData = compose(
  branch(
    props => props.workoutSessionId,
    withWorkoutSessionById,
    withWorkoutTemplateModelById
  ),
  withLoader({
    color: colors.white,
    backgroundColor: gradients.bg1[0],
    message: "Loading workout..."
  }),
  withProps(props => {
    if (props.workoutSessionId) {
      const workoutData = _.getOr(null, "data.workoutSessionById", props)
      if (workoutData) {
        const body = workoutData.body ? JSON.parse(workoutData.body) : {}
        const workoutTemplate = workoutData.workoutTemplate || null

        return {
          date: workoutData.date || today(),
          model: body.model || {},
          modelMeta: body.meta || {},
          workoutTemplate: workoutTemplate && {
            id: workoutTemplate.id || "",
            name: workoutTemplate.name || "",
            duration: (workoutTemplate.duration || DEFAULT_WORKOUT_DURATION) * 60,
            difficulty: workoutTemplate.difficulty,
            setMap: workoutTemplate.setMap || []
          }
        }
      } else {
        Sentry.captureException(new Error("data.workoutSessionById is empty!"))
      }
    } else if (props.workoutId) {
      const workoutData = _.getOr(null, "data.workoutTemplateById", props)
      if (workoutData) {
        const { model, ...workoutTemplate } = workoutData
        const rawWorkout = model ? JSON.parse(model) : {}
        return {
          date: props.date || today(),
          model: rawWorkout,
          modelMeta: {},
          workoutTemplate: workoutTemplate && {
            ...workoutTemplate,
            duration: (workoutTemplate.duration || DEFAULT_WORKOUT_DURATION) * 60
          }
        }
      } else {
        Sentry.captureException(new Error("data.workoutTemplateById is empty!"))
      }
    }
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
          const { model, modelMeta, date, workoutTemplate, workoutSessionId } = this.props
          if (model && workoutTemplate) {
            this.props.dispatch({ type: RESET_TRAINING })
            this.props.dispatch({
              type: UPDATE_TRAINING,
              value: {
                workoutSessionId: workoutSessionId || genUuid(),
                workoutTemplateId: workoutTemplate.id,
                workoutTemplate: workoutTemplate,
                date,
                model,
                meta: modelMeta
              }
            })
          }
        }
      }
    })
  )
}
