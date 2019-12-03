import { Dimensions, Switch } from "react-native"
import { TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import Carousel from "react-native-snap-carousel"
import React from "react"
import * as Sentry from "sentry-expo"
import * as FileSystem from "expo-file-system"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"
import _ from "lodash/fp"

import { AttachmentIcon, CameraIcon, PlusIcon } from "kui/icons"
import { IconButton } from "kui/components/Button"
import { Row } from "kui/components"
import { STORE_IMAGE_PATH } from "epics/fileSystemEpic/common"
import { TextButton } from "kui/components/Button"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import ImageItem from "scenes/Home/Body/ProgressPictureWidget/ImageItem"
import Text from "kui/components/Text"
import addProgressPicture from "graphql/mutation/progressPicture/add"
import colors from "kui/colors"
import withUpdate from "graphql/mutation/progressPicture/update"

const UPLOAD_IMAGE_SIZE = { width: 1280, height: 720 }
const windowWidth = Dimensions.get("window").width

const getCameraPermissions = () =>
  Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
const askCameraPermissions = () =>
  Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
const getLibraryPermissions = () => Permissions.getAsync(Permissions.CAMERA_ROLL)
const askLibraryPermissions = () => Permissions.askAsync(Permissions.CAMERA_ROLL)

const ImageCarousel = ({
  title,
  onCameraPress,
  onLibraryPress,
  deleteFromState,
  onSave,
  uploadImage,
  images,
  isPrivate,
  onSharePress,
  date,
  firstItem = 0
}) => {
  return (
    <View>
      <Row centerY spread paddingHorizontal={20}>
        <Text variant="body2" paddingVertical={16}>
          {title}
        </Text>
        {!!images && images.length < 5 && (
          <Row centerY>
            <IconButton onPress={onLibraryPress}>
              <AttachmentIcon />
            </IconButton>
            <IconButton onPress={onCameraPress}>
              <CameraIcon />
            </IconButton>
          </Row>
        )}
      </Row>

      {/* TODO: hide until we have progress pictures on the new portal */}
      {images.length > 0 && false && (
        <Row centerY paddingHorizontal={20} paddingBottom={20}>
          <Switch
            value={!isPrivate}
            onChange={onSharePress}
            trackColor={{ true: colors.darkBlue40, false: colors.darkBlue90 }}
            thumbColor={[!isPrivate ? colors.white : colors.darkBlue70]}
            ios_backgroundColor={colors.transparent}
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                borderColor: !isPrivate ? colors.darkBlue40 : colors.darkBlue70,
                borderWidth: 1
              }
            ]}
          />
          <TouchableOpacity onPress={onSharePress} paddingLeft={12} flex={1}>
            <Text variant="body1">Allow your coach to see these photos</Text>
          </TouchableOpacity>
        </Row>
      )}

      <Text variant="caption1" paddingHorizontal={20} paddingBottom={12}>
        Only you can see these photos
      </Text>

      {!!images && (
        <Carousel
          data={[
            ...images.map((i, index) => ({
              ...i,
              index,
              type: "image",
              onSave,
              uploadImage,
              deleteFromState,
              date
            })),
            ...(!!images && images.length < 5
              ? [{ type: "action", onPress: onCameraPress }]
              : [])
          ]}
          renderItem={renderItem}
          sliderWidth={windowWidth}
          itemWidth={272}
          firstItem={firstItem}
        />
      )}
    </View>
  )
}

const renderItem = ({ item }) => {
  if (item.type === "image") {
    return <ImageItem item={item} />
  } else {
    return (
      <TextButton
        width={260}
        height={320}
        borderRadius={12}
        backgroundColor={colors.darkBlue90}
        justifyContent="center"
        label="ADD PHOTO"
        onPress={item.onPress}
        Icon={() => (
          <View paddingRight={4}>
            <PlusIcon />
          </View>
        )}
      />
    )
  }
}

const saveInStore = async (result, fileName) => {
  const dirInfo = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + STORE_IMAGE_PATH
  )
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + STORE_IMAGE_PATH)
  }

  const resize =
    result.width > result.height
      ? { width: UPLOAD_IMAGE_SIZE.width }
      : { height: UPLOAD_IMAGE_SIZE.width }

  const full = await ImageManipulator.manipulateAsync(result.uri, [{ resize }], {
    compress: 0.8
  })
  FileSystem.deleteAsync(result.uri, { idempotent: true })

  FileSystem.moveAsync({ from: full.uri, to: FileSystem.documentDirectory + fileName })

  return FileSystem.documentDirectory + fileName
}

