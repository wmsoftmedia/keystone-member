import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import moment from "moment"

import {
  cals,
  genMutationId,
  genUuid,
  gqlDatetime,
  readQuerySafe
} from "../../../../../lib/keystone"

const GET_MEMBER_MY_FOOD_BY_ID = gql`
  query GetMemberMyFoodById($id: Uuid!) {
    memberMyFoodById(id: $id) {
      id
      title
      calories
      protein
      fat
      carbs
      fibre
      alcohol
      updatedAt
      createdAt
    }
  }
`

export const getMemberMyFoodById = graphql(GET_MEMBER_MY_FOOD_BY_ID, {
  options: ({ myFoodId }) => {
    return {
      fetchPolicy: "network-only",
      variables: {
        __offline__: true,
        id: myFoodId
      },
      notifyOnNetworkStatusChange: true
    }
  }
})

const CREATE_MEMBER_MY_FOOD = gql`
  mutation CreateMemberMyFood(
    $clientMutationId: String!
    $id: Uuid!
    $memberId: Int!
    $title: String
    $calories: Float
    $protein: Float
    $fat: Float
    $carbs: Float
    $fibre: Float
    $alcohol: Float
  ) {
    createMemberMyFood(
      input: {
        clientMutationId: $clientMutationId
        memberMyFood: {
          id: $id
          memberId: $memberId
          title: $title
          calories: $calories
          protein: $protein
          fat: $fat
          carbs: $carbs
          fibre: $fibre
          alcohol: $alcohol
        }
      }
    ) {
      clientMutationId
      memberMyFood {
        id
        memberId
        title
        calories
        protein
        fat
        carbs
        fibre
        alcohol
        updatedAt
        createdAt
      }
    }
  }
`

export const ALL_MEMBER_MY_FOODS = gql`
  query {
    currentMember {
      id
      memberMyFoodsByMemberId(orderBy: CREATED_AT_DESC) {
        nodes {
          id
          memberId
          title
          calories
          protein
          fat
          carbs
          fibre
          alcohol
          updatedAt
          createdAt
        }
      }
    }
  }
`

const createMemberMyFoodCache = (store, memberMyFood) => {
  const { error, data } = readQuerySafe(store, { query: ALL_MEMBER_MY_FOODS })
  if (error) {
    return
  }
  const nodes = data.currentMember.memberMyFoodsByMemberId.nodes
  data.currentMember.memberMyFoodsByMemberId.nodes = [memberMyFood, ...nodes]
  store.writeQuery({ query: ALL_MEMBER_MY_FOODS, data })
}

export const createMemberMyFood = graphql(CREATE_MEMBER_MY_FOOD, {
  props: ({ mutate, ownProps }) => {
    return {
      createMyFood: formData => {
        const id = genUuid()
        const memberId = ownProps.memberId
        const clientMutationId = genMutationId()
        const createdAt = moment()

        const stringToNull = value => (value === "" ? null : value)
        const protein = stringToNull(formData.protein || null)
        const fat = stringToNull(formData.fat || null)
        const carbs = stringToNull(formData.carbs || null)
        const calories = cals({ protein, fat, carbs })
        const title = formData.title ? formData.title : ""

        const payload = {
          clientMutationId,
          id,
          memberId,
          title,
          protein,
          fat,
          carbs,
          calories,
          fibre: null,
          alcohol: null
        }

        return mutate({
          variables: { __offline__: true, ...payload },
          update: (store, { data }) => {
            createMemberMyFoodCache(store, data.createMemberMyFood.memberMyFood)
          },
          optimisticResponse: {
            createMemberMyFood: {
              __typename: "createMemberMyFoodPayload",
              clientMutationId,
              memberMyFood: {
                __typename: "MemberMyFood",
                ...payload,
                updatedAt: gqlDatetime(createdAt),
                createdAt: gqlDatetime(createdAt)
              }
            }
          }
        })
      }
    }
  }
})

const UPDATE_MEMBER_MY_FOOD_BY_ID = gql`
  mutation UpdateMemberMyFoodById(
    $clientMutationId: String!
    $id: Uuid!
    $patch: MemberMyFoodPatch!
  ) {
    updateMemberMyFoodById(
      input: { id: $id, clientMutationId: $clientMutationId, memberMyFoodPatch: $patch }
    ) {
      clientMutationId
      memberMyFood {
        id
        memberId
        title
        calories
        protein
        fat
        carbs
        fibre
        alcohol
        updatedAt
      }
    }
  }
`

const floatOr = (z = 0, min = 0) => v => {
  return Math.max(min, parseFloat(v) || z)
}

export const updateMemberMyFoodById = graphql(UPDATE_MEMBER_MY_FOOD_BY_ID, {
  props: ({ mutate, ownProps }) => {
    const { memberId } = ownProps
    return {
      updateMyFoodById: id => formData => {
        const clientMutationId = genMutationId()
        const formatMacro = floatOr(0, 0)

        const stringToNull = value => (value === "" ? null : value)
        const protein = stringToNull(formatMacro(formData.protein) || null)
        const fat = stringToNull(formatMacro(formData.fat) || null)
        const carbs = stringToNull(formatMacro(formData.carbs) || null)
        const calories = cals({ protein, fat, carbs })
        const title = formData.title ? formData.title : ""

        const patch = {
          id,
          memberId,
          title,
          protein,
          fat,
          carbs,
          calories,
          fibre: null,
          alcohol: null,
          updatedAt: gqlDatetime(moment())
        }

        return mutate({
          variables: { __offline__: true, clientMutationId, id, patch },
          optimisticResponse: {
            updateMemberMyFoodById: {
              __typename: "updateMemberMyFoodPayload",
              clientMutationId,
              memberMyFood: {
                __typename: "MemberMyFood",
                ...patch
              }
            }
          }
        })
      }
    }
  }
})
