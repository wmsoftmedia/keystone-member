import { Dimensions } from "react-native"
import { View, TouchableOpacity } from "glamorous-native"
import { ScrollView } from "react-native"
import { compose, withHandlers, withState, lifecycle } from "recompose"
import { confirm } from "native"
import { withNavigation } from "react-navigation"
import React from "react"
import numeral from "numeral"
import _ from "lodash/fp"

import {
  AddIcon,
  JournalPlate,
  ListPageIcon,
  PlatePageIcon,
  PlusIcon,
  SmallCloseIcon
} from "kui/icons"
import { IconButton, PrimaryButton, TextButton } from "kui/components/Button"
import { Row } from "kui/components"
import { SOURCES, calcPortionsInMeal } from "scenes/Home/NutritionJournal/journal"
import { Screen } from "components/Background"
import { homeRoutes } from "navigation/routes"
import Card from "kui/components/Card"
import Line from "kui/components/Line"
import MealImages from "scenes/Home/NutritionJournal/Meal/MealImages"
import PlateImages from "scenes/Home/NutritionJournal/Meal/PlateImages"
import SourceBadge from "scenes/Home/NutritionJournal/SourceBadge"
import TargetValue from "scenes/Home/NutritionJournal/TargetValue"
import Text from "kui/components/Text"
import colors, { gradients } from "kui/colors"

const windowWidth = Dimensions.get("window").width
const PLATE_WIDTH = windowWidth - 40
const MEAL_MODES = { PLATE: "PLATE", LIST: "LIST" }

const JournalMeal = props => {
  const {
    meal,
    mealFood,
    mealMode,
    setMealMode,
    target,
    updateMealFood,
    deleteByFoodId,
    deleteBySource,
    editByFoodId,
    navigation,
    date,
    setScrollView,
    setScrollViewHeight
  } = props
  const portions = calcPortionsInMeal(mealFood)
  const hasAllTargets =
    !!target.protein || !!target.fat || !!target.carbs || !!target.vegetables

  return (
    <Screen>
      <ScrollView
        ref={setScrollView}
        onLayout={event =>
          setScrollViewHeight(_.getOr(0, "nativeEvent.layout.height", event))
        }
      >
        <View flex={1} paddingBottom={88}>
          {/* MEAL STAT */}
          <Row spread paddingBottom={20} paddingHorizontal={20}>
            {SOURCES.map(source => (
              <TargetValue
                key={source}
                target={target[source.toLowerCase()]}
                consumed={portions[source]}
                source={source}
                alignItems="center"
                hasAllTargets={hasAllTargets}
              />
            ))}
          </Row>

          {/* PLATE-TO-LIST SWITCH */}
          <View paddingBottom={2}>
            <Row centerY spread>
              <Text variant="body2" paddingLeft={20}>
                {mealMode === MEAL_MODES.PLATE ? "Plate" : "List"} view
              </Text>
              <IconButton
                paddingHorizontal={20}
                onPress={() =>
                  setMealMode(
                    mealMode === MEAL_MODES.PLATE ? MEAL_MODES.LIST : MEAL_MODES.PLATE
                  )
                }
              >
                {mealMode === MEAL_MODES.PLATE ? <ListPageIcon /> : <PlatePageIcon />}
              </IconButton>
            </Row>
          </View>

          {/* PLATE OR LIST */}
          <View paddingHorizontal={20} paddingBottom={24}>
            {mealMode === MEAL_MODES.PLATE ? (
              <View
                width={PLATE_WIDTH}
                height={PLATE_WIDTH}
                borderRadius={PLATE_WIDTH / 2}
                backgroundColor={colors.darkBlue90}
                shadowOpacity={0.3}
                shadowColor={colors.black}
                shadowOffset={{ width: 0, height: 0 }}
                shadowRadius={20}
                elevation={5}
                padding={20}
              >
                <View position="absolute">
                  <JournalPlate size={PLATE_WIDTH} />
                </View>
                <Row centerX flex={0.33}>
                  <AddPortionButton
                    backgroundColor={colors.orange50}
                    title="Protein"
                    source="PROTEIN"
                    portions={portions.PROTEIN}
                    setMealFood={updateMealFood}
                    mealFood={mealFood}
                    deleteBySource={deleteBySource}
                    mealTitle={meal.name}
                  />
                </Row>
                <Row centerY spread flex={0.33}>
                  <AddPortionButton
                    backgroundColor={colors.darkBlue50}
                    title="Vegetables"
                    source="VEGETABLES"
                    portions={portions.VEGETABLES}
                    setMealFood={updateMealFood}
                    mealFood={mealFood}
                    deleteBySource={deleteBySource}
                    mealTitle={meal.name}
                  />
                  <AddPortionButton
                    backgroundColor={colors.green50}
                    title="Fat"
                    source="FAT"
                    portions={portions.FAT}
                    setMealFood={updateMealFood}
                    mealFood={mealFood}
                    deleteBySource={deleteBySource}
                    mealTitle={meal.name}
                  />
                </Row>
                <Row centerX alignItems="flex-end" flex={0.34}>
                  <AddPortionButton
                    backgroundColor={colors.turquoise50}
                    title="Carbs"
                    source="CARBS"
                    portions={portions.CARBS}
                    setMealFood={updateMealFood}
                    mealFood={mealFood}
                    deleteBySource={deleteBySource}
                    mealTitle={meal.name}
                  />
                </Row>
              </View>
            ) : (
              <View>
                {!!mealFood && mealFood.length != 0 ? (
                  mealFood.map((item, j) => (
                    <Card key={j} backgroundColor={colors.darkBlue90} marginBottom={8}>
                      <Row centerY spread>
                        <TouchableOpacity onPress={() => editByFoodId(item)} flex={1}>
                          <Row centerY spread alignSelf="stretch">
                            <Text variant="body2" paddingLeft={16}>
                              {item.name}
                            </Text>
                            <Row centerY>
                              <Text variant="caption1">
                                {numeral(item.portions).format("0.[00]")} x
                              </Text>
                              {item.sources.map(source => (
                                <SourceBadge
                                  key={source}
                                  source={source}
                                  marginLeft={6}
                                  marginVertical={16}
                                />
                              ))}
                            </Row>
                          </Row>
                        </TouchableOpacity>

                        <IconButton onPress={() => deleteByFoodId(item.id)}>
                          <SmallCloseIcon />
                        </IconButton>
                      </Row>
                    </Card>
                  ))
                ) : (
                  <Text textAlign="center" color={colors.darkBlue40} paddingBottom={20}>
                    {`Your meal is empty.\nClick "Add food" to start tracking.`}
                  </Text>
                )}
                <TextButton
                  label="ADD FOOD"
                  Icon={() => (
                    <View paddingRight={4}>
                      <PlusIcon />
                    </View>
                  )}
                  onPress={() =>
                    navigation.navigate(homeRoutes.NutritionJournalSource, {
                      title: "Choose your food",
                      mealFood,
                      setMealFood: updateMealFood,
                      mealTitle: meal.name,
                      basketMode: true
                    })
                  }
                  height={56}
                  justifyContent="center"
                  backgroundColor={colors.darkBlue80_10}
                  borderRadius={12}
                />
              </View>
            )}
          </View>

          {/* PHOTO */}
          <Line color={colors.darkBlue70} />
          <View paddingTop={20} paddingBottom={40}>
            <MealImages meal={meal} date={date} />
          </View>
        </View>
      </ScrollView>

      {/* SAVE */}
      <View
        width="100%"
        backgroundColor={gradients.bg[1]}
        position="absolute"
        bottom={0}
        paddingHorizontal={20}
        paddingBottom={20}
        paddingTop={10}
        shadowOpacity={0.6}
        shadowColor={colors.black}
        shadowOffset={{ width: 0, height: 0 }}
        shadowRadius={10}
        elevation={5}
      >
        <PrimaryButton label={"GO BACK"} onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  )
}

