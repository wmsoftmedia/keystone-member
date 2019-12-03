import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import recipeFragments from "graphql/fragment/food/recipe"
import foodFragments from "graphql/fragment/food/food"
import { compose, withProps } from "recompose"
import { getOr } from "keystone"
import { dataToRecipe } from "keystone/food"

export const GET_RECIPE_QUERY = gql`
  query GetRecipeById($id: Uuid!) {
    recipeByFoodId(foodId: $id) {
      id
      food: foodByFoodId {
        ...FoodMin
      }
      recipe: memberRecipeByRecipeId {
        ...RecipeFull
      }
    }
  }
  ${recipeFragments.fullRecipe}
  ${foodFragments.minFood}
`

const query = graphql(GET_RECIPE_QUERY, {
  options: ({ recipeId }) => ({
    fetchPolicy: "network-only",
    variables: { id: recipeId }
  })
})

export const GetRecipeByIdTransformed = compose(
  query,
  withProps(props => ({
    recipe: dataToRecipe(getOr({}, "data.recipeByFoodId", props))
  }))
)
export default graphql(GET_RECIPE_QUERY, {
  options: ({ recipeId }) => ({
    fetchPolicy: "network-only",
    variables: { id: recipeId }
  })
})
