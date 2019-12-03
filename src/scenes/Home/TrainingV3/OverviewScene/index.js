import React from "react"

import { compose } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import Overview from "./Overview"
import { withLoader } from "hoc"
import { withWorkoutTemplateModelSessionById } from "graphql/query/workout/byId"
import colors from "kui/colors"

const OverviewScene = props => <Overview {...props} />

const enhanced = compose(
  withMappedNavigationParams(),
  withWorkoutTemplateModelSessionById,
  withLoader({
    color: colors.white,
    backgroundColor: colors.blue8,
    message: "Loading workout..."
  })
)

export default enhanced(OverviewScene)
