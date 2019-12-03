import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"
import _ from "lodash/fp"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"

export const METRIC_BY_INTERVAL = gql`
  query MetricByInterval($key: MetricKey!, $startDate: NaiveDate!, $endDate: NaiveDate!) {
    metricByInterval(key: $key, startDate: $startDate, endDate: $endDate) {
      totalCount
      nodes {
        id
        date
        value
      }
    }
  }
`

const query = graphql(METRIC_BY_INTERVAL, {
  options: ({
    measurement,
    startDate = moment()
      .subtract(29, "days")
      .format(DATE_FORMAT_GRAPHQL),
    endDate = moment().format(DATE_FORMAT_GRAPHQL)
  }) => ({
    name: "MetricByInterval",
    fetchPolicy: "cache-and-network",
    variables: { __offline__: true, key: measurement, startDate, endDate }
  })
})

const withData = compose(
  query,
  withProps(props => {
    return {
      metricByInterval: _.getOr([], "data.metricByInterval.nodes", props) || []
    }
  })
)

export default withData
