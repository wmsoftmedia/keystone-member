import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import foodFragments from "graphql/fragment/food/food"
import { genUuid, readQuerySafe, getOr } from "keystone"
import { ALL_MY_FOOD_QUERY } from "graphql/query/food/allMyFood"

const CREATE_FOOD = gql`
  mutation CreateFood($input: CreateFoodInput!) {
    createFood(input: $input) {
      food {
        ...FoodFull
      }
    }
  }
  ${foodFragments.fullFood}
`

const appendFood = (store, resp) => {
  const cachedQuery = { query: ALL_MY_FOOD_QUERY }
  const { error, data } = readQuerySafe(store, cachedQuery)
  if (error) return

  const newFood = resp.data.createFood.food
  const curFood = getOr([], "currentMember.allMyFood.nodes", data)

  if (!curFood.find(m => m.id === newFood.id)) {
    store.writeQuery({
      query: ALL_MY_FOOD_QUERY,
      data: {
        ...data,
        currentMember: {
          ...data.currentMember,
          allMyFood: {
            ...data.currentMember.allMyFood,
            nodes: [...data.currentMember.allMyFood.nodes, newFood]
          }
        }
      }
    })
  }
}

export default graphql(CREATE_FOOD, {
  props: ({ mutate }) => ({
    createFood: input => {
      const id = genUuid()
      // eslint-disable-next-line no-unused-vars
      const { memberId, ...food } = input.food
      mutate({
        variables: {
          input: {
            food: {
              id,
              ...input.food
            }
          }
        },
        optimisticResponse: {
          createFood: {
            __typename: "CreateFoodPayload",
            food: {
              __typename: "Food",
              id,
              ...food,
              servings: food.servings.map(s => ({
                ...s,
                __typename: "FoodServing"
              })),
              provider: null,
              externalId: null,
              origin: null,
              isMyFood: true
            }
          }
        },
        update: appendFood
      })
    }
  })
})
