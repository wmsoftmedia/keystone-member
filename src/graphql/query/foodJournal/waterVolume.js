import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"
import _ from "lodash/fp"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"

export const WATER_VOLUME = gql`
  query MemberWaterMetric($date: Date!) {
    currentMember {
      id
      waterMetrics: memberWaterMetricsByMemberId(condition: { date: $date }) {
        nodes {
          id
          volume
          date
        }
      }
    }
  }
`

const query = graphql(WATER_VOLUME, {
  options: ({ date }) => {
    const formattedDate = (date ? moment(date) : moment()).format(DATE_FORMAT_GRAPHQL)

    return {
      name: "WaterVolume",
      fetchPolicy: "cache-and-network",
      variables: {
        __offline__: true,
        date: formattedDate
      }
    }
  }
})

const withWaterVolume = compose(
  query,
  withProps(props => {
    return {
      waterVolume:
        _.getOr(0, "data.currentMember.waterMetrics.nodes[0].volume", props) || 0
    }
  })
)

export default withWaterVolume
