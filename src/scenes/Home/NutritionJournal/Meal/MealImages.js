import { ActivityIndicator, Alert, Dimensions } from "react-native"
import { Image, View } from "glamorous-native"
import { compose, withHandlers, withState, lifecycle } from "recompose"
import Carousel from "react-native-snap-carousel"
import React from "react"
import * as Sentry from "sentry-expo"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"
import * as FileSystem from "expo-file-system"
import * as ImageManipulator from "expo-image-manipulator"
import _ from "lodash/fp"

import { AttachmentIcon, CameraIcon, DeleteIcon, PlusIcon } from "kui/icons"
import { IconButton, PrimaryButton } from "kui/components/Button"
import { Row } from "kui/components"
import { TextButton } from "kui/components/Button"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withAddPhoto from "graphql/mutation/foodJournal/addPhoto"
import withDeletePhoto from "graphql/mutation/foodJournal/deletePhoto"
import { STORE_IMAGE_PATH } from "epics/fileSystemEpic/common"

const UPLOAD_IMAGE_SIZE = { width: 1280, height: 720 }

const windowWidth = Dimensions.get("window").width

const getCameraPermissions = () => {
  return Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
}
const askCameraPermissions = () => {
  return Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
}

const getLibraryPermissions = () => {
  return Permissions.getAsync(Permissions.CAMERA_ROLL)
}
const askLibraryPermissions = () => {
  return Permissions.askAsync(Permissions.CAMERA_ROLL)
}

