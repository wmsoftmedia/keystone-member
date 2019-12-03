import { actions } from "react-redux-form/native"
import { compose } from "recompose"
import { graphql } from "@apollo/react-hoc"
import { connect } from "react-redux"
import React from "react"
import gql from "graphql-tag"

import { Screen } from "components/Background"
import { gqlDate, today } from "keystone"
import { metricDisplay } from "scenes/Home/Feelings/display"
import { withErrorHandler, withLoader } from "hoc"
import TrackerForm, { FORM_NAME } from "scenes/Home/Feelings/Tracker/TrackerForm"
import colors, { gradients } from "kui/colors"
import withMemberId from "hoc/withMemberId"

const LIFESTYLE_KEYS = ["motivation", "gratitude", "sleep", "stress_optimization"]

const findMetricByKey = (metrics, key) => metrics.find(m => m.key.toLowerCase() === key)

const makeMetric = metrics => key => {
  const metric = findMetricByKey(metrics, key)
  return metricDisplay({
    key,
    value: metric && metric.value ? metric.value : 0,
    notes: metric && metric.notes ? metric.notes : ""
  })
}

class Tracker extends React.Component {
  constructor(props) {
    super(props)
    props.loadData(props)
  }

  UNSAFE_componentWillUpdate(nextProps) {
    this.props.loadData(nextProps)
  }

  handleSave = formData => {
    const { syncSleep, syncGratitude, syncMotivation, syncStress } = this.props
    return Promise.all([
      syncMotivation(formData.feelings[0]),
      syncGratitude(formData.feelings[1]),
      syncStress(formData.feelings[2]),
      syncSleep(formData.feelings[3]),
    ]).then(() => {

    }).catch(() => { })
  }

  render() {
    return (
      <Screen>
        <TrackerForm onSubmit={this.handleSave} />
      </Screen>
    )
  }
}

const withMutation = metric =>
  graphql(
    gql`
    mutation UpsertMemberMetricV2${metric}($input: UpsertMemberMetricV2Input!) {
      upsertMemberMetricV2(input: $input) {
        memberMetric {
          memberId
          date
          key
          value
          notes
        }
      }
    }
  `,
    {
      props: ({ mutate, ownProps: { memberId, date } }) => {
        return {
          [`sync${metric}`]: feeling => {
            const input = {
              key: feeling.key.toUpperCase(), // required for gql type coercion
              value: feeling.value ? feeling.value : 0,
              memberId,
              date: gqlDate(date),
              notes: feeling.notes
            }

            return mutate({
              variables: { input },
              optimisticResponse: {
                upsertMemberMetricV2: {
                  __typename: "UpsertMemberMetricV2Payload",
                  memberMetric: {
                    __typename: "MemberMetric",
                    date: gqlDate(date),
                    memberId,
                    key: input.key.toUpperCase(),
                    value: input.value,
                    notes: input.notes
                  }
                }
              }
            })
          }
        }
      }
    }
  )

export const MEMBER_FEELINGS_BY_DATE = gql`
  query MemberFeelingsByDate($date: Date!) {
    currentMember {
      id
      feelingsByDate(date: $date) {
        nodes {
          id
          memberId
          date
          key
          value
          notes
        }
      }
    }
  }
`

const withData = graphql(MEMBER_FEELINGS_BY_DATE, {
  options: ({ date }) => ({
    fetchPolicy: "network-only",
    variables: {
      __offline__: true,
      date: date ? gqlDate(date) : today()
    },
    notifyOnNetworkStatusChange: true
  })
})

const loadFormData = dispatch => ({ data }) => {
  const nodes = data.currentMember.feelingsByDate.nodes
  const feelings = LIFESTYLE_KEYS.map(makeMetric(nodes))
  console.log('feeling note', feelings);
  dispatch(actions.load(FORM_NAME, { feelings }))
}

const mapDispatchToProps = dispatch => ({
  loadData: data => loadFormData(dispatch)(data)
})

const enhance = compose(
  withMemberId,
  withData,
  withMutation("Sleep"),
  withMutation("Gratitude"),
  withMutation("Stress"),
  withMutation("Motivation"),
  withErrorHandler,
  withLoader({
    color: colors.white,
    backgroundColor: gradients.bg1[0],
    message: "Loading..."
  }),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(Tracker)
