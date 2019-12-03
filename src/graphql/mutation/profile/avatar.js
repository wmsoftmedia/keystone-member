import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { compose } from "recompose"
import { MEMBER_AVATAR } from "graphql/query/member/avatar"

const UPDATE_AVATAR = gql`
  mutation UpsertProfilePicture($fullSizePicture: Upload!, $thumbnailPicture: Upload!) {
    upsertProfilePicture(
      fullSizePicture: $fullSizePicture
      thumbnailPicture: $thumbnailPicture
    ) {
      profilePictureDirectory
    }
  }
`

const upsertProfilePicture = graphql(UPDATE_AVATAR, {
  props: ({ mutate }) => ({
    upsertProfilePicture: (fullSizePicture, thumbnailPicture) => {
      return mutate({
        variables: { fullSizePicture, thumbnailPicture },
        refetchQueries: [
          {
            query: MEMBER_AVATAR,
            variables: { __offline__: true }
          }
        ]
      })
    }
  })
})

const DELETE_AVATAR = gql`
  mutation DeleteProfilePicture {
    deleteProfilePicture
  }
`

const deleteProfilePicture = graphql(DELETE_AVATAR, {
  props: ({ mutate }) => {
    return {
      deleteProfilePicture: () => {
        return mutate({
          refetchQueries: [
            {
              query: MEMBER_AVATAR,
              variables: { __offline__: true }
            }
          ]
        })
      }
    }
  }
})

export default compose(
  upsertProfilePicture,
  deleteProfilePicture
)
