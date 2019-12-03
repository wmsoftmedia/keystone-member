import { Alert, Animated, Easing } from "react-native"
import { FloatingAction } from "react-native-floating-action"
import { View } from "glamorous-native"
import { actions } from "react-redux-form/native"
import {
  compose,
  setDisplayName,
  withHandlers,
  withProps,
  withStateHandlers,
  getContext,
  withState
} from "recompose"
import { connect } from "react-redux"

import { withApollo } from "@apollo/react-hoc"
import gql from "graphql-tag"
import { withNavigation } from "react-navigation"
import PropTypes from "prop-types"
import React from "react"
import * as Sentry from "sentry-expo"

import { CopyFromIcon, DailyPlanIcon, MealPlanIcon, PlusIcon, TrashIcon } from "kui/icons"
import { FOOD_ITEM_CONTEXT_TRACKER, NUTRITION_TRACKER_FORM } from "constants"
import { FloatButtonAction, TextButton } from "kui/components/Button"
import { Row } from "kui/components"
import { addItems, quickAdd, segueToDayAdd } from "scenes/Home/Nutrition/Tracker/actions"
import { confirm } from "native"
import {
  datePickerFormat,
  formatCals,
  gqlDate,
  isSameDate,
  mealTotals,
  subtractDays
} from "keystone"
import { extractItemId } from "keystone/food"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { mealLabelByIndex } from "scenes/Home/Nutrition/utils"
import { push, remove } from "form-helpers"
import { routes } from "navigation/routes"
import { withTrackerSubmit } from "scenes/Home/Nutrition/Tracker/withTrackerSubmit"
import AddFood from "scenes/Home/Nutrition/Tracker/AddFood"
import AnimatedHeader from "scenes/Home/Nutrition/Tracker/AnimatedHeader"
import CenterView from "components/CenterView"
import DeleteMealButton from "scenes/Home/Nutrition/Tracker/DeleteMealButton"
import EntryListItem from "scenes/Home/Nutrition/Tracker/EntryListItem"
import Header, { REDUX_KEY } from "scenes/Home/Nutrition/Tracker/Header"
import InfoMessage from "components/InfoMessage"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import TitleDatePicker from "components/TitleDatePicker"
import Tooltip from "kui/components/Tooltip"
import _ from "lodash/fp"
import colors from "kui/colors"

const swiperRecenterAnimationConfig = {
  toValue: { x: 0, y: 0 },
  duration: 250,
  easing: Easing.out(Easing.ease)
}

const keyToLocation = key => {
  const address = key.split(",")
  return { sectionIndex: address[0], index: address[1] }
}

const MealStatText = p => <Text variant="caption1" color={colors.darkBlue30} {...p} />

const MealHeader = props => {
  const { meal, onPressDelete } = props
  const calsValue = _.getOr(null, "totals.cals", meal)
  const cals = formatCals(calsValue)
  const protein = _.getOr(null, "totals.protein", meal)
  const fat = _.getOr(null, "totals.fat", meal)
  const carbs = _.getOr(null, "totals.carbs", meal)
  const isEmpty = _.getOr(0, "data.length", meal) === 0

  return (
    <View
      backgroundColor={colors.darkBlue90}
      marginTop={12}
      borderTopLeftRadius={12}
      borderTopRightRadius={12}
    >
      <Row paddingLeft={16} paddingBottom={10}>
        <View flex={1} justifyContent="center" paddingTop={16}>
          <View height={24} justifyContent="center">
            <Text variant="body2">{meal.title}</Text>
          </View>
          {isEmpty ? (
            <MealStatText opacity={0.4}>This meal is empty</MealStatText>
          ) : (
            <Row width={"100%"}>
              <MealStatText>{cals} | </MealStatText>
              <MealStatText>P {protein || "--"} g | </MealStatText>
              <MealStatText>F {fat || "--"} g | </MealStatText>
              <MealStatText>C {carbs || "--"} g</MealStatText>
            </Row>
          )}
          <Row position="absolute" right={0} top={11}>
            <DeleteMealButton padding={5} onPress={onPressDelete} />
            <AddFood
              padding={5}
              paddingLeft={10}
              paddingRight={15}
              mealIndex={meal.index}
            />
          </Row>
        </View>
      </Row>
      <Line marginHorizontal={16} marginTop={4} />
    </View>
  )
}

