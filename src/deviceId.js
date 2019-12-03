import { AsyncStorage } from "react-native"
import { Notifications } from "expo"
import gql from "graphql-tag"
import moment from "moment-timezone"

import { isAndroid, isIOS } from "native"
import * as Permissions from "expo-permissions"

import { PERMISSION_NOTIFICATION } from "./auth"
import { version } from "../package.json"

export const UPSERT_DEVICE_META = gql`
  mutation UpsertDeviceMeta(
    $deviceId: String!
    $loggedIn: Boolean!
    $platform: String!
    $version: String!
    $timezone: String!
    $permissions: Json!
  ) {
    upsertDeviceMeta(
      input: {
        deviceId: $deviceId
        loggedIn: $loggedIn
        platform: $platform
        version: $version
        timezone: $timezone
        permissions: $permissions
      }
    ) {
      upsertDeviceMetaResult
    }
  }
`

const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  let finalStatus = existingStatus

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    try {
      const alreadyAsked = await AsyncStorage.getItem(PERMISSION_NOTIFICATION)
      if (isAndroid || !alreadyAsked) {
        await AsyncStorage.setItem(PERMISSION_NOTIFICATION, "granted")
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        finalStatus = status
      }
    } catch (e) {
      finalStatus = existingStatus
    }
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return
  }

  // Get the token that uniquely identifies this device
  return await Notifications.getExpoPushTokenAsync()
}

const permissions = [
  Permissions.CAMERA,
  Permissions.AUDIO_RECORDING,
  Permissions.LOCATION,
  Permissions.REMOTE_NOTIFICATIONS,
  Permissions.NOTIFICATIONS,
  Permissions.CONTACTS,
  Permissions.SYSTEM_BRIGHTNESS,
  Permissions.CAMERA_ROLL
]

const getPermissions = () => {
  return Promise.all(
    permissions.map(p =>
      Permissions.getAsync(p).then(grant => {
        return { [p]: grant }
      })
    )
  ).then(permissionGrants => {
    return permissionGrants.reduce((a, c) => {
      return { ...a, ...c }
    }, {})
  })
}

export const platform = isIOS ? "ios" : "android"
export const timezone = moment.tz.guess() || "unknown"
export const currentVersion = version

export const sendDeviceId = async (client, loggedIn) => {
  try {
    const deviceId = await registerForPushNotificationsAsync()
    // TODO: look into why .getAsync() blows up on android when we
    // read permission grants
    //const permissions = await getPermissions().catch(() => {})
    if (deviceId && permissions) {
      const pushNotificationPermissions = {
        remoteNotifications: {
          status: "granted"
        }
      }

      return client.mutate({
        mutation: UPSERT_DEVICE_META,
        variables: {
          deviceId,
          loggedIn,
          platform,
          timezone,
          version: currentVersion,
          permissions: JSON.stringify(pushNotificationPermissions)
        }
      })
    }
  } catch (e) {
    console.log("Failed sending deviceId.")
    console.warn(e)
  }
}
