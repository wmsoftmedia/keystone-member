import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { BODY_TIMELINE } from "graphql/query/body/timeline"
import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { PROGRESS_PICTURE_BY_DATE } from "graphql/query/progressPicture/byDate"

const ADD_PROGRESS_PICTURE = gql`
  mutation AddProgressPicture($input: AddProgressPictureInput!) {
    addProgressPicture(input: $input) {
      clientMutationId
      uploadLink
      picture {
        id
        localPath
        userId
        isPrivate
        comment
        originalUrl
        previewUrl
      }
    }
  }
`

export default graphql(ADD_PROGRESS_PICTURE, {
  props: ({ mutate }) => {
    return {
      addProgressPicture: ({ date, comment, localPath, isPrivate = true }) => {
        return mutate({
          variables: {
            input: {
              date: moment(date).format(DATE_FORMAT_GRAPHQL),
              comment,
              localPath,
              isPrivate
            },
            __offline__: true
          },
          refetchQueries: [
            {
              query: PROGRESS_PICTURE_BY_DATE,
              variables: {
                __offline__: true,
                date: moment(date).format(DATE_FORMAT_GRAPHQL)
              }
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
