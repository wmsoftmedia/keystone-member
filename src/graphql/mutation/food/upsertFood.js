import gql from "graphql-tag"

import { genUuid } from "keystone"
import foodFragments from "graphql/fragment/food/food"

const UPSERT_FOOD = id => gql`
  mutation UpsertFood${id}($id: Uuid!, $food: Json!) {
    upsertFood(input: { id: $id, food: $food }) {
      clientMutationId
      food {
        ...FoodFull
      }
    }
  }
  ${foodFragments.fullFood}
`

export const upsertFood = food => {
  const id = genUuid()
  const convertedFood = {
    ...food,
    nutritionFacts: food.macros
  }
  return {
    mutation: UPSERT_FOOD(+Date.now()),
    variables: { id, food: JSON.stringify(convertedFood) }
  }
}
