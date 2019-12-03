// packages
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import _ from "lodash/fp"
// queries
import dayFragments from "graphql/fragment/food/day"
import {
  ALL_MY_DAYS_MIN_QUERY,
  ALL_MY_DAYS_QUERY
} from "graphql/query/food/allMyDays"
// project components
import { readQuerySafe, genMutationId, genUuid, getOr } from "keystone"
import { SOURCE_DB_FOOD, SOURCE_CACHE_DB_FOOD, dayNutritionFacts } from "keystone/food"

const SAVE_DAY = gql`
  mutation SaveMyDay($input: SaveNutritionDayInput!) {
    saveNutritionDay(input: $input) {
      nutritionDay {
        ...DayMin
      }
    }
  }
  ${dayFragments.minDay}
`

const appendDay = (store, resp) => {
  [ALL_MY_DAYS_QUERY, ALL_MY_DAYS_MIN_QUERY].forEach(query => {
    const cachedQuery = { query }
    const { error, data } = readQuerySafe(store, cachedQuery)
    if (error) return

    const newDay = getOr({}, "data.saveNutritionDay.nutritionDay", resp)
    const curDays = getOr(
      [],
      "currentMember.nutritionDaysByMemberId.nodes",
      data
    )

    data.currentMember.nutritionDaysByMemberId.nodes = curDays.find(
      m => m.id === newDay.id
    )
      ? curDays
      : [newDay, ...curDays]
    store.writeQuery({ query, data })
  })
}

const prepareFood = _.memoize.convert({ fixed: false })(food => {
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
}, f => f.id)

export default graphql(SAVE_DAY, {
  props: ({ mutate }) => ({
    saveDay: ({ id, name, notes, meals }) => {
      const mutationId = genMutationId()

      const preparedMeals = meals.map((m, mi) => ({
        id: m.id,
        title: `${name} meal ${mi + 1}`,
        sortOrder: mi,
        items: m.items.map((item, ii) => ({
          id: genUuid(),
          orderIndex: ii,
          serving: item.serving,
          food: prepareFood(item.food)
        }))
      }))

      const input = {
        id,
        name,
        notes,
        meals: JSON.stringify(preparedMeals),
        clientMutationId: mutationId
      }

      return mutate({
        variables: {
          input,
          clientMtationId: mutationId,
          __offline__: true
        },
        optimisticResponse: {
          saveNutritionDay: {
            clientMutationId: mutationId,
            __typename: "SaveMyDayPayload",
            nutritionDay: {
              __typename: "NutritionDay",
              id,
              name,
              notes,
              nutritionFacts: {
                __typename: "NutritionFact",
                ...dayNutritionFacts({ meals })
              }
            }
          }
        },
        update: appendDay
      })
    }
  })
})
