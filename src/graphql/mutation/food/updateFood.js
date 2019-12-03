import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import foodFragments from "graphql/fragment/food/food"
import { genMutationId } from "keystone"

const UPDATE_FOOD = gql`
  mutation UpdateFood($input: UpdateFoodByIdInput!) {
    updateFoodById(input: $input) {
      clientMutationId
      food {
        ...FoodFull
      }
    }
  }
  ${foodFragments.fullFood}
`

export const updateFood = foodData => ({
  mutation: UPDATE_FOOD,
  variables: { input: foodData, __offline__: true },
  optimisticResponse: {
    updateFoodById: {
      __typename: "UpdateFoodPayload",
      food: {
        __typename: "Food",
        id: foodData.id,
        title: foodData.title,
        memberId: foodData.memberId
      }
    }
  }
})

export default graphql(UPDATE_FOOD, {
  props: ({ mutate }) => ({
    updateFood: input => {
      const mutationId = genMutationId()
      // eslint-disable-next-line no-unused-vars
      const { memberId, ...food } = input.foodPatch
      mutate({
        variables: {
          input: {
            ...input,
            clientMutationId: mutationId
          },
          clientMutationId: mutationId,
          __offline__: true
        },
        optimisticResponse: {
          updateFoodById: {
            clientMutationId: mutationId,
            __typename: "UpdateFoodPayload",
            food: {
              __typename: "Food",
              id: input.id,
              ...food,
              servings: food.servings.map(s => ({
                ...s,
                __typename: "FoodServing"
              })),
              provider: null,
              origin: null,
              externalId: null,
              isMyFood: true
            }
          }
        }
      })
    }
  })
})
