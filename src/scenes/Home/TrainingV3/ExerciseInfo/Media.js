import { compose, withState, withHandlers } from "recompose"
import { View } from "glamorous-native"
import React from "react"
import _ from "lodash/fp"
import { WebView } from "react-native-webview"
import { StyleSheet, Dimensions } from "react-native"
import { Linking, ActivityIndicator } from "react-native"
import Swiper from "react-native-swiper"

import { TextButton } from "kui/components/Button"
import Text from "kui/components/Text"
import { Row } from "kui/components"
import colors from "kui/colors"
import { ChevronRightIcon, ChevronLeftIcon } from "kui/icons"
import parsers from "scenes/Home/TrainingV3/ExerciseInfo/parsers"

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
    overflow: "hidden"
  },
  loader: {
    backgroundColor: colors.transparent,
    width: "100%",
    height: "100%"
  },
  buttonWrapperStyle: {
    backgroundColor: "transparent",
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center"
  }
})

const VideoView = ({ url, width, height, state, setState }) =>
  state !== "error" ? (
    <WebView
      style={{
        backgroundColor: colors.transparent,
        width,
        height
      }}
      onError={() => setState("error")}
      onLoad={() => setState("ok")}
      javaScriptEnabled={true}
      startInLoadingState={true}
      scrollEnabled={false}
      renderLoading={() => (
        <Row style={styles.loader} centerXY>
          <ActivityIndicator animating size="small" color={colors.white50} />
          <Text variant="body1" color={colors.white50} paddingLeft={8}>
            Loading...
          </Text>
        </Row>
      )}
      source={{ uri: url }}
    />
  ) : (
    <Row width={width} height={height} centerXY>
      <Text variant="body1" color={colors.white50}>
        Load error, please try again later.
      </Text>
    </Row>
  )

const Media = ({ items, states, setState, setStates, ...rest }) => {
  const { width } = Dimensions.get("window")
  const proportion = 360 / 640

  const mediaLinks = items.reduce(
    (acc, item) => {
      const videoInfo = parsers.reduce(
        (acc, parser) => {
          if (!acc.url) {
            const url = parser.buildUrl(parser.parseId(item))
            return url ? { url, state: states[url] !== "error" } : acc
          } else {
            return acc
          }
        },
        { url: null, state: null }
      )

      return videoInfo.url && videoInfo.url !== "error"
        ? { ...acc, embeded: [...acc.embeded, videoInfo.url] }
        : { ...acc, links: [...acc.links, videoInfo.url || item] }
    },
    { embeded: [], links: [] }
  )

  return (
    <View {...rest}>
      {mediaLinks.embeded.length > 0 && (
        <Swiper
          style={{ height: (width - 40) * proportion }}
          index={0}
          loadMinimal={true}
          loadMinimalSize={2}
          loop={false}
          showsButtons={true}
          showsPagination={false}
          nextButton={
            <View marginRight={-6}>
              <ChevronRightIcon color={colors.white50} />
            </View>
          }
          prevButton={
            <View marginLeft={-6}>
              <ChevronLeftIcon color={colors.white50} />
            </View>
          }
          buttonWrapperStyle={styles.buttonWrapperStyle}
        >
          {mediaLinks.embeded.map((url, i) => {
            return (
              <View style={styles.slide} key={i}>
                <VideoView
                  width={width - 40}
                  height={(width - 40) * proportion}
                  url={url}
                  state={states[url]}
                  setState={setState(url)}
                />
              </View>
            )
          })}
        </Swiper>
      )}
      {mediaLinks.links.length > 0 && (
        <View marginTop={mediaLinks.embeded.length ? 16 : 0} paddingHorizontal={20}>
          <Text variant="button1">
            MEDIA LINK{mediaLinks.links.length > 1 ? "S" : ""}
          </Text>
          {mediaLinks.links.map((url, i) => (
            <Row key={i} marginLeft={-10}>
              <TextButton
                label={url}
                labelProps={{ color: colors.blue40 }}
                onPress={() => Linking.openURL(url)}
              />
            </Row>
          ))}
        </View>
      )}
    </View>
  )
}

const enhanced = compose(
  withState("states", "setStates", {}),
  withHandlers({
    setState: ({ states, setStates }) => id => state => {
      setStates({ ...states, [id]: state })
    }
  })
)
export default enhanced(Media)
