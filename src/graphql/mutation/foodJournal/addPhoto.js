import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { FOOD_JOURNAL_DAY } from "graphql/query/foodJournal/day"

const ADD_MEAL_PHOTO = gql`
  mutation AddMealPhoto($input: AddMealPhotoInput!) {
    addMealPhoto(input: $input) {
      clientMutationId
      uploadLink
      image {
        id
        previewLink
        originalLink
        localPath
      }
    }
  }
`

export default graphql(ADD_MEAL_PHOTO, {
  props: ({ mutate }) => {
    return {
      addMealPhoto: ({ date, orderIndex, name, localPath }) => {
        return mutate({
          variables: { input: { date, orderIndex, name, localPath }, __offline__: true },
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
