import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import _ from "lodash/fp"

export const LAST_BODY_METRICS_BY_DATE = gql`
  query LastMetricsByDate($keys: [BodyMeasurementKey!], $date: NaiveDate!) {
    lastMetricsByDate(keys: $keys, date: $date) {
      bodyWeight {
        id
        date
        value
        delta
      }
      bodyFatPercentage {
        id
        date
        value
        delta
      }
      bodyFatMass {
        id
        date
        value
        delta
      }
      skeletalMuscleMass {
        id
        date
        value
        delta
      }
      circumference {
        id
        date
        value
        delta
      }
      sleepHours {
        id
        date
        value
        delta
      }
      heartRate {
        id
        date
        value
        delta
      }
      heartRateVar {
        id
        date
        value
        delta
      }
      bodyTemp {
        id
        date
        value
        delta
      }
    }
  }
`

const query = graphql(LAST_BODY_METRICS_BY_DATE, {
  options: ({
    date,
    keys = [
      "BODY_WEIGHT",
      "BODY_FAT_PERCENTAGE",
      "BODY_FAT_MASS",
      "SKELETAL_MUSCLE_MASS",
      "CIRCUMFERENCE",
      "SLEEP_HOURS",
      "BLOOD_PRESSURE",
      "MENSTRUAL_DAY",
      "HEART_RATE",
      "HEART_RATE_VAR",
      "BODY_TEMP"
    ]
  }) => ({
    name: "LastMetricsByDate",
    fetchPolicy: "cache-and-network",
    variables: { __offline__: true, date, keys }
  })
})

const withLastMetrics = compose(
  query,
  withProps(props => {
    return {
      lastMetrics: _.getOr({}, "data.lastMetricsByDate", props) || {}
    }
  })
)

export default withLastMetrics
