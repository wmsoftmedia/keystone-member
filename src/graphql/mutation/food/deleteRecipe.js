import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { readQuerySafe, getOr, genMutationId } from "keystone"
import { ALL_MY_RECIPES_QUERY } from "graphql/query/food/allMyRecipes"

const DELETE_RECIPE = gql`
  mutation DeleteMyRecipe($input: DeleteMyRecipeInput!) {
    deleteMyRecipe(input: $input) {
      clientMutationId
    }
  }
`
const deleteRecipe = (store, id) => {
  const cachedQuery = { query: ALL_MY_RECIPES_QUERY }
  const { error, data } = readQuerySafe(store, cachedQuery)
  if (error) return

  const oldRecipes = getOr([], "currentMember.allMyRecipes.nodes", data)
  data.currentMember.allMyRecipes.nodes = oldRecipes.filter(
    recipe => getOr(null, "foodByFoodId.id", recipe) !== id
  )
  store.writeQuery({ query: ALL_MY_RECIPES_QUERY, data })
}

export default graphql(DELETE_RECIPE, {
  props: ({ mutate }) => ({
    deleteRecipe: id => {
      return mutate({
        variables: {
          input: { foodId: id },
          clientMutationId: 1
        },
        optimisticResponse: {
          deleteMyRecipe: {
            clientMutationId: 1,
            __typename: "DeleteMyRecipePayload"
          }
        },
        update: store => deleteRecipe(store, id)
      })
    }
  })
})
