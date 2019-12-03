import { ActivityIndicator } from "react-native"
import { Image, View } from "glamorous-native"
import { compose, lifecycle, setPropTypes, withState } from "recompose"
import PropTypes from "prop-types"
import React, { useEffect } from "react"
import * as FileSystem from "expo-file-system"
import _ from "lodash/fp"

import Text from "kui/components/Text"
import colors from "kui/colors"

const ImageWidget = ({
  isLoading,
  setIsLoading,
  loadingError,
  setLoadingError,
  uri,
  setUri,
  _try,
  setTry,
  backgroundColor = colors.white10,
  errorText = "Unable to load this photo",
  defaultPath,
  fallbackUrl,
  useLocal,
  containerProps = {},
  imageProps = {},
  ...rest
}) => {
  useEffect(() => {
    let isMounted = true
    if (useLocal) {
      FileSystem.getInfoAsync(FileSystem.documentDirectory + defaultPath).then(r => {
        isMounted && setUri(r.exists || !fallbackUrl ? r.uri : fallbackUrl)
      })
    } else {
      setUri(defaultPath)
    }
    return () => (isMounted = false)
  }, defaultPath)

  return (
    !!uri && (
      <View backgroundColor={backgroundColor} {...rest} {...containerProps}>
        <Image
          source={{ uri }}
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
          {...rest}
          {...imageProps}
        />
        {loadingError && !!errorText && (
          <View
            position="absolute"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Text variant="caption1">{errorText}</Text>
          </View>
        )}

        {isLoading && (
          <View flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator />
          </View>
        )}
      </View>
    )
  )
}

const enhance = compose(
  setPropTypes({
    defaultPath: PropTypes.string.isRequired,
    useLocal: PropTypes.bool.isRequired,
    fallbackUrl: PropTypes.string,
    errorText: PropTypes.string,
    backgroundColor: PropTypes.string,
    containerProps: PropTypes.object,
    imageProps: PropTypes.object
  }),
  withState("isLoading", "setIsLoading", false),
  withState("loadingError", "setLoadingError", false),
  withState("uri", "setUri", false),
  withState("_try", "setTry", 0),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return !_.isEqual(nextProps, this.props)
    }
  })
)

export default enhance(ImageWidget)
