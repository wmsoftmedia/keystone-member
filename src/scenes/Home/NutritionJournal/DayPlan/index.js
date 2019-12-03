import { ActivityIndicator, Animated, Dimensions } from "react-native"
import { Image, TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState, lifecycle } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import * as Sentry from "sentry-expo"
import numeral from "numeral"
import * as FileSystem from "expo-file-system"
import { connect } from "react-redux"
import _ from "lodash/fp"

import { ListPageIcon, SearchIcon } from "kui/icons"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import {
  SOURCES,
  calcPortionsInDay,
  calcPortionsInMeal,
  sourceToColor
} from "scenes/Home/NutritionJournal/journal"
import { homeRoutes } from "navigation/routes"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { withErrorHandler } from "hoc"
import { withLoader } from "hoc/withLoader"
import AnimatedHeader, {
  swiperRecenterAnimationConfig
} from "scenes/Home/NutritionJournal/DayPlan/AnimatedHeader"
import Card from "kui/components/Card"
import Line from "kui/components/Line"
import SourceBadge from "scenes/Home/NutritionJournal/SourceBadge"
import TargetChart from "scenes/Home/NutritionJournal/DayPlan/TargetChart"
import TargetValue from "scenes/Home/NutritionJournal/TargetValue"
import Text from "kui/components/Text"
import WaterWidget from "scenes/Home/NutritionJournal/DayPlan/WaterWidget"
import colors from "kui/colors"
import withDayData from "graphql/query/foodJournal/day"
import withUpdateMeal from "graphql/mutation/foodJournal/saveMeal"
import { CLEAR_IMAGE_STORAGE } from "epics/fileSystemEpic/actions"

const windowWidth = Dimensions.get("window").width

const DayPlan = ({
  date,
  target,
  meals,
  updateMeal,
  navigation,
  scrollY,
  onScroll,
  onScrollEnd,
  animationRange,
  fixedHeader
}) => {
  const dayStat = calcPortionsInDay(meals)
  const hasDayTarget =
    !!target.protein || !!target.fat || !!target.carbs || !!target.vegetables
  const showCompactHeader =
    hasDayTarget ||
    !!dayStat.PROTEIN ||
    !!dayStat.FAT ||
    !!dayStat.CARBS ||
    !!dayStat.VEGETABLES

  return (
    <Screen>
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: onScroll
        })}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
      >
        <View flex={1} paddingBottom={20} paddingHorizontal={20}>
          {/* TARGET */}
          <Row paddingVertical={24}>
            <TargetChart dayStat={dayStat} target={target} />
            <View flex={1} flexWrap="wrap" flexDirection="row" alignContent="center">
              {SOURCES.map(source => (
                <TargetValue
                  key={source}
                  target={target[source.toLowerCase()]}
                  consumed={dayStat[source]}
                  source={source}
                  paddingLeft={20}
                  paddingVertical={10}
                  hasAllTargets={hasDayTarget}
                />
              ))}
            </View>
          </Row>

          {/* WATER */}
          <Card color={colors.darkBlue90} paddingVertical={20}>
            <WaterWidget target={target.water} date={date} />
          </Card>

          {/* MEALS */}
          <Text variant="body2" paddingBottom={12} paddingTop={28}>
            Meal journal
          </Text>
          {meals.map((meal, i) => {
            const mealStat = calcPortionsInMeal(meal.food)
            return (
              <Card key={i} color={colors.darkBlue90} marginBottom={12}>
                <Row centerY>
                  <Row centerY spread flex={1} padding={16}>
                    <View>
                      <Text variant="body2">{meal.name}</Text>
                      <Row>
                        {SOURCES.map(source => (
                          <Text
                            key={source}
                            variant="caption1"
                            color={sourceToColor(source)}
                            opacity={mealStat[source] ? 1 : 0.4}
                            paddingRight={10}
                          >
                            {source[0].toUpperCase()}{" "}
                            {numeral(mealStat[source]).format("0.[00]")}
                          </Text>
                        ))}
                      </Row>
                    </View>
                  </Row>

                  <TouchableOpacity
                    padding={12}
                    onPress={() =>
                      navigation.navigate(homeRoutes.NutritionJournalMeal, {
                        title: meal.name,
                        meal,
                        updateMeal,
                        target,
                        date
                      })
                    }
                  >
                    <ListPageIcon size={24} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    padding={12}
                    onPress={() =>
                      navigation.navigate(homeRoutes.NutritionJournalSource, {
                        title: "Choose your food",
                        mealFood: meal.food,
                        setMealFood: newFood => updateMeal({ ...meal, food: newFood }),
                        mealTitle: meal.name,
                        basketMode: true
                      })
                    }
                  >
                    <SearchIcon size={24} color={colors.white} />
                  </TouchableOpacity>
                </Row>
                {!!meal.food && meal.food.length != 0 && (
                  <View>
                    <Line
                      color={colors.darkBlue70}
                      marginBottom={16}
                      marginHorizontal={16}
                    />
                    {meal.food.map((item, j) => {
                      return (
                        <Row
                          key={j}
                          centerY
                          spread
                          paddingBottom={20}
                          paddingHorizontal={16}
                        >
                          <Text variant="caption1">{item.name}</Text>
                          <Row centerY>
                            <Text variant="caption1">
                              {numeral(item.portions).format("0.[00]") + " x "}
                            </Text>
                            {item.sources.map(source => (
                              <SourceBadge key={source} source={source} marginLeft={6} />
                            ))}
                          </Row>
                        </Row>
                      )
                    })}
                  </View>
                )}
                {!!meal.images && meal.images.length > 0 && (
                  <View paddingHorizontal={16} paddingBottom={16}>
                    <Line
                      color={colors.darkBlue70}
                      marginBottom={16}
                      marginHorizontal={0}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(homeRoutes.NutritionJournalMeal, {
                          title: meal.name,
                          meal,
                          updateMeal,
                          target,
                          date,
                          scrollDown: true
                        })
                      }
                    >
                      <FirtsImage image={meal.images[0]} />
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            )
          })}
        </View>
      </Animated.ScrollView>
      {showCompactHeader && (
        <AnimatedHeader
          animationRange={animationRange}
          target={target}
          consumed={dayStat}
          blockHeader={fixedHeader}
          offset={150}
        />
      )}
    </Screen>
  )
}

