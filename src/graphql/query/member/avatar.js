import { graphql } from "react-apollo"
import gql from "graphql-tag"

const PICTURE_SRC = "https://keystone-profile-picture.s3-ap-southeast-2.amazonaws.com"

export const MEMBER_AVATAR = gql`
  query MemberAvatar {
    member: currentMember {
      id
      firstName
      lastName
      profilePicDir
    }
  }
`

export default graphql(MEMBER_AVATAR, {
  options: {
    fetchPolicy: "network-only",
    variables: { __offline__: true },
    notifyOnNetworkStatusChange: true
  },
  props: ({ data }) => {
    const { member } = data

    if (!member) return {}

    return {
      initials:
        (member.firstName ? member.firstName[0] : "") +
        (member.lastName ? member.lastName[0] : ""),
      thumbnailUrl: member.profilePicDir
        ? `${PICTURE_SRC}/${member.profilePicDir}/thumbnail.jpg`
        : null,
      fullUrl: member.profilePicDir
        ? `${PICTURE_SRC}/${member.profilePicDir}/full.jpg`
        : null
    }
  }
})
