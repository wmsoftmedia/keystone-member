import { ScrollView as GlScrollView, View } from "glamorous-native"
import { ScrollView } from "react-native"
import { compose, lifecycle, withState } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import _ from "lodash/fp"

import { COMPLEX_METRICS, MEASUREMENT_KEYS } from "scenes/Home/Body/display"
import { IconButton } from "kui/components/Button"
import { Screen } from "components/Background"
import { routes } from "navigation/routes"
import { withLoader } from "hoc/withLoader"
import MeasurementCard from "scenes/Home/Body/Day/MeasurementCard"
import withBodyMetrics from "graphql/query/body/byDate"
import withProgressPictures from "graphql/query/progressPicture/byDate"
import ProgressPictures from "scenes/Home/Body/ProgressPictureWidget"
import colors from "kui/colors"
import withSettings from "hoc/withSettings"
import { EditThinIcon } from "kui/icons"

const Day = ({
  date,
  bodyMetrics,
  setScrollView,
  setScrollViewHeight,
  pictures,
  firstItem = 0,
  weightUnit,
  weightConverter,
  heightUnit,
  heightConverter,
  temperatureUnit,
  temperatureConverter
}) => {
  return (
    <Screen>
      <ScrollView
        ref={setScrollView}
        onLayout={event =>
          setScrollViewHeight(_.getOr(0, "nativeEvent.layout.height", event))
        }
      >
        <View flex={1} paddingBottom={10}>
          <GlScrollView
            horizontal
            height={330}
            paddingTop={20}
            paddingBottom={10}
            showsHorizontalScrollIndicator={false}
          >
            <View flexWrap="wrap" paddingHorizontal={10}>
              {MEASUREMENT_KEYS.map(key => (
                <View
                  key={key}
                  paddingHorizontal={10}
                  paddingBottom={20}
                  height={145}
                  width={176}
                >
                  <MeasurementCard
                    metricKey={key}
                    value={bodyMetrics[key]}
                    date={date}
                    isComplex={COMPLEX_METRICS.includes(key)}
                    weightUnit={weightUnit}
                    weightConverter={weightConverter}
                    heightUnit={heightUnit}
                    heightConverter={heightConverter}
                    temperatureUnit={temperatureUnit}
                    temperatureConverter={temperatureConverter}
                  />
                </View>
              ))}
            </View>
          </GlScrollView>
          <ProgressPictures
            title="Progress photos"
            images={pictures}
            date={date}
            firstItem={firstItem}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

export const MassAssignButton = ({ navigation, date }) => {
  return (
    <IconButton onPress={() => navigation.navigate(routes.BodyTracker, { date })}>
      <EditThinIcon color={colors.white} />
    </IconButton>
  )
}

const enhance = compose(
  withNavigation,
  withBodyMetrics,
  withProgressPictures,
  withSettings,
  withLoader({ message: "Loading Your Metrics..." }),
  withState("scrollView", "setScrollView", null),
  withState("scrollViewHeight", "setScrollViewHeight", 0),
  lifecycle({
    componentDidUpdate() {
      const { scrollDown, scrollView, scrollViewHeight, navigation } = this.props
      if (scrollView && scrollDown && scrollViewHeight > 0) {
        scrollView.scrollTo({ x: 0, y: scrollViewHeight, animated: true })
        navigation.setParams({ scrollDown: false })
      }
    }
  })
)

export default enhance(Day)