const buttonActions = (copySelectedToDate, date, showDelete) => [
  {
    position: 3,
    name: "mealSearch",
    render: () => (
      <FloatButtonAction key="mealSearch" text={"Meals"} Icon={MealPlanIcon} />
    )
  },
  {
    position: 1,
    name: "dayPlans",
    render: () => (
      <FloatButtonAction key="dayPlans" text={"Day Plans"} Icon={DailyPlanIcon} />
    )
  },
  {
    position: 2,
    name: "copyDayFrom",
    render: () => (
      <FloatButtonAction
        key="copyDayFrom"
        text={"Copy day from"}
        Icon={() => (
          <TitleDatePicker
            date={subtractDays(date)}
            onDateChange={copySelectedToDate}
            allowFutureDates
            renderComponent={() => <CopyFromIcon />}
          />
        )}
      />
    )
  },
  {
    position: 0,
    name: "clearDay",
    render: () => (
      <React.Fragment key="clearDay">
        {showDelete && (
          <FloatButtonAction
            text={"Clear Day"}
            Icon={() => (
              <CenterView
                borderRadius={40}
                backgroundColor={colors.red50}
                width={40}
                height={40}
              >
                <TrashIcon />
              </CenterView>
            )}
          />
        )}
      </React.Fragment>
    )
  }
]

class Meals extends React.Component {
  nutritionList = null

  componentDidMount() {
    this.props.tooltipEvents.on("nextStep", stepName => {
      if (stepName === "nutrition-action") {
        this.actionRef.animateButton()
      }
    })
    this.props.tooltipEvents.on("skip", () => {
      this.scrollToTop()
    })
    this.props.tooltipEvents.on("prevStep", stepName => {
      if (stepName === "nutrition-add-meal") {
        this.scrollToBottom(false)
      }
    })
  }

  componentWillUnmount() {
    this.props.tooltipEvents.off("nextStep")
    this.props.tooltipEvents.off("skip")
    this.props.tooltipEvents.off("prevStep")
  }

  scrollToTop = (animated = true) => {
    if (this.props.sections.length > 0) {
      this.nutritionList.scrollToLocation({
        viewPosition: 1,
        sectionIndex: 0,
        itemIndex: 0,
        animated
      })
    }
  }

  scrollToBottom = (animated = true) => {
    if (this.props.sections.length > 0) {
      this.nutritionList.scrollToLocation({
        viewPosition: 0,
        sectionIndex: this.props.sections.length - 1,
        itemIndex: 0,
        animated
      })
    }
  }

  render() {
    const { date, sections, totals, profile, favourites } = this.props
    const { hasMeals } = this.props
    const { currentlyOpenSwipeable } = this.props
    const {
      onButtonActionPress,
      deleteEntry,
      addFavourite,
      copySelectedToDate
    } = this.props
    const { onScroll, setOpenSwipeable } = this.props
    const { onQuickAddClick, addMeal, deleteMealByIndex, onItemPress } = this.props
    const { tooltipEvents } = this.props
    const { fixedHeader, scrollRangeForAnimation, onScrollEndDrag } = this.props

    return (
      <View flex={1}>
        <Tooltip
          name="nutrition-action"
          order={6}
          text="TODO: text"
          title="Add your meals or day plans"
          position="absolute"
          bottom={20}
          right={20}
          width={160}
          height={290}
          onPrev={() => this.actionRef.animateButton()}
          onNext={() => {
            this.actionRef.animateButton()
            this.scrollToTop(false)
          }}
          onStop={() => {
            this.actionRef.animateButton()
            this.scrollToTop()
          }}
        >
          <View />
        </Tooltip>

        <Animated.SectionList
          onScrollEndDrag={onScrollEndDrag}
          onMomentumScrollEnd={onScrollEndDrag}
          sections={sections}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this.props.scrollY } }
              }
            ],
            {
              useNativeDriver: true,
              listener: onScroll
            }
          )}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item, i) => i}
          renderSectionHeader={({ section }) => (
            <MealHeader
              meal={section}
              onPressDelete={deleteMealByIndex(section.index, section.data.length > 0)}
            />
          )}
          renderSectionFooter={({ section }) => (
            <TextButton
              activeOpacity={0.9}
              label={"QUICK ADD"}
              Icon={PlusIcon}
              onPress={() => onQuickAddClick(section)}
              backgroundColor={colors.darkBlue90}
              borderBottomLeftRadius={12}
              borderBottomRightRadius={12}
            />
          )}
          renderItem={({ item, ...rest }) => {
            return (
              <EntryListItem
                onOpen={(event, gestureState, swipeable) => {
                  if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
                    currentlyOpenSwipeable.recenter()
                  }
                  setOpenSwipeable(swipeable)
                }}
                onPress={(item, i, section) => () => onItemPress(item, i, section)}
                onDelete={deleteEntry}
                addFavourite={addFavourite}
                {...rest}
                item={item}
                favourites={favourites}
              />
            )
          }}
          ListEmptyComponent={
            <InfoMessage
              title="Your tracker is empty."
              subtitle={"Add a meal to start tracking.\n...or choose a day plan"}
            />
          }
          ListHeaderComponent={
            <Header
              totals={totals}
              profile={profile}
              onActionTap={() => this.actionRef.animateButton()}
              onScrollToBottom={() => this.scrollToBottom(false)}
              onScrollToTop={() => this.scrollToTop(false)}
            />
          }
          ListFooterComponent={
            <Tooltip
              order={4}
              name="nutrition-add-meal"
              text="TODO: text"
              title="Add Meal"
              onPrev={() => tooltipEvents.emit("prevStep", "nutrition-pfc")}
              onStop={() => this.scrollToTop()}
              marginTop={hasMeals ? 12 : 0}
            >
              <TextButton
                activeOpacity={0.9}
                label="ADD MEAL"
                Icon={() => (
                  <View paddingRight={4}>
                    <PlusIcon />
                  </View>
                )}
                onPress={addMeal}
                height={56}
                justifyContent="center"
                backgroundColor={colors.darkBlue80_10}
                borderRadius={12}
              />
            </Tooltip>
          }
          backgroundColor={colors.transparent}
          contentContainerStyle={{
            paddingHorizontal: 20,
            backgroundColor: colors.transparent,
            paddingBottom: 120
          }}
          ref={component => (this.nutritionList = component)}
        />

        <AnimatedHeader
          animationRange={this.props.animationRange}
          totals={totals}
          profile={profile}
          blockHeader={fixedHeader}
          offset={scrollRangeForAnimation}
        />

        <FloatingAction
          distanceToEdge={20}
          color={colors.violet40}
          actions={buttonActions(copySelectedToDate, date, hasMeals)}
          overlayColor={"rgba(3,20,42,0.7)"}
          actionsPaddingTopBottom={4}
          onPressItem={onButtonActionPress}
          iconHeight={20}
          iconWidth={20}
          ref={component => (this.actionRef = component)}
        />
      </View>
    )
  }
}

