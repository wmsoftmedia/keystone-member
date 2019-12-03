import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import moment from "moment"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { MEMBER_NUTRITION_SNAPSHOT } from "scenes/Home/Nutrition/Overview/Today"
import { MEMBER_NUTRITION_STREAK } from "scenes/Home/Nutrition/Overview/Today/Today"
import { applyCacheUpdates, isToday, readQuerySafe, today } from "keystone"

// QUERIES ------------------------------------------------------------

const MEMBER_NUTRITION_PROGRESS = gql`
  query MemberNutritionProgress($date: Date!) {
    currentMember {
      id
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
          meals: nutritionProfileMealsByNutritionProfileId {
            nodes {
              id
              macros {
                protein
                fat
                carbs
              }
              order
            }
          }
        }
      }
      tracker: memberNutritionMetricsByMemberId(condition: { date: $date }) {
        nodes {
          id
          date
          body
          profileBody
        }
      }
    }
  }
`

export const withNutritionTracker = graphql(MEMBER_NUTRITION_PROGRESS, {
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

// MUTATIONS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const UPSERT_MEMBER_NUTRITION_METRIC = gql`
  mutation UpsertMemberNutritionMetric(
    $memberId: Int!
    $date: Date!
    $body: Json!
    $profileBody: Json
    $clientMutationId: String
  ) {
    upsertMemberNutritionMetric(
      input: {
        memberId: $memberId
        date: $date
        body: $body
        profileBody: $profileBody
        clientMutationId: $clientMutationId
      }
    ) {
      clientMutationId
      memberNutritionMetric {
        id
        date
        body
        profileBody
      }
    }
  }
`

// CACHE UPDATES

export const updateSnapshot = ({ date, __offline__ }) => (store, cachePayload) => {
  if (isToday(date)) {
    const { error, data } = readQuerySafe(store, {
      query: MEMBER_NUTRITION_SNAPSHOT,
      variables: { date, __offline__ }
    })
    if (error) return
    data.currentMember.snapshot.nodes = [cachePayload]
    store.writeQuery({
      query: MEMBER_NUTRITION_SNAPSHOT,
      variables: { date, __offline__ },
      data
    })
  }
}

export const updateTracker = ({ date, clientMutationId, __offline__ }) => (
  store,
  cachePayload
) => {
  const { error, data } = readQuerySafe(store, {
    query: MEMBER_NUTRITION_PROGRESS,
    variables: { date, clientMutationId, __offline__ }
  })
  if (error) return
  data.currentMember.tracker.nodes = [cachePayload]
  store.writeQuery({
    query: MEMBER_NUTRITION_PROGRESS,
    variables: { date, clientMutationId, __offline__ },
    data: data
  })
}

// MUTATIONS

export const upsertMemberNutritionMetric = graphql(UPSERT_MEMBER_NUTRITION_METRIC, {
  props: ({ mutate, ownProps }) => {
    return {
      saveTracker: (date, id, currentProfile = null) => formData => {
        const formattedDate = moment(date).format(DATE_FORMAT_GRAPHQL)
        const body = JSON.stringify(formData)
        const memberId = ownProps.memberId
        const payload = {
          memberId: memberId,
          date: formattedDate,
          body: body,
          profileBody: currentProfile ? JSON.stringify(currentProfile) : null
        }
        const mutationId = `${Date.now()}`
        return mutate({
          variables: {
            ...payload,
            clientMutationId: mutationId,
            __offline__: true
          },
          refetchQueries: [
            {
              query: MEMBER_NUTRITION_STREAK,
              variables: { __offline__: true, startDate: date }
            }
          ],
          optimisticResponse: {
            upsertMemberNutritionMetric: {
              clientMutationId: mutationId,
              __typename: "UpsertMemberNutritionMetricPayload",
              memberNutritionMetric: {
                __typename: "MemberNutritionMetric",
                id: id || +Date.now(),
                date: formattedDate,
                body,
                profileBody: currentProfile ? JSON.stringify(currentProfile) : null
              }
            }
          },
          update: (store, { data: { upsertMemberNutritionMetric } }) => {
            const { memberNutritionMetric } = upsertMemberNutritionMetric
            applyCacheUpdates(store, memberNutritionMetric)({
              date,
              clientMutationId: mutationId,
              __offline__: true
            })([updateSnapshot, updateTracker])
          }
        })
      }
    }
  }
})
