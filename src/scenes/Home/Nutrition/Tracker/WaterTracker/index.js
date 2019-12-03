import { actions } from "react-redux-form/native"
import { compose, withProps } from "recompose"
import { connect } from "react-redux"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import moment from "moment"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { WATER_TRACKER_FORM } from "constants"
import { setSwitch } from "components/Switch/actions"
import { today } from "keystone"
import { withAnimation } from "hoc"
import { withMemberId, withErrorHandler, withLoader } from "/hoc"
import WaterTracker from "scenes/Home/Nutrition/Tracker/WaterTracker/WaterTracker"
import _ from "lodash/fp"
import colors from "kui/colors"
import withRRFLoader from "/hoc/withRRFLoader"

const MEMBER_WATER_METRIC = gql`
  query MemberWaterMetric($date: Date!) {
    currentMember {
      id
      waterMetrics: memberWaterMetricsByMemberId(condition: { date: $date }) {
        nodes {
          id
          value
          date
        }
      }
    }
  }
`

const UPSERT_MEMBER_WATER_METRIC = gql`
  mutation UpsertMemberWaterMetric(
    $clientMutationId: String
    $memberId: Int!
    $date: Date!
    $value: Int!
  ) {
    upsertMemberWaterMetric(
      input: {
        clientMutationId: $clientMutationId
        memberId: $memberId
        date: $date
        value: $value
      }
    ) {
      clientMutationId
      memberWaterMetric {
        id
        date
        memberId
        value
      }
    }
  }
`
const upsertMemberWaterMetric = graphql(UPSERT_MEMBER_WATER_METRIC, {
  props: ({ mutate, ownProps }) => {
    return {
      saveTracker: ({ water: value }) => {
        const date = ownProps.date
        const formattedDate = moment(date).format(DATE_FORMAT_GRAPHQL)
        const memberId = ownProps.memberId
        const clientMutationId = `${Date.now()}`

        const payload = {
          memberId,
          date: formattedDate,
          value,
          clientMutationId
        }

        return mutate({
          variables: {
            ...payload,
            __offline__: true
          },
          optimisticResponse: {
            upsertMemberWaterMetric: {
              clientMutationId,
              __typename: "UpsertMemberWaterMetricPayload",
              memberWaterMetric: {
                __typename: "MemberWaterMetric",
                id: +Date.now(),
                date: formattedDate,
                value,
                memberId: ownProps.memberId
              }
            }
          }
        })
      }
    }
  }
})

const withData = graphql(MEMBER_WATER_METRIC, {
  options: ({ date }) => {
    const formattedDate = date ? moment(date).format(DATE_FORMAT_GRAPHQL) : today()

    return {
      fetchPolicy: "network-only",
      variables: {
        __offline__: true,
        date: formattedDate
      },
      notifyOnNetworkStatusChange: true
    }
  }
})

const withMutations = upsertMemberWaterMetric

export const WATER_SWITCH = "waterTrackerHeaderToggle"

const mapStateToProps = state => {
  const expanded = _.getOr(true, `ui.switches.${WATER_SWITCH}`, state)
  const waterValue = _.getOr(0, `${WATER_TRACKER_FORM}.water`, state)
  return { expanded, waterValue }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { waterValue } = ownProps
  return {
    loadData: () => dispatch(actions.load(WATER_TRACKER_FORM, { water: waterValue })),
    toggleWaterTracker: value => dispatch(setSwitch(WATER_SWITCH)(value))
  }
}

const enhanced = compose(
  withMemberId,
  withData,
  withErrorHandler,
  withLoader({
    color: colors.white50,
    message: null,
    backgroundColor: colors.transparent
  }),
  withProps(props => {
    const waterValue = _.getOr(
      "0",
      "data.currentMember.waterMetrics.nodes[0].value",
      props
    )
    return {
      waterValue
    }
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRRFLoader,
  withMemberId,
  withMutations,
  withAnimation({ onMount: true, onUpdate: true, interestingProp: "expanded" })
)

export default enhanced(WaterTracker)
