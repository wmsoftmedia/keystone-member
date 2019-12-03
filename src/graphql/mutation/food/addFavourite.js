import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { ALL_FAVOURITES } from "graphql/query/food/allMyFavourites"
import { genMutationId, genUuid, getOr, readQuerySafe } from "keystone"
import { dataToFood } from "keystone/food"
import foodFragments from "graphql/fragment/food/food"

export const ADD_MEMBER_FAVOURITE_FOOD = gql`
  mutation SaveFavouriteFood($id: Uuid!, $food: Json!) {
    saveFavouriteFood(input: { id: $id, food: $food }) {
      clientMutationId
      favouriteFood {
        id
        favId: id
        foodByFoodId {
          ...FoodFull
        }
      }
    }
  }
  ${foodFragments.fullFood}
`

export const saveFavouriteFood = graphql(ADD_MEMBER_FAVOURITE_FOOD, {
  props: ({ mutate }) => {
    return {
      addFavourite: entry => {
        const id = genUuid()
        const mutationId = genMutationId()
        const food = dataToFood(entry)

        if (food.id === -1) return Promise.reject("Invalid ID")
        return mutate({
          variables: {
            id,
            food: JSON.stringify(food),
            __offline__: true,
            clientMutationId: mutationId
          },
          update: updateAllFavourites,
          optimisticResponse: {
            saveFavouriteFood: {
              clientMutationId: mutationId,
              __typename: "SaveFavouriteFoodPayload",
              favouriteFood: {
                __typename: "FavouriteFood",
                id,
                favId: id,
                foodByFoodId: {
                  __typename: "Food",
                  title: food.name ? food.name : "New Food",
                  ...food,
                  ...food.macros,
                  servings: food.servings.map(s => ({
                    ...s,
                    __typename: "FoodServing"
                  })),
                  origin: food.origin || null
                }
              }
            }
          }
        })
      }
    }
  }
})

export const updateAllFavourites = (store, resp) => {
  const { error, data } = readQuerySafe(store, {
    query: ALL_FAVOURITES
  })
  if (error) return

  const favFood = getOr({}, "data.saveFavouriteFood.favouriteFood", resp)

  data.favourites.nodes.push(favFood)
  store.writeQuery({ query: ALL_FAVOURITES, data })
}