const AddPortionButton = withNavigation(
  ({
    title,
    source,
    backgroundColor,
    portions,
    mealFood,
    setMealFood,
    navigation,
    deleteBySource,
    mealTitle
  }) => {
    return (
      <IconButton
        width={100}
        height={100}
        onPress={() =>
          navigation.navigate(homeRoutes.NutritionJournalSource, {
            mealTitle,
            title,
            source,
            mealFood,
            setMealFood
          })
        }
        alignItems="center"
        justifyContent="center"
      >
        {portions === 0 ? (
          <View alignItems="center">
            <View borderRadius={14} width={28} backgroundColor={backgroundColor}>
              <AddIcon size={28} color={colors.white} />
            </View>
            <Text variant="caption1" opacity={0.6} paddingTop={8}>
              {title}
            </Text>
          </View>
        ) : (
          <View width={100} height={100}>
            <PlateImages
              images={mealFood.filter(f => f.sources.includes(source)).map(f => f.pic)}
            />
            <View position="absolute" top={0} right={0}>
              <IconButton
                onPress={() => deleteBySource(source)}
                paddingTop={0}
                paddingRight={0}
              >
                <SmallCloseIcon />
              </IconButton>
            </View>
          </View>
        )}
      </IconButton>
    )
  }
)

const enhance = compose(
  withNavigation,
  withState("mealFood", "setMealFood", ({ meal }) => meal.food),
  withState("mealMode", "setMealMode", MEAL_MODES.PLATE),
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
  }),
  withHandlers({
    updateMealFood: ({ updateMeal, meal, setMealFood }) => mealFood => {
      setMealFood(mealFood)
      updateMeal({ ...meal, food: mealFood })
    }
  }),
  withHandlers({
    editByFoodId: ({ navigation, setMealFood, updateMeal, meal, mealFood }) => food =>
      navigation.navigate(homeRoutes.NutritionJournalPortion, {
        food,
        portions: food ? food.portions : 1,
        upsertSelectedFood: (id, portions) => {
          const newFood = mealFood.map(f => (f.id === id ? { ...f, portions } : f))
          setMealFood(newFood)
          updateMeal({ ...meal, food: newFood })
        },
        mealTitle: meal.name
      }),
    deleteByFoodId: ({ mealFood, updateMealFood }) => id =>
      confirm(
        () => updateMealFood(mealFood.filter(f => f.id !== id)),
        "This item will be deleted from the meal."
      ),
    deleteBySource: ({ mealFood, updateMealFood }) => source =>
      confirm(
        () => updateMealFood(mealFood.filter(f => !f.sources.includes(source))),
        "These items will be deleted from the meal."
      )
  })
)

export default enhance(JournalMeal)
