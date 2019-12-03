import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { FOOD_JOURNAL_DAY } from "graphql/query/foodJournal/day"

const DELETE_MEAL_PHOTO = gql`
  mutation DeleteMealPhoto($input: DeleteMealPhotoInput!) {
    deleteMealPhoto(input: $input) {
      clientMutationId
    }
  }
`

export default graphql(DELETE_MEAL_PHOTO, {
  props: ({ mutate }) => {
    return {
      deleteMealPhoto: ({ id, date }) => {
        return mutate({
          variables: { input: { imageId: id }, __offline__: true },
          refetchQueries: [
            {
              query: FOOD_JOURNAL_DAY,
              variables: { __offline__: true, date }
            }
          ]
        })
      }
    }
  }
})
