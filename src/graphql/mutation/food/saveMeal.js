// packages
import _ from "lodash/fp"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
// queries
import mealFragments from "graphql/fragment/food/meal"
import { ALL_MY_MEALS_MIN_QUERY, ALL_MY_MEALS_QUERY } from "graphql/query/food/allMyMeals"
// project components
import { readQuerySafe, genMutationId, genUuid, getOr } from "keystone"
import { SOURCE_DB_FOOD, SOURCE_CACHE_DB_FOOD, mealNutritionFacts } from "keystone/food"

const SAVE_MEAL = gql`
  mutation SaveMyMeal($input: SaveMyMealV2Input!) {
    saveMyMealV2(input: $input) {
      memberMeal {
        ...MealFull
      }
    }
  }
  ${mealFragments.fullMeal}
`

const appendMeal = (store, resp) => {
  ;[ALL_MY_MEALS_MIN_QUERY, ALL_MY_MEALS_QUERY].forEach(query => {
    const cachedQuery = { query }
    const { error, data } = readQuerySafe(store, cachedQuery)
    if (error) return

    const newMeal = resp.data.saveMyMealV2.memberMeal
    const curMeals = getOr([], "currentMember.allMyMeals.nodes", data)

    data.currentMember.allMyMeals.nodes = curMeals.find(m => m.id === newMeal.id)
      ? curMeals
      : [newMeal, ...curMeals]
    store.writeQuery({ query, data })
  })
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

export default graphql(SAVE_MEAL, {
  props: ({ mutate }) => ({
    saveMeal: ({ id, name, items }) => {
      const mutationId = genMutationId()

      const content = items.map((item, i) => ({
        id: genUuid(),
        orderIndex: i,
        serving: item.serving,
        food: prepareFood(item.food)
      }))

      const input = {
        id,
        name,
        items: JSON.stringify(content),
        clientMutationId: mutationId
      }

      return mutate({
        variables: {
          input,
          clientMutationId: mutationId,
          __offline__: true
        },
        optimisticResponse: {
          saveMyMealV2: {
            clientMutationId: mutationId,
            __typename: "SaveMyMealPayload",
            memberMeal: {
              __typename: "MemberMeal",
              id,
              title: input.name,
              nutritionFacts: {
                __typename: "NutritionFact",
                ...mealNutritionFacts({ items })
              },
              items: {
                __typename: "MealItemsConnection",
                nodes: items.map((item, i) => {
                  return {
                    __typename: "MealItem",
                    id: item.id,
                    orderIndex: i,
                    food: {
                      __typename: "Food",
                      id: item.food.id,
                      title: item.food.name,
                      externalId: item.food.externalId,
                      brand: item.food.brand,
                      provider: item.food.provider,
                      origin: item.food.origin,
                      isMyFood: item.food.isMyFood,
                      defaultServingIndex: item.food.defaultServingIndex,
                      ...item.food.macros,
                      servings: item.food.servings.map(s => ({
                        ...s,
                        __typename: "FoodServing"
                      }))
                    },
                    serving: {
                      __typename: "FoodServing",
                      ...item.serving
                    }
                  }
                })
              }
            }
          }
        },
        update: appendMeal
      })
    }
  })
})
