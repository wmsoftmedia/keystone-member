import { ActivityIndicator } from "react-native"
import { Image, TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import React from "react"
import * as Sentry from "sentry-expo"
import _ from "lodash/fp"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

import { BarcodeMilk, BarcodeFacts, CheckIcon, CloseIcon } from "kui/icons"
import { CameraIcon } from "kui/icons"
import { RetakeCameraIcon } from "scenes/Home/Icons"
import { PrimaryButton } from "kui/components/Button"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { getNavigationParam } from "keystone"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withSubmitBarcode from "graphql/mutation/food/submitBarcodeRequest"

const getPermissions = () => {
  return Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
}
const askPermissions = () => {
  return Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
}

const BarcodeNotFound = props => {
  const {
    barcode,
    onPressCamera,
    frontPhotoUri,
    nutritionFactsPhotoUri,
    updateFrontPhoto,
    updateNutritionFactsPhoto,
    onSubmit,
    frontPhoto,
    nutritionFactsPhoto,
    request,
    onTryAgain,
    onGoBack
  } = props

  const disabled = !frontPhotoUri || !nutritionFactsPhotoUri
  const isLoading = frontPhoto.loading || nutritionFactsPhoto.loading || request.loading
  const withError = frontPhoto.error || nutritionFactsPhoto.error || request.error
  const success =
    frontPhoto.success &&
    nutritionFactsPhoto.success &&
    !frontPhoto.error &&
    !nutritionFactsPhoto.error &&
    !request.loading &&
    !request.error

  return (
    <Screen>
      <View flex={1} paddingHorizontal={20} paddingBottom={20} paddingTop={10}>
        <Row spread centerY paddingBottom={30}>
          <Text variant="body1" lineHeight={20} opacity={0.6}>
            Scanned Barcode:
          </Text>
          <Text variant="body2" paddingTop={2}>
            {barcode}
          </Text>
        </Row>

        <Row spread>
          <ProductPicture
            onPressCamera={onPressCamera}
            setPhoto={updateFrontPhoto}
            imgUri={frontPhotoUri}
            Icon={BarcodeMilk}
            label="Product name"
            success={frontPhoto.success && !frontPhoto.error && !frontPhoto.loading}
            error={frontPhoto.error}
            disabled={success}
          />
          <View width={20}></View>
          <ProductPicture
            onPressCamera={onPressCamera}
            setPhoto={updateNutritionFactsPhoto}
            imgUri={nutritionFactsPhotoUri}
            Icon={BarcodeFacts}
            label="Nutrition facts"
            success={
              nutritionFactsPhoto.success &&
              !nutritionFactsPhoto.error &&
              !nutritionFactsPhoto.loading
            }
            error={nutritionFactsPhoto.error}
            disabled={success}
          />
        </Row>

        <View flex={1} justifyContent="flex-end" paddingBottom={20}>
          <View flex={1} justifyContent="center">
            {success && (
              <Text variant="body1" textAlign="center" paddingBottom={16}>
                Submission successful. Thank you!
              </Text>
            )}
          </View>
          <View>
            {withError && (
              <Text variant="caption1" textAlign="center" paddingBottom={16}>
                Something went wrong.
              </Text>
            )}
            <PrimaryButton
              label={withError ? "TRY AGAIN" : success ? "GO BACK TO SEARCH" : "SUBMIT"}
              onPress={withError ? onTryAgain : success ? onGoBack : onSubmit}
              disabled={disabled}
            />
          </View>
        </View>

        <Text variant="caption2" color={colors.white50} textAlign="center">
          All user-submitted photos must agree to the Terms of Use
        </Text>
      </View>
      {isLoading && (
        <View
          backgroundColor={colors.bg1_90}
          position="absolute"
          width="100%"
          height="100%"
        >
          <View flex={1} justifyContent="center">
            <ActivityIndicator size="large" />
            <Text variant="caption2" textAlign="center" paddingTop={8}>
              Uploading photos...
            </Text>
          </View>
        </View>
      )}
    </Screen>
  )
}

const ProductPicture = props => {
  const { onPressCamera, setPhoto, imgUri, Icon, label, success, error, disabled } = props
  return (
    <TouchableOpacity
      onPress={() => (disabled ? null : onPressCamera(setPhoto))}
      flex={1}
      height={228}
      alignItems="center"
      justifyContent="center"
      backgroundColor={disabled ? colors.darkBlue90_20 : colors.darkBlue90}
      borderRadius={8}
      paddingHorizontal={12}
      paddingVertical={20}
      activeOpacity={disabled ? 1 : 0.2}
    >
      <Text variant="body2">{label}</Text>

      <View flex={1} justifyContent="center">
        {imgUri ? (
          <Image source={{ uri: imgUri }} width={100} height={100} borderRadius={8} />
        ) : (
          <Icon color={colors.white10} size={80} />
        )}
      </View>

      {success ? (
        <CheckIcon color={colors.green50} />
      ) : error ? (
        <CloseIcon color={colors.red50} />
      ) : (
        <Row centerXY>
          {imgUri ? (
            <RetakeCameraIcon color={colors.white} size={40} />
          ) : (
            <CameraIcon color={colors.white} size={40} />
          )}
          <Text variant="button1">TAKE PHOTO</Text>
        </Row>
      )}
    </TouchableOpacity>
  )
}

const enhanced = compose(
  withSubmitBarcode,
  withState("frontPhoto", "setFrontPhoto", {}),
  withState("nutritionFactsPhoto", "setNutritionFactsPhoto", {}),
  withState("request", "setRequest", {}),
  withProps(props => ({
    barcode: getNavigationParam(props.navigation, "barcode"),
    frontPhotoUri:
      props.frontPhoto && !props.frontPhoto.cancelled ? props.frontPhoto.uri : null,
    nutritionFactsPhotoUri:
      props.nutritionFactsPhoto && !props.nutritionFactsPhoto.cancelled
        ? props.nutritionFactsPhoto.uri
        : null
  })),

  withHandlers({
    updateFrontPhoto: ({ frontPhoto, setFrontPhoto }) => values => {
      setFrontPhoto({ ...frontPhoto, ...values })
    },
    updateNutritionFactsPhoto: ({
      nutritionFactsPhoto,
      setNutritionFactsPhoto
    }) => values => {
      setNutritionFactsPhoto({ ...nutritionFactsPhoto, ...values })
    },
    updateRequest: ({ request, setRequest }) => values => {
      setRequest({ ...request, ...values })
    },

    onPressCamera: () => async setResult => {
      const grant = await getPermissions()
      let status = grant.status
      if (status !== "granted") {
        const newGrant = await askPermissions()
        status = newGrant.status
      }
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: false
        })
        if (!result.cancelled) {
          setResult({
            uri: result.uri,
            cancelled: result.cancelled,
            success: false,
            error: false
          })
        }
      }
    },
    onGoBack: ({ navigation }) => () => navigation.goBack(),
    uploadImage: () => (resourceData, fileUri) =>
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

        xhr.open("PUT", resourceData.uploadUrl)
        xhr.setRequestHeader("Content-Type", resourceData.contentType)
        xhr.send({ uri: fileUri })
      }),

    sendErrorLogs: () => (error, scope) =>
      logErrorWithMemberId(memberId => {
        Sentry.captureException(
          new Error(`MId:{${memberId}}, Scope:{${scope}}, ${JSON.stringify(error)}`)
        )
      })
  }),
  withHandlers({
    uploadAndTryAgain: ({
      uploadImage,
      sendErrorLogs,
      updateFrontPhoto,
      updateNutritionFactsPhoto
    }) => (uploadUrl, photoUrl, photo) => {
      const update = photo === "front" ? updateFrontPhoto : updateNutritionFactsPhoto
      update({ uploadUrl, loading: true, error: false })

      if (uploadUrl && photoUrl) {
        uploadImage(
          {
            contentType: "image/jpeg",
            uploadUrl: uploadUrl
          },
          photoUrl
        )
          .then(() => update({ loading: false, error: false, success: true }))
          .catch(e => {
            update({ loading: false, error: true })
            sendErrorLogs(e, "Nutrition.components.BarcodeNotFound.uploadAndTryAgain")
          })
      }
    }
  }),
  withHandlers({
    onSubmit: props => () => {
      const {
        barcode,
        sendErrorLogs,
        frontPhoto,
        nutritionFactsPhoto,
        submitBarcodeRequest,
        uploadAndTryAgain,
        updateRequest
      } = props

      updateRequest({ loading: true, error: false })

      submitBarcodeRequest(barcode)
        .then(res => {
          const frontUrl = _.getOr({}, "data.submitBarcodeRequest.frontUrl", res)
          const factsUrl = _.getOr({}, "data.submitBarcodeRequest.factsUrl", res)

          uploadAndTryAgain(frontUrl, frontPhoto.uri, "front")
          uploadAndTryAgain(factsUrl, nutritionFactsPhoto.uri, "facts")

          updateRequest({ loading: false, error: false })
        })
        .catch(e => {
          updateRequest({ loading: false, error: true })
          sendErrorLogs(e, "Nutrition.components.BarcodeNotFound.submitBarcodeRequest")
        })
    }
  }),
  withHandlers({
    onTryAgain: ({
      request,
      onSubmit,
      frontPhoto,
      nutritionFactsPhoto,
      uploadAndTryAgain
    }) => () => {
      if (request.error) {
        onSubmit()
      } else {
        if (frontPhoto.error || !frontPhoto.success)
          uploadAndTryAgain(frontPhoto.uploadUrl, frontPhoto.uri, "front")

        if (nutritionFactsPhoto.error || !nutritionFactsPhoto.success)
          uploadAndTryAgain(
            nutritionFactsPhoto.uploadUrl,
            nutritionFactsPhoto.uri,
            "facts"
          )
      }
    }
  })
)

export default enhanced(BarcodeNotFound)