const enhance = compose(
  withUpdate,
  addProgressPicture,
  withState("images", "setImages", ({ images }) => images),
  withProps(({ images }) => ({
    isPrivate: images.reduce((acc, image) => !!acc && !!image.isPrivate, true)
  })),
  withHandlers({
    uploadFile: () => ({ uploadUrl, contentType = "image/jpeg" }, fileUri) =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onload = () => {
          if (xhr.status < 400) {
            resolve(true)
          } else {
            const error = new Error(xhr.response)
            reject(error)
          }
        }
        xhr.onerror = error => {
          reject(error)
        }
        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", contentType)
        xhr.send({ uri: FileSystem.documentDirectory + fileUri })
      }),
    addOrUpdateImageState: ({ images, setImages, isPrivate }) => (index, image) =>
      setImages(
        images.length <= index
          ? [...images, { ...image, isPrivate }]
          : images.map((i, idx) => (idx !== index ? i : { ...i, ...image }))
      ),
    deleteFromState: ({ images, setImages }) => image =>
      setImages(images.filter(i => i.id !== image.id && i.localPath !== image.localPath))
  }),
  withHandlers({
    uploadImage: ({ uploadFile, addOrUpdateImageState }) => ({
      uploadUrl,
      pictureUrl,
      imageId,
      index
    }) => {
      addOrUpdateImageState(index, {
        id: imageId,
        localPath: pictureUrl,
        isUploading: true,
        uploadError: false
      })
      uploadFile({ uploadUrl }, pictureUrl)
        .then(() =>
          addOrUpdateImageState(index, {
            id: imageId,
            localPath: pictureUrl,
            uploadError: false,
            isUploading: false
          })
        )
        .catch(error => {
          addOrUpdateImageState(index, {
            id: imageId,
            localPath: pictureUrl,
            isUploading: false,
            uploadError: true,
            uploadUrl
          })
          logErrorWithMemberId(memberId => {
            Sentry.captureException(
              new Error(
                `MId:{${memberId}}, Scope:{Body.ImageCarousel.upload}, ${JSON.stringify(
                  error
                )}`
              )
            )
          })
        })
    }
  }),
  withHandlers({
    onSave: ({
      addProgressPicture,
      uploadImage,
      addOrUpdateImageState,
      date,
      isPrivate
    }) => index => uri => {
      addOrUpdateImageState(index, {
        localPath: uri,
        isUploading: true,
        saveError: false
      })

      addProgressPicture({ date, localPath: uri, isPrivate })
        .then(res => {
          const uploadUrl = _.getOr(null, "data.addProgressPicture.uploadLink", res)
          const imageId = _.getOr("", "data.addProgressPicture.picture.id", res)

          if (uploadUrl) {
            uploadImage({ uploadUrl, pictureUrl: uri, imageId, index })
          }
        })
        .catch(error => {
          addOrUpdateImageState(index, {
            localPath: uri,
            isUploading: false,
            saveError: true
          })
          logErrorWithMemberId(memberId => {
            Sentry.captureException(
              new Error(
                `MId:{${memberId}}, Scope:{Body.ImageCarousel.addProgressPicture}, ${JSON.stringify(
                  error
                )}`
              )
            )
          })
        })
    }
  }),
  withHandlers({
    onCameraPress: ({ onSave, images }) => async () => {
      const grant = await getCameraPermissions()
      let status = grant.status
      if (status !== "granted") {
        const newGrant = await askCameraPermissions()
        status = newGrant.status
      }
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: false,
          allowsEditing: false,
          quality: 1
        })

        if (!result.cancelled) {
          const index = images.length
          const fileName = STORE_IMAGE_PATH + result.uri.split("/").pop()
          saveInStore(result, fileName)
            .then(() => {
              onSave(index)(fileName)
            })
            .catch(error =>
              logErrorWithMemberId(memberId => {
                Sentry.captureException(
                  new Error(
                    `MId:{${memberId}}, Scope:{Body.ImageCarousel.saveInStore}, ${JSON.stringify(
                      error
                    )}`
                  )
                )
              })
            )
        }
      }
    },
    onLibraryPress: ({ onSave, images }) => async () => {
      const grant = await getLibraryPermissions()
      let status = grant.status
      if (status !== "granted") {
        const newGrant = await askLibraryPermissions()
        status = newGrant.status
      }
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: false,
          allowsEditing: false,
          quality: 1
        })

        if (!result.cancelled) {
          const index = images.length
          const fileName = STORE_IMAGE_PATH + result.uri.split("/").pop()
          saveInStore(result, fileName)
            .then(() => {
              onSave(index)(fileName)
            })
            .catch(error =>
              logErrorWithMemberId(memberId => {
                Sentry.captureException(
                  new Error(
                    `MId:{${memberId}}, Scope:{Body.ImageCarousel.saveInStore}, ${JSON.stringify(
                      error
                    )}`
                  )
                )
              })
            )
        }
      }
    },
    onSharePress: ({
      isPrivate,
      updateProgressPicture,
      images,
      date,
      setImages
    }) => () => {
      Promise.all(
        images.map(image =>
          updateProgressPicture({
            date,
            pictureId: image.id,
            comment: image.comment,
            isPrivate: !isPrivate
          })
        )
      )
        .then(() => {})
        .catch(error =>
          logErrorWithMemberId(memberId => {
            Sentry.captureException(
              new Error(
                `MId:{${memberId}}, Scope:{Body.ImageCarousel.onSharePress}, ${JSON.stringify(
                  error
                )}`
              )
            )
          })
        )
      setImages(images.map(i => ({ ...i, isPrivate: !isPrivate })))
    }
  })
)

export default enhance(ImageCarousel)
