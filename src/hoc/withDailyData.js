import { branch, renderNothing, withProps } from "recompose"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { compose } from "recompose"

export const DAILY_SNAPSHOT = gql`
  query DailySnapshot($date: Date!) {
    currentMember {
      id
      firstName
      isOnBoarded
      features {
        nodes {
          id
          name
          comment
        }
      }
      settings {
        nodes {
          value
          setting: settingBySettingId {
            key
          }
        }
      }
      measurementsByDate(date: $date) {
        nodes {
          id
          date
          key
          value
        }
      }
      feelingsByDate(date: $date) {
        nodes {
          id
          memberId
          date
          key
          value
        }
      }
      nutritionProfiles: nutritionProfilesByMemberId {
        nodes {
          id
          label
          days
          notes
          startDate
          macros {
            protein
            fat
            carbs
          }
        }
      }
      snapshot: memberNutritionMetricsByMemberId(condition: { date: $date }) {
        nodes {
          id
          date
          body
          profileBody
        }
      }
      stepsByDate: memberMetricsByMemberId(condition: { date: $date, key: STEPS }) {
        nodes {
          id
          date
          key
          value
        }
      }
    }
  }
`

const withData = graphql(DAILY_SNAPSHOT, {
  options: ({ date }) => ({
    fetchPolicy: "network-only",
    variables: { __offline__: true, date },
    notifyOnNetworkStatusChange: true
  })
})

const defaultOptions = {
  left: renderNothing
}

const withDailyData = (options = defaultOptions) =>
  compose(
    withData,
    withProps(props => {
      const showSplash = !props.data || !props.data.currentMember
      return { showSplash }
    }),
    branch(({ showSplash }) => !!showSplash, options.left)
  )

export default withDailyData
