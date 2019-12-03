import { Image, View } from "glamorous-native"
import { compose } from "recompose"
import React from "react"

import { ProfileIcon } from "kui/icons"
import { withErrorHandler, withLoader } from "hoc"
import colors from "kui/colors"
import withAvatar from "graphql/query/member/avatar"

const enhanceMiniAvatar = compose(
  withAvatar,
  withErrorHandler,
  withLoader()
)

export default enhanceMiniAvatar(props => {
  const { thumbnailUrl } = props
  return (
    <View height={40} width={40} paddingTop={4}>
      {thumbnailUrl ? (
        <Image
          source={{ uri: thumbnailUrl }}
          width={32}
          height={32}
          borderRadius={16}
          backgroundColor={colors.white10}
        />
      ) : (
        <View paddingTop={2}>
          <ProfileIcon size={40} />
        </View>
      )}
    </View>
  )
})
