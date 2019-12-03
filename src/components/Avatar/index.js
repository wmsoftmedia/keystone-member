import { Alert } from "react-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import React from "react"
import * as Sentry from "sentry-expo"
import styled, { Image, Text, View, TouchableOpacity } from "glamorous-native"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

import { Row } from "kui/components"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import _ from "lodash/fp"
import colors from "kui/colors"
import fonts from "kui/fonts"
import withAvatarMutations from "graphql/mutation/profile/avatar"
import withAvatar from "graphql/query/member/avatar"

const AvatarContainer = styled(View)({
  backgroundColor: colors.white10,
  height: 104,
  width: 104,
  borderRadius: 104
})

const getPermissions = () => {
  return Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
}
const askPermissions = () => {
  return Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
}

const Avatar = props => {
  const { initials, onAvatarChange, avatarUrl } = props

  return (
    <View>
      <AvatarContainer>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} width={104} height={104} borderRadius={52} />
        ) : (
          <Row centerXY height="100%">
            <Text color={colors.white20} fontSize={32}>
              {initials}
            </Text>
          </Row>
        )}
      </AvatarContainer>
      <TouchableOpacity
        flexDirection="row"
        alignSelf="flex-start"
        onPress={() => onAvatarChange()}
        paddingTop={16}
      >
        <Text
          color={colors.darkBlue40}
          fontFamily={fonts.montserratSemiBold}
          fontSize={12}
          lineHeight={16}
          paddingBottom={12}
        >
          CHANGE PHOTO
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const enhance = compose(
  withAvatar,
  withLoader(),
  withAvatarMutations,
  withState("avatar", "setAvatar", null),
  withHandlers({
    saveAvatar: props => async picture => {
      const full = await ImageManipulator.manipulateAsync(
        picture.uri,
        [{ resize: { width: 500 } }],
        { base64: true }
      )
      const thumbnail = await ImageManipulator.manipulateAsync(
        picture.uri,
        [{ resize: { width: 100 } }],
        { base64: true }
      )

      props.upsertProfilePicture(full, thumbnail).catch(e => {
        console.error(e)
        logErrorWithMemberId(memberId => {
          Sentry.captureException(
            new Error(
              `MId:{${memberId}}, Scope:{Profile.Avatar.upsertProfilePicture}, ${_.toString(
                e
              )}`
            )
          )
        })
      })
    },
    onDelete: props => () => {
      props.setAvatar(null)
      props.deleteProfilePicture()
    }
  }),
  withHandlers({
    onPressCamera: props => async () => {
      const grant = await getPermissions()
      let status = grant.status
      if (status !== "granted") {
        const newGrant = await askPermissions()
        status = newGrant.status
      }
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          base64: true,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        })

        if (!result.cancelled) {
          props.setAvatar(result)
          props.saveAvatar(result)
        }
      }
    }
  }),
  withProps(props => ({
    avatarUrl: props.avatar && !props.avatar.cancelled ? props.avatar.uri : props.fullUrl
  })),
  withHandlers({
    onAvatarChange: props => () => {
      Alert.alert(
        "",
        `Do you want to change your avatar?`,
        [
          { text: "Delete", onPress: props.onDelete },
          { text: "Change", onPress: props.onPressCamera }
        ],
        { cancelable: true }
      )
    }
  })
)

export default enhance(Avatar)
