import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { readQuerySafe, getOr } from "keystone"
import { ALL_FAVOURITES } from "graphql/query/food/allMyFavourites"
import { ALL_MY_FOOD_QUERY } from "graphql/query/food/allMyFood"
import { ALL_RECENT_FOOD } from "graphql/query/food/allRecent"

const DELETE_FOOD = gql`
  mutation DeleteFood($input: DeleteFoodByIdInput!) {
    deleteFoodById(input: $input) {
      deletedFoodId
    }
  }
`

const deleteFood = (store, id) => {
  const cachedQuery = { query: ALL_MY_FOOD_QUERY }
  const { error, data } = readQuerySafe(store, cachedQuery)
  if (!error) {
    store.writeQuery({
      query: ALL_MY_FOOD_QUERY,
      data: {
        ...data,
        currentMember: {
          ...data.currentMember,
          allMyFood: {
            ...data.currentMember.allMyFood,
            nodes: getOr([], "currentMember.allMyFood.nodes", data).filter(
              f => f.id !== id
            )
          }
        }
      }
    })
  }

  const recentResult = readQuerySafe(store, { query: ALL_RECENT_FOOD })
  if (!recentResult.error) {
    const { data } = recentResult
    const oldFood = getOr([], "recent.nodes", data)
    data.recent.nodes = oldFood.filter(food => food.foodId !== id)
    store.writeQuery({ query: ALL_RECENT_FOOD, data })
  }

  const favsResult = readQuerySafe(store, { query: ALL_FAVOURITES })
  if (!favsResult.error) {
    const { data } = favsResult
    const newFavourites = data.favourites.nodes.filter(f => f.foodByFoodId.id !== id)
    data.favourites.nodes = newFavourites
    store.writeQuery({ query: ALL_FAVOURITES, data })
  }
}

export default graphql(DELETE_FOOD, {
  props: ({ mutate }) => ({
    deleteFood: id => {
      mutate({
        variables: {
          input: { id }
        },
        optimisticResponse: {
          deleteFoodById: {
            __typename: "DeleteFoodPayload",
            deletedFoodId: id
          }
        },
        update: store => deleteFood(store, id)
      })
    }
  })
})
