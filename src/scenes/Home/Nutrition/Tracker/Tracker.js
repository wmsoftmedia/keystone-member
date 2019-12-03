import { View } from "glamorous-native"
import { actions } from "react-redux-form/native"
import { compose, withContext } from "recompose"
import { connect } from "react-redux"
import React from "react"

import { Gradient, LoadingSplash } from "components/Background"
import { NUTRITION_TRACKER_FORM } from "constants"
import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import PropTypes from "prop-types"
import Tooltip from "kui/components/Tooltip"
import TrackerForm from "scenes/Home/Nutrition/Tracker/TrackerForm"
import WaterTracker from "scenes/Home/Nutrition/Tracker/WaterTracker"
import _ from "lodash/fp"
import colors, { gradients } from "kui/colors"
import withTooltip from "hoc/withTooltip"

const WaterBubble = ({ date, tooltipEvents }) => (
  <Tooltip
    order={5}
    name="nutrition-water"
    title="Add water"
    text="TODO: Every day to be healthy you need to drink enough water. Every 'plus' means one glass of water 250 ml."
    position="absolute"
    bottom={20}
    left={0}
    onNext={() => tooltipEvents.emit("nextStep", "nutrition-action")}
    onStop={() => tooltipEvents.emit("skip")}
    onPrev={() => tooltipEvents.emit("prevStep", "nutrition-add-meal")}
  >
    <View
      backgroundColor={colors.darkBlue80}
      minWidth={56}
      height={80}
      borderTopRightRadius={40}
      borderBottomRightRadius={40}
      shadowRadius={30}
      shadowOffset={{ width: 10, height: 10 }}
      shadowColor={"rgb(1, 27, 51)"}
      shadowOpacity={0.5}
      elevation={4}
    >
      <WaterTracker date={date} />
    </View>
  </Tooltip>
)

class Tracker extends React.Component {
  constructor(props) {
    super(props)
    props.loadData(props)
  }

  // Possible fix for the race condition in the tracker
  // Remove if left commented for more than 1 month
  // UNSAFE_componentWillUpdate(nextProps) {
  //   nextProps.loadData(nextProps)
  // }

  render() {
    const props = this.props
    const { isLoading, date, tooltipEvents, ...rest } = props
    return (
      <View flex={1}>
        <Gradient colors={[gradients.bg1[0], gradients.bg1[0]]} />
        <TrackerForm date={date} onSubmitFail={e => console.error(e)} {...rest} />
        <WaterBubble date={date} tooltipEvents={tooltipEvents} />
        {isLoading && <LoadingSplash message="Updating your diary" />}
      </View>
    )
  }
}

Tracker.propTypes = {
  profile: PropTypes.shape({
    label: PropTypes.string.isRequired
  }),
  progress: PropTypes.shape({
    meals: PropTypes.array.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired
}

const fromProfile = profile => {
  const meals = profile.meals.nodes.map(n => ({ ...n, entries: [] }))
  return { meals }
}

const fromProgress = progress => {
  const meals = progress.meals.map((m, mealIndex) => ({
    ...m,
    entries: m.entries.map((e, i) => ({
      ...e,
      measure: "g",
      index: `${mealIndex},${i}`
    }))
  }))
  return { meals }
}

const getInitialValues = ({ profile, progress }) => {
  if (progress && progress.meals) {
    return fromProgress(progress)
  }
  return fromProfile(profile)
}

const loadFormData = dispatch => ({ profile, progress, isLoading }) => {
  const initialValues = getInitialValues({ profile, progress })
  dispatch(actions.load(NUTRITION_TRACKER_FORM, { ...initialValues, isLoading }))
}

const mapStateToProps = state => {
  return {
    isLoading: _.getOr(false, `${NUTRITION_TRACKER_FORM}.isLoading`, state),
    error: _.getOr(null, `${NUTRITION_TRACKER_FORM}.error`, state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    loadData: data => loadFormData(dispatch)(data)
  }
}

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTooltip,
  withExtendedErrorHandler({
    errorProp: "error",
    retryHandler: props =>
      props.dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.error`, null)),
    textColor: colors.white
  }),
  withContext(
    { tooltipEvents: PropTypes.object, startTooltip: PropTypes.func },
    ({ tooltipEvents, startTooltip }) => ({ tooltipEvents, startTooltip })
  )
)

export default enhance(Tracker)