const emptyMeal = Object.freeze({ entries: [] })

const removeEntry = dispatch => (mealIndex, entryIndex) => {
  remove(dispatch)(
    `${NUTRITION_TRACKER_FORM}.meals[${mealIndex}].entries`,
    entryIndex,
    false
  )
}

const mapStateToProps = state => {
  const headerExpanded = _.getOr(false, `ui.switches.${REDUX_KEY}`, state)
  return { headerExpanded }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { submitTracker, reset, date, client, navigation } = ownProps
  return {
    dispatch,
    addMeal: () => {
      push(dispatch)(`${NUTRITION_TRACKER_FORM}.meals`, emptyMeal)
      submitTracker()
      reset()
    },
    deleteMealByIndex: (index, shouldConfirm = true) => () => {
      const cb = () => {
        remove(dispatch)(`${NUTRITION_TRACKER_FORM}.meals`, index)
        submitTracker()
        reset()
      }
      if (shouldConfirm) {
        confirm(cb, "Are you sure you want to delete this meal?", "Delete Meal")
      } else {
        cb()
      }
    },
    deleteEntry: mealIndex => entryIndex => {
      removeEntry(dispatch)(mealIndex, entryIndex)
      submitTracker()
      reset()
    },
    onQuickAddClick: section => {
      const mealIndex = section.index
      const index = section.data.length
      const item = Object.freeze({
        label: "Quick Add",
        brand: null,
        externalId: null,
        id: -1,
        isGeneric: true,
        isMyFood: false,
        macros: {
          cals: null,
          protein: null,
          fat: null,
          carbs: null
        },
        meta: {
          type: "macro",
          source: "macro"
        },
        origin: "QUICK ADD",
        provider: null
      })
      dispatch(quickAdd(mealIndex, [item]))
      navigation.navigate(routes.FoodItem, {
        context: FOOD_ITEM_CONTEXT_TRACKER,
        item,
        index,
        mealIndex
      })
    },
    deleteEntries: items => {
      // WARNING: For batch delete to work - we need feield tracking (which is
      // not possible if we don't have a h() function defined correctly);
      // Having item ids would solve the problem...
      const itemKeys = Object.keys(items)
      const cb = () => {
        const itemLocations = itemKeys.map(keyToLocation)
        itemLocations.forEach(({ sectionIndex, index }) =>
          removeEntry(dispatch)(sectionIndex, index)
        )
        submitTracker()
        reset()
      }
      const count = itemKeys.length
      confirm(
        cb,
        `Are you sure you want to delete ${count} item${count > 1 ? "s" : ""}?`,
        "Delete Entries"
      )
    },
    clearDay: () => {
      dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.meals`, []))
      submitTracker()
      reset()
    },
    copySelectedToDate: fromDate => {
      const gqlFromDate = gqlDate(fromDate)
      if (!isSameDate(date)(fromDate)) {
        confirmCopyFrom(fromDate, () => {
          dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.isLoading`, true))
          client
            .query({ query: MEMBER_NUTRITION, variables: { date: gqlFromDate } })
            .then(res => {
              const path = "data.currentMember.tracker.nodes[0].body"
              const meals = JSON.parse(_.getOr('{"meals": []}', path, res)).meals || []
              meals
                .filter(meal => (meal.entries || []).length > 0)
                .map((meal, mi) => {
                  const entries = meal.entries || []
                  entries.map(entry => {
                    push(dispatch)(
                      `${NUTRITION_TRACKER_FORM}.meals[${mi}].entries`,
                      entry
                    )
                  })
                  submitTracker()
                })
              dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.isLoading`, false))
            })
            .catch(e => {
              logErrorWithMemberId(memberId => {
                dispatch(actions.change(`${NUTRITION_TRACKER_FORM}.isLoading`, false))
                alertCopyFailure(gqlFromDate)
                console.error(`MId:{${memberId}}, ${e}`)
                Sentry.captureException(
                  new Error(`MId:{${memberId}}, Scope:{copySelectedToDate}, ${e}`)
                )
              })
            })
        })
      }
    }
  }
}

const alertCopyFailure = date => {
  Alert.alert(
    `Couldn't copy from ${datePickerFormat(date)} \uD83D\uDE31`,
    "Something went wrong. Please try again later",
    [{ text: "OK", style: "destructive" }],
    { cancelable: false }
  )
}

const confirmCopyFrom = (date, cb) => {
  confirm(
    cb,
    "This will copy all meals",
    `Copy from ${datePickerFormat(date)}`,
    "Copy",
    "Cancel"
  )
}

const MEMBER_NUTRITION = gql`
  query MemberNutrition($date: Date!) {
    currentMember {
      id
      tracker: memberNutritionMetricsByMemberId(condition: { date: $date }) {
        nodes {
          id
          date
          body
        }
      }
    }
  }
`
const initialState = {
  currentlyOpenSwipeable: null,
  fixedHeader: false
}

const enhanced = compose(
  setDisplayName("Meals"),
  withApollo,
  withTrackerSubmit,
  withNavigation,
  withStateHandlers(initialState, {
    setOpenSwipeable: () => swipeable => ({ currentlyOpenSwipeable: swipeable }),
    reset: () => () => initialState,
    setFixedHeader: () => fixedHeader => ({ fixedHeader })
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProps(props => {
    const { meals, favourites, headerExpanded } = props
    const sections = meals.map((meal, index) => ({
      index,
      title: mealLabelByIndex(index),
      data: meal.entries.map(item => ({
        ...item,
        isFavourite: Boolean(favourites[extractItemId(item)])
      })),
      totals: mealTotals([meal])
    }))
    const hasMeals = sections.length > 0
    const scrollRangeForAnimation = headerExpanded ? 187 : 27
    return { sections, hasMeals, scrollRangeForAnimation }
  }),
  withState("scrollY", "setScrollY", () => new Animated.Value(0)),
  withProps(({ scrollY, scrollRangeForAnimation }) => ({
    animationRange: scrollY.interpolate({
      inputRange: [0, scrollRangeForAnimation],
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
    onScrollEndDrag: ({ setFixedHeader, scrollRangeForAnimation }) => event => {
      const position = event.nativeEvent.contentOffset.y

      if (position > scrollRangeForAnimation) {
        setFixedHeader(true)
      } else {
        setFixedHeader(false)
      }
    },
    onItemPress: props => (item, index, section) => {
      const { navigation } = props
      const mealIndex = section.index
      navigation.navigate(routes.FoodItem, {
        context: FOOD_ITEM_CONTEXT_TRACKER,
        item,
        index,
        mealIndex
      })
    },
    onButtonActionPress: props => actionName => {
      const { dispatch, navigation, date, client, sections } = props
      if (actionName === "mealSearch") {
        const mealIndex = sections.length
        navigation.navigate(routes.MealSearch, {
          date,
          onMealClick: meal => {
            dispatch(addItems(client, mealIndex, [meal]))
            navigation.pop()
          }
        })
      }
      if (actionName === "dayPlans") {
        navigation.navigate(routes.NutritionDayPlans, {
          date,
          onSelect: day => segueToDayAdd(client, dispatch, navigation.pop)(day.id)
        })
      }
      if (actionName === "clearDay") {
        const { clearDay } = props
        if (sections.length > 0) {
          confirm(
            clearDay,
            `Are you sure you want to delete all items?`,
            "Delete All Meals"
          )
        } else {
          clearDay()
        }
      }
    }
  }),
  getContext({ tooltipEvents: PropTypes.object })
)

export default enhanced(Meals)
