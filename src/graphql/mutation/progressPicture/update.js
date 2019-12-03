import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { PROGRESS_PICTURE_BY_DATE } from "graphql/query/progressPicture/byDate"

const UPDATE_PROGRESS_PICTURE = gql`
  mutation UpdateProgressPicture($input: UpdateProgressPictureInput!) {
    updateProgressPicture(input: $input) {
      clientMutationId
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

export default graphql(UPDATE_PROGRESS_PICTURE, {
  props: ({ mutate }) => {
    return {
      updateProgressPicture: ({ date, pictureId, comment, isPrivate = true }) => {
        return mutate({
          variables: {
            input: { pictureId, comment, isPrivate },
            __offline__: true
          },
          refetchQueries: [
            {
              query: PROGRESS_PICTURE_BY_DATE,
              variables: {
                __offline__: true,
                date: moment(date).format(DATE_FORMAT_GRAPHQL)
              }
            }
          ]
        })
      }
    }
  }
})
