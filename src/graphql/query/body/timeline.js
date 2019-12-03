import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import _ from "lodash/fp"

export const BODY_TIMELINE = gql`
  query BodyTimeline($userId: ID, $offset: Int, $first: Int) {
    metricsTimelineByUser(userId: $userId, offset: $offset, first: $first) {
      totalCount
      nodes {
        date
        metrics {
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
        progressPictures {
          totalCount
          nodes {
            id
            localPath
            userId
            isPrivate
            comment
            originalUrl
            previewUrl
          }
        }
      }
      hasNextPage
    }
  }
`

const query = graphql(BODY_TIMELINE, {
  options: ({ offset = 0, first = 5 }) => ({
    name: "BodyTimeline",
    fetchPolicy: "cache-and-network",
    variables: { __offline__: true, offset, first }
  })
})

const withBodyTimeline = compose(
  query,
  withProps(props => {
    const hasNextPage =
      _.getOr(false, "data.metricsTimelineByUser.hasNextPage", props) || false
    const page = _.getOr([], "data.metricsTimelineByUser.nodes", props) || []
    return {
      hasNextPage,
      page
    }
  })
)

export default withBodyTimeline
