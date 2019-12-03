import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"

import { ALL_FAVOURITES } from "graphql/query/food/allMyFavourites"
import { genMutationId, readQuerySafe } from "keystone"

export const DELETE_MEMBER_FAVOURITE_FOOD = gql`
  mutation DeleteFavouriteFood($id: Uuid!, $clientMutationId: String!) {
    deleteFavouriteFoodById(input: { id: $id, clientMutationId: $clientMutationId }) {
      clientMutationId
    }
  }
`

export const deleteFavouriteFood = graphql(DELETE_MEMBER_FAVOURITE_FOOD, {
  props: ({ mutate }) => {
    const clientMutationId = genMutationId()
    return {
      deleteFavourite: id => {
        return mutate({
          variables: {
            id,
            clientMutationId,
            __offline__: true
          },
          update: store => {
            updateAllFavourites(store, id)
          },
          optimisticResponse: {
            deleteFavouriteFoodById: {
              clientMutationId,
              __typename: "DeleteFavouriteFoodPayload"
            }
          }
        })
      }
    }
  }
})

export const updateAllFavourites = (store, id) => {
  const { error, data } = readQuerySafe(store, {
    query: ALL_FAVOURITES
  })
  if (error) return

  const newFavourites = data.favourites.nodes.filter(f => f.id !== id)
  data.favourites.nodes = newFavourites

  store.writeQuery({ query: ALL_FAVOURITES, data })
}
