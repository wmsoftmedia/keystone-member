import { ActivityIndicator } from "react-native"
import { FlatList, TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"
import _ from "lodash/fp"

import { AddIcon } from "kui/icons"
import { COMPLEX_METRICS, COMPLEX_PARTS, SIMPLE_METRICS } from "scenes/Home/Body/display"
import { IconButton } from "kui/components/Button"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { routes } from "navigation/routes"
import ImageWidget from "scenes/Home/Body/ImageWidget"
import Metric from "scenes/Home/Body/Timeline/Metric"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withBodyTimeline from "graphql/query/body/timeline"
import withSettings from "hoc/withSettings"

const PAGE_SIZE = 5
const shadowProps = {
  elevation: 10,
  shadowOpacity: 0.2,
  shadowColor: colors.black,
  shadowOffset: { width: 5, height: 5 },
  shadowRadius: 10
}

const Timeline = withNavigation(
  ({
    navigation,
    timeline,
    hasNextPage,
    onListEnd,
    isLoading,
    onRefresh,
    refreshing,
    weightUnit,
    weightConverter,
    heightUnit,
    heightConverter,
    temperatureUnit,
    temperatureConverter
  }) => {
    return (
      <Screen>
        {timeline.length > 0 ? (
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            flex={1}
            data={timeline}
            keyExtractor={(item, i) => String(i)}
            renderItem={({ item }) => {
              return (
                <View paddingBottom={16}>
                  <Text paddingHorizontal={20} variant="caption1">
                    {moment().format("YYYY-MM-DD") === item.date
                      ? "Today"
                      : moment(item.date).format("ddd, D MMM, YYYY")}
                  </Text>
                  <View paddingVertical={8}>
                    <TouchableOpacity
                      flexDirection="row"
                      marginHorizontal={20}
                      marginBottom={16}
                      paddingVertical={8}
                      paddingHorizontal={20}
                      backgroundColor={colors.darkBlue90}
                      borderRadius={12}
                      flexWrap="wrap"
                      {...shadowProps}
                      onPress={() =>
                        navigation.navigate(routes.BodyDay, { date: item.date })
                      }
                    >
                      {SIMPLE_METRICS.map(m => {
                        const value = item.metrics ? item.metrics[m] : null
                        return (
                          <Metric
                            value={value}
                            metricKey={m}
                            key={m}
                            weightUnit={weightUnit}
                            weightConverter={weightConverter}
                            heightUnit={heightUnit}
                            heightConverter={heightConverter}
                            temperatureUnit={temperatureUnit}
                            temperatureConverter={temperatureConverter}
                          />
                        )
                      })}
                      {COMPLEX_METRICS.map(m => {
                        const value =
                          item.metrics && item.metrics[m]
                            ? COMPLEX_PARTS[m].reduce(
                                (acc, part) => acc + (item.metrics[m][part] || 0),
                                0
                              )
                            : null
                        return (
                          <Metric
                            value={value}
                            metricKey={m}
                            key={m}
                            weightUnit={weightUnit}
                            weightConverter={weightConverter}
                            heightUnit={heightUnit}
                            heightConverter={heightConverter}
                            temperatureUnit={temperatureUnit}
                            temperatureConverter={temperatureConverter}
                          />
                        )
                      })}
                    </TouchableOpacity>
                    {item.progressPictures.totalCount > 0 && (
                      <Row paddingBottom={16} paddingHorizontal={10}>
                        {item.progressPictures.nodes
                          .slice(0, item.progressPictures.totalCount === 4 ? 4 : 3)
                          .map((p, i) => (
                            <TouchableOpacity
                              key={i}
                              width="25%"
                              paddingHorizontal={10}
                              onPress={() =>
                                navigation.navigate(routes.BodyDay, {
                                  date: item.date,
                                  scrollDown: true,
                                  firstItem: i
                                })
                              }
                            >
                              <ImageWidget
                                defaultPath={p.localPath}
                                useLocal={true}
                                fallbackUrl={p.previewUrl}
                                width="100%"
                                backgroundColor={colors.darkBlue80}
                                borderRadius={4}
                                height={80}
                                containerProps={shadowProps}
                                errorText=""
                              />
                            </TouchableOpacity>
                          ))}
                        {item.progressPictures.totalCount >= 4 && (
                          <TouchableOpacity
                            width="25%"
                            paddingHorizontal={10}
                            height={80}
                            onPress={() =>
                              navigation.navigate(routes.BodyDay, {
                                date: item.date,
                                scrollDown: true
                              })
                            }
                          >
                            <View
                              flex={1}
                              backgroundColor={colors.darkBlue90}
                              justifyContent="center"
                              alignItem="center"
                              borderRadius={4}
                              {...shadowProps}
                            >
                              <Text variant="button1" textAlign="center">
                                SEE ALL
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </Row>
                    )}
                  </View>
                </View>
              )
            }}
            ListFooterComponent={() =>
              hasNextPage ? (
                <Row centerXY paddingTop={20} paddingBottom={30}>
                  <ActivityIndicator />
                  <Text paddingLeft={10} textAlign="center" variant="body1">
                    Loading data...
                  </Text>
                </Row>
              ) : null
            }
            onEndReached={onListEnd}
            onEndReachedThreshold={0.1}
            initialNumToRender={PAGE_SIZE}
          />
        ) : isLoading ? (
          <Row centerXY flex={1}>
            <ActivityIndicator color={colors.white50} />
            <Text paddingLeft={10} textAlign="center" variant="body1">
              Loading timeline...
            </Text>
          </Row>
        ) : (
          <View alignItem="center" paddingTop={30}>
            <Text variant="body2" textAlign="center" paddingBottom={8}>
              No metrics to show
            </Text>
            <Text variant="body1" textAlign="center">
              Add your first metric to start the timeline
            </Text>
          </View>
        )}
      </Screen>
    )
  }
)

export const AddDayButton = ({ navigation, date }) => {
  return (
    <IconButton onPress={() => navigation.navigate(routes.BodyDay, { date })}>
      <AddIcon />
    </IconButton>
  )
}

const enhance = compose(
  withSettings,
  withState("isFetching", "setFetchingState", false),
  withState("refreshing", "setRefreshing", false),
  withProps(({ timeline }) => ({
    offset: (timeline || []).length,
    first: PAGE_SIZE
  })),
  withBodyTimeline,
  withProps(({ data, isFetching }) => ({
    isLoading: !isFetching && !!data && !!data.loading
  })),
  withProps(({ page }) => ({ timeline: page })),
  withHandlers({
    onListEnd: ({ hasNextPage, isFetching, setFetchingState, data, timeline }) => () => {
      if (!hasNextPage || isFetching) return
      setFetchingState(true)
      data.fetchMore({
        variables: { first: PAGE_SIZE, offset: (timeline || []).length },
        updateQuery: (cur, { fetchMoreResult: next }) => {
          setFetchingState(false)
          if (!next) return cur
          return fetchingMerge(cur, next)
        }
      })
    },
    onRefresh: ({ data, setRefreshing }) => () => {
      setRefreshing(true)
      data
        .refetch()
        .then(() => setRefreshing(false))
        .catch(() => setRefreshing(false))
    }
  })
)

const fetchingMerge = (prev, next) => {
  const oldNodes = _.getOr([], `metricsTimelineByUser.nodes`, prev) || []
  const newNodes = _.getOr([], `metricsTimelineByUser.nodes`, next) || []
  const hasNextPage = _.getOr([], `metricsTimelineByUser.hasNextPage`, next) || false

  return {
    metricsTimelineByUser: {
      __typename: "MetricsTimelinePayload",
      nodes: [...oldNodes, ...newNodes],
      hasNextPage,
      totalCount: [...oldNodes, ...newNodes].length
    }
  }
}

export default enhance(Timeline)