const MealImages = ({
  meal,
  onCameraPress,
  onLibraryPress,
  onDeletePress,
  images,
  uploadAndTryAgain,
  date,
  addImage
}) => {
  return (
    <View>
      <Row centerY spread paddingHorizontal={20} paddingBottom={12}>
        <Text variant="body2">{meal.name} pictures</Text>
        {!!images && images.length < 3 && (
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
      {!!images && images.length > 0 && (
        <Carousel
          data={[
            ...images.map((i, index) => ({
              ...i,
              index,
              type: "image",
              onDeletePress,
              addImage,
              uploadAndTryAgain,
              date
            })),
            ...(images.length < 3 ? [{ type: "action", onPress: onCameraPress }] : [])
          ]}
          renderItem={renderItem}
          sliderWidth={windowWidth}
          itemWidth={272}
        />
      )}
    </View>
  )
}

const renderItem = ({ item }) => {
  if (item.type === "image") {
    return <PictureItem item={item} />
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

const enhancePictureItem = compose(
  withDeletePhoto,
  withState("isLoading", "setIsLoading", false),
  withState("loadingError", "setLoadingError", false),
  withState("uri", "setUri", ""),
  withState("_try", "setTry", 0),
  withHandlers({
    onDelete: ({ item, deleteMealPhoto }) => () => {
      const { id, date, onDeletePress } = item
      const cb = () =>
        deleteMealPhoto({ id, date }).catch(error =>
          logErrorWithMemberId(memberId => {
            Sentry.captureException(
              new Error(
                `MId:{${memberId}}, Scope:{NutritionJournal.Meal.MealImages.onDelete}, ${JSON.stringify(
                  error
                )}`
              )
            )
          })
        )
      onDeletePress(item)(cb)
    },
    updateUri: ({ item, setUri }) => () => {
      if (item.localPath) {
        FileSystem.getInfoAsync(FileSystem.documentDirectory + item.localPath).then(r =>
          setUri(r.exists ? r.uri : item.showUri)
        )
      } else {
        setUri(
          item.showUri.substring(0, 4) === "http"
            ? item.showUri
            : FileSystem.documentDirectory + item.showUri
        )
      }
    }
  }),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return !_.isEqual(nextProps, this.props)
    },
    componentDidMount() {
      this.props.updateUri()
    },
    componentDidUpdate(prevProps) {
      if (!_.isEqual(prevProps.item, this.props.item)) {
        this.props.updateUri()
      }
    }
  })
)

const PictureItem = enhancePictureItem(props => {
  const { uri, _try, setTry, item } = props
  const { isLoading, setIsLoading, loadingError, setLoadingError, onDelete } = props
  const {
    isUploading,
    uploadError,
    saveError,
    uploadAndTryAgain,
    uploadUrl,
    showUri,
    id,
    index,
    addImage
  } = item
  return (
    !!uri && (
      <View width={260} height={320} borderRadius={8} backgroundColor={colors.white10}>
        <Image
          source={{ uri }}
          width={260}
          height={320}
          borderRadius={8}
          position="absolute"
          onLoadEnd={() => setIsLoading(false)}
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => {
            setIsLoading(true)
            setLoadingError(false)
          }}
          onError={() => {
            setIsLoading(false)
            setLoadingError(true)
            _try < 5 && setTry(_try + 1)
          }}
        />
        {isLoading && (
          <View flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator />
          </View>
        )}
        {(isUploading || uploadError || saveError || loadingError) && (
          <View
            position="absolute"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <View padding={16} backgroundColor={colors.white70} centerY borderRadius={4}>
              {(uploadError || saveError) && (
                <View>
                  <Text variant="caption1" color={colors.bg1_90} paddingBottom={10}>
                    Something went wrong, please
                  </Text>
                  <PrimaryButton
                    onPress={() =>
                      uploadError
                        ? uploadAndTryAgain({
                            uploadUrl: uploadUrl,
                            pictureUrl: showUri,
                            imageId: id,
                            index
                          })
                        : addImage(index)(showUri)
                    }
                    label="TRY AGAIN"
                    minWidth={80}
                  />
                </View>
              )}
              {loadingError && (
                <Text variant="caption1" color={colors.bg1_90}>
                  {`Unable to load meal photo`}
                </Text>
              )}
              {isUploading && (
                <Row centerY>
                  <ActivityIndicator />
                  <Text paddingLeft={8} variant="caption1" color={colors.bg1_90}>
                    Uploading photo...
                  </Text>
                </Row>
              )}
            </View>
          </View>
        )}
        {!isUploading && (
          <IconButton
            position="absolute"
            right={16}
            top={16}
            borderRadius={4}
            backgroundColor={colors.white60}
            onPress={onDelete}
          >
            <DeleteIcon size={28} color={colors.black} />
          </IconButton>
        )}
      </View>
    )
  )
})

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
  withAddPhoto,
  withState("images", "setImages", ({ meal }) =>
    meal.images.map(i => ({ ...i, showUri: i.previewLink }))
  ),
  withHandlers({
    uploadImage: () => ({ uploadUrl, contentType = "image/jpeg" }, fileUri) =>
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
    addOrUpdateImageState: ({ images, setImages }) => (index, image) =>
      setImages(
        images.length <= index
          ? [...images, image]
          : images.map((i, idx) => ({ ...(idx === index ? image : i) }))
      ),
    deleteFromState: ({ images, setImages }) => image =>
      setImages(images.filter(i => i.id !== image.id && i.showUri !== image.showUri))
  }),
  withHandlers({
    uploadAndTryAgain: ({ uploadImage, addOrUpdateImageState }) => ({
      uploadUrl,
      pictureUrl,
      imageId,
      index
    }) => {
      addOrUpdateImageState(index, {
        id: imageId,
        showUri: pictureUrl,
        isUploading: true
      })
      uploadImage({ uploadUrl }, pictureUrl)
        .then(() =>
          addOrUpdateImageState(index, {
            id: imageId,
            showUri: pictureUrl,
            isUploading: false
          })
        )
        .catch(error => {
          addOrUpdateImageState(index, {
            id: imageId,
            showUri: pictureUrl,
            isUploading: false,
            uploadError: true,
            uploadUrl
          })

          logErrorWithMemberId(memberId => {
            Sentry.captureException(
              new Error(
                `MId:{${memberId}}, Scope:{NutritionJournal.Meal.MealImages.upload}, ${JSON.stringify(
                  error
                )}`
              )
            )
          })
        })
    }
  }),
  withHandlers({
    addImage: ({
      addMealPhoto,
      uploadAndTryAgain,
      addOrUpdateImageState,
      meal,
      date
    }) => index => uri => {
      addOrUpdateImageState(index, {
        showUri: uri,
        isUploading: true
      })

      addMealPhoto({
        date: date,
        orderIndex: meal.orderIndex,
        name: meal.name,
        localPath: uri
      })
        .then(res => {
          const uploadUrl = _.getOr(null, "data.addMealPhoto.uploadLink", res)
          const imageId = _.getOr("", "data.addMealPhoto.image.id", res)

          if (uploadUrl) {
            uploadAndTryAgain({ uploadUrl, pictureUrl: uri, imageId, index })
          }
        })
        .catch(error => {
          addOrUpdateImageState(index, {
            showUri: uri,
            isUploading: false,
            saveError: true
          })
          logErrorWithMemberId(memberId => {
            Sentry.captureException(
              new Error(
                `MId:{${memberId}}, Scope:{NutritionJournal.Meal.MealImages.addMealPhoto}, ${JSON.stringify(
                  error
                )}`
              )
            )
          })
        })
    }
  }),
  withHandlers({
    onCameraPress: ({ addImage, images }) => async () => {
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
              addImage(index)(fileName)
            })
            .catch(error =>
              logErrorWithMemberId(memberId => {
                Sentry.captureException(
                  new Error(
                    `MId:{${memberId}}, Scope:{NutritionJournal.Meal.MealImages.saveInStore}, ${JSON.stringify(
                      error
                    )}`
                  )
                )
              })
            )
        }
      }
    },
    onLibraryPress: ({ addImage, images }) => async () => {
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
              addImage(index)(fileName)
            })
            .catch(error =>
              logErrorWithMemberId(memberId => {
                Sentry.captureException(
                  new Error(
                    `MId:{${memberId}}, Scope:{NutritionJournal.Meal.MealImages.saveInStore}, ${JSON.stringify(
                      error
                    )}`
                  )
                )
              })
            )
        }
      }
    },

    onDeletePress: ({ deleteFromState }) => image => cb => {
      Alert.alert(
        "",
        `Do you want to delete this picture?`,
        [
          { text: "No", onPress: () => null },
          {
            text: "Yes",
            onPress: () => {
              image.localPath &&
                FileSystem.deleteAsync(FileSystem.documentDirectory + image.localPath, {
                  idempotent: true
                })
              deleteFromState(image)
              cb()
            }
          }
        ],
        { cancelable: true }
      )
    }
  })
)

export default enhance(MealImages)
