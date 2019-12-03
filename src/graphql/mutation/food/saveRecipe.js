// packages
import _ from "lodash/fp"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
// queries
import foodFragments from "graphql/fragment/food/food"
import { ALL_MY_RECIPES_QUERY } from "graphql/query/food/allMyRecipes"
// project components
import { readQuerySafe, genMutationId, genUuid, getOr, round } from "keystone"
import {
  SOURCE_DB_FOOD,
  SOURCE_CACHE_DB_FOOD,
  mealNutritionFacts,
  getRefNutritionFacts
} from "keystone/food"

const SAVE_RECIPE = gql`
  mutation SaveMyRecipe($input: SaveMyRecipeInput!) {
    saveMyRecipe(input: $input) {
      clientMutationId
      memberEvaluatedRecipe {
        id
        food: foodByFoodId {
          ...FoodFull
        }
      }
    }
  }
  ${foodFragments.fullFood}
`

const appendRecipe = (store, resp) => {
  const cachedQuery = { ALL_MY_RECIPES_QUERY }
  const { error, data } = readQuerySafe(store, cachedQuery)
  if (error) return

  const newRecipe = resp.data.saveMyRecipe.memberEvaluatedRecipe
  const curRecipes = getOr([], "currentMember.allMyRecipes.nodes", data)

  data.currentMember.allMyRecipes.nodes = curRecipes.find(m => m.id === newRecipe.id)
    ? curRecipes
    : [newRecipe, ...curRecipes]
  store.writeQuery({ ALL_MY_RECIPES_QUERY, data })
}

const prepareFood = _.memoize.convert({ fixed: false })(
  food => {
    if ([SOURCE_DB_FOOD, SOURCE_CACHE_DB_FOOD].includes(food.type)) {
      return {
        id: food.id,
        source: "DB"
      }
    }
    return {
      ...food,
      id: genUuid()
    }
  },
  f => f.id
)

export default graphql(SAVE_RECIPE, {
  props: ({ mutate }) => ({
    saveRecipe: recipe => {
      const mutationId = genMutationId()

      const content = recipe.ingredients.map((item, i) => ({
        id: genUuid(),
        orderIndex: i,
        serving: item.serving,
        food: prepareFood(item.food)
      }))

      const foodId = recipe.foodId

      const input = {
        clientMutationId: mutationId,
        id: recipe.id,
        foodId,
        name: recipe.name,
        ingredients: JSON.stringify(content),
        servingsNum: recipe.servingsNum,
        totalTime: recipe.totalTime,
        prepareTime: recipe.prepareTime,
        notes: recipe.notes,
        meta: recipe.meta
      }

      const macros = mealNutritionFacts({ items: recipe.ingredients })
      const weight = recipe.ingredients.reduce(
        (acc, item) => acc + item.serving.volume * item.serving.num,
        0
      )
      const refMacros = getRefNutritionFacts({ num: 1, volume: weight }, macros)

      return mutate({
        variables: {
          input,
          clientMutationId: mutationId,
          __offline__: true
        },
        optimisticResponse: {
          saveMyRecipe: {
            clientMutationId: mutationId,
            __typename: "SaveMyRecipePayload",
            memberEvaluatedRecipe: {
              __typename: "MemberEvaluatedRecipe",
              id: recipe.id,
              food: {
                __typename: "Food",
                id: foodId,
                title: recipe.name,
                brand: null,
                ...refMacros,
                servings: [
                  {
                    num: 1,
                    name: "1 serving",
                    volume: round(weight / recipe.servingsNum),
                    unit: "g",
                    __typename: "FoodServing"
                  }
                ],
                defaultServingIndex: 0,
                provider: null,
                origin: null,
                externalId: null,
                isMyFood: true
              }
            }
          }
        },
        update: appendRecipe
      })
    }
  })
})
