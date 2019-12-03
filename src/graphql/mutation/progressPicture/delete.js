import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

import { BODY_TIMELINE } from "graphql/query/body/timeline"
import { PROGRESS_PICTURE_BY_DATE } from "graphql/query/progressPicture/byDate"

const DELETE_PROGRESS_PICTURE = gql`
  mutation DeleteProgressPicture($input: DeleteProgressPictureInput!) {
    deleteProgressPicture(input: $input) {
      clientMutationId
    }
  }
`

export default graphql(DELETE_PROGRESS_PICTURE, {
  props: ({ mutate }) => {
    return {
      deleteProgressPicture: ({ pictureId, date }) => {
        return mutate({
          variables: {
            input: { pictureId },
            __offline__: true
          },
          refetchQueries: [
            {
              query: PROGRESS_PICTURE_BY_DATE,
              variables: { __offline__: true, date }
            },
            {
              query: BODY_TIMELINE,
              variables: { __offline__: true, offset: 0, first: 5 }
            }
          ]
        })
      }
    }
  }
})
