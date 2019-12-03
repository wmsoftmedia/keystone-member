import { ActivityIndicator, Alert } from "react-native"
import { View } from "glamorous-native"
import { compose, withHandlers } from "recompose"
import React from "react"
import  * as Sentry from "sentry-expo"
import * as FileSystem from "expo-file-system"

import { DeleteIcon } from "kui/icons"
import { IconButton, PrimaryButton } from "kui/components/Button"
import { Row } from "kui/components"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withDelete from "graphql/mutation/progressPicture/delete"

import ImageWidget from "scenes/Home/Body/ImageWidget"

const ImageItem = props => {
  const { item, onDeletePress } = props
  const {
    isUploading,
    uploadError,
    saveError,
    uploadImage,
    uploadUrl,
    id,
    index,
    onSave,
    originalUrl,
    localPath
  } = item

  return (
    <View width={260} height={320} borderRadius={8} backgroundColor={colors.white10}>
      <ImageWidget
        defaultPath={localPath}
        useLocal={true}
        fallbackUrl={originalUrl}
        width={260}
        height={320}
        borderRadius={8}
        backgroundColor={colors.white10}
      />
      {(isUploading || uploadError || saveError) && (
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
                      ? uploadImage({
                          uploadUrl: uploadUrl,
                          pictureUrl: localPath,
                          imageId: id,
                          index
                        })
                      : onSave(index)(localPath)
                  }
                  label="TRY AGAIN"
                  minWidth={80}
                />
              </View>
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
        <View width="100%" position="absolute" alignItems="flex-end" padding={16}>
          <IconButton
            borderRadius={4}
            backgroundColor={colors.white70}
            onPress={onDeletePress}
          >
            <DeleteIcon size={28} color={colors.black} />
          </IconButton>
        </View>
      )}
    </View>
  )
}

const enhance = compose(
  withDelete,
  withHandlers({
    onDeletePress: ({ item, deleteProgressPicture }) => () => {
      const { deleteFromState, localPath, id, date } = item
      Alert.alert(
        "",
        `Do you want to delete this picture?`,
        [
          { text: "No", onPress: () => null },
          {
            text: "Yes",
            onPress: () => {
              localPath &&
                FileSystem.deleteAsync(FileSystem.documentDirectory + localPath, {
                  idempotent: true
                })
              deleteFromState({ id, localPath })
              deleteProgressPicture({ pictureId: id, date }).catch(error =>
                logErrorWithMemberId(memberId => {
                  Sentry.captureException(
                    new Error(
                      `MId:{${memberId}}, Scope:{Body.ImageCarousel.deleteProgressPicture}, ${JSON.stringify(
                        error
                      )}`
                    )
                  )
                })
              )
            }
          }
        ],
        { cancelable: true }
      )
    }
  })
)

export default enhance(ImageItem)