const FirtsImage = compose(
  withState("isLoading", "setIsLoading", false),
  withState("loadingError", "setLoadingError", false),
  withState("_try", "setTry", 0),
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return !_.isEqual(nextProps, this.props)
    }
  })
)(({ image, isLoading, setIsLoading, loadingError, setLoadingError, _try, setTry }) => {
  const [uri, setUri] = React.useState()
  React.useEffect(() => {
    let isMounted = true
    image &&
      FileSystem.getInfoAsync(FileSystem.documentDirectory + image.localPath).then(r => {
        isMounted && setUri(r.exists ? r.uri : image.previewLink)
      })
    return () => (isMounted = false)
  }, [image])

  return (
    !!uri && (
      <View width="100%" height={100} borderRadius={8} backgroundColor={colors.white10}>
        <Image
          source={{ uri }}
          width={windowWidth - 72}
          height={100}
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
        {loadingError && (
          <View
            position="absolute"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Text variant="caption1">{`Unable to load meal photo`}</Text>
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
})

const enhance = compose(
  connect(),
  withNavigation,
  withUpdateMeal,
  withDayData,
  withErrorHandler,
  lifecycle({
    componentDidMount() {
      this.props.dispatch({ type: CLEAR_IMAGE_STORAGE })
    }
  }),
  withLoader({ message: "Loading Your Day..." }),
  withProps(({ day }) => ({
    target: day.target,
    meals: day.meals
  })),
  withHandlers({
    updateMeal: ({ saveJournalMeal, date }) => newMeal =>
      saveJournalMeal({ date, meal: newMeal }).catch(e =>
        logErrorWithMemberId(memberId =>
          Sentry.captureException(
            new Error(
              `MId:{${memberId}}, Scope:{NutritionJournal.DayPlan.saveJournalMeal}, Error:{${_.toString(
                e
              )}}`
            )
          )
        )
      )
  }),

  withState("fixedHeader", "setFixedHeader", false),
  withState("scrollY", "setScrollY", () => new Animated.Value(0)),
  withProps(({ scrollY }) => ({
    animationRange: scrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
      extrapolate: "clamp"
    })
  })),
  withHandlers({
    onScroll: props => () => {
      const { currentlyOpenSwipeable } = props
      if (currentlyOpenSwipeable) {
        currentlyOpenSwipeable.recenter(Animated.timing, swiperRecenterAnimationConfig)
      }
    },
    onScrollEnd: ({ setFixedHeader }) => event => {
      const position = event.nativeEvent.contentOffset.y

      if (position > 150) {
        setFixedHeader(true)
      } else {
        setFixedHeader(false)
      }
    }
  })
)

export default enhance(DayPlan)
