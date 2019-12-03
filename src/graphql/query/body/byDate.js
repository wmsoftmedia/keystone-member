import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"
import _ from "lodash/fp"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"

export const METRICS_BY_DATE = gql`
  query MetricDayByDate($date: NaiveDate!) {
    metricDayByDate(date: $date) {
      date
      bodyWeight
      bodyFatPercentage
      bodyFatMass
      skeletalMuscleMass
      circumference {
        neck
        chest
        abdomen
        hip
        rightArm
        rightThigh
      }
      sleepHours
      bloodPressure {
        systole
        diastole
      }
      menstrualDay
      heartRate
      heartRateVar
      bodyTemp
    }
  }
`

const query = graphql(METRICS_BY_DATE, {
  options: ({ date }) => ({
    name: "MetricDayByDate",
    fetchPolicy: "cache-and-network",
    variables: { __offline__: true, date: moment(date).format(DATE_FORMAT_GRAPHQL) }
  })
})

const withBodyMetrics = compose(
  query,
  withProps(props => {
    return {
      bodyMetrics: _.getOr({}, "data.metricDayByDate", props) || {}
    }
  })
)

export default withBodyMetrics
