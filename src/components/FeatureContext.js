import { compose, setPropTypes, withProps } from "recompose"
import PropTypes from "prop-types"
import _ from "lodash/fp"

import withFeatures from "graphql/query/member/features"

const FeatureContext = ({ children, hasFeature }) => children(hasFeature)

const enhance = compose(
  setPropTypes({
    feature: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
  }),
  withFeatures,
  withProps(({ data, feature }) => ({
    hasFeature:
      _.getOr([], "member.features.nodes", data).filter(f => f.name === feature).length >
      0
  }))
)

export default enhance(FeatureContext)
