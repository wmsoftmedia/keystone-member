import { graphql } from "react-apollo"
import gql from "graphql-tag"

import { FOOD_JOURNAL_DAY } from "graphql/query/foodJournal/day"
import { genMutationId } from "keystone"

const SAVE_JOURNAL_MEAL = gql`
  mutation SaveJournalMeal($input: SaveJournalMealInput!) {
    saveJournalMeal(input: $input) {
      clientMutationId
      meal {
        id
        name
        orderIndex
        food {
          nodes {
            portions
            food {
              id
              name
              sources
              pic
            }
          }
        }
      }
    }
  }
`

export default graphql(SAVE_JOURNAL_MEAL, {
  props: ({ mutate }) => {
    return {
      saveJournalMeal: ({ date, meal }) => {
        const mutationId = genMutationId()

        return mutate({
          variables: {
            input: {
              clientMutationId: mutationId,
              meal: {
                date,
                orderIndex: meal.orderIndex,
                name: meal.name,
                food: meal.food
                  ? meal.food.map(f => ({ id: f.id, portions: +f.portions }))
                  : []
              }
            },
            __offline__: true
          },
          refetchQueries: [
            {
              query: FOOD_JOURNAL_DAY,
              variables: { __offline__: true, date }
            }
          ],
          optimisticResponse: {
            saveJournalMeal: {
              __typename: "SaveJournalMealPayload",
              clientMutationId: mutationId,
              meal: {
                __typename: "FoodJournalMeal!",
                id: meal.id ? meal.id : "",
                name: meal.name,
                orderIndex: meal.orderIndex,
                food: {
                  __typename: "FoodJournalMealFoodConnection",
                  nodes: meal.food.map(f => ({
                    __typename: "FoodJournalMealFood",
                    portions: f.portions,
                    food: {
                      __typename: "FoodJournalFood",
                      id: f.id,
                      name: f.name,
                      pic: f.pic,
                      sources: f.sources
                    }
                  }))
                }
              }
            }
          }
        })
      }
    }
  }
})
