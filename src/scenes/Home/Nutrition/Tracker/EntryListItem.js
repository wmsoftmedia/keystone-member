import { Alert, Animated, Easing } from "react-native"
import { TouchableOpacity } from "glamorous-native"
import { compose, pure, withProps, withStateHandlers } from "recompose"
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React from "react"
import * as Sentry from "sentry-expo"
import Swipeable from "react-native-swipeable"

import { TrackerMealItemLine } from "components/FoodList/MealItemLine"
import { TrashIcon } from "kui/icons"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import _ from "lodash/fp"
import colors from "kui/colors"

const swiperAnimationConfig = {
  toValue: { x: 0, y: 0 },
  duration: 250,
  easing: Easing.elastic(0.5)
}

const defaultSwipeableProps = {
  swipeReleaseAnimationConfig: swiperAnimationConfig,
  swipeReleaseAnimationFn: Animated.timing,
  leftActionReleaseAnimationFn: Animated.timing,
  leftActionReleaseAnimationConfig: swiperAnimationConfig,
  rightActionReleaseAnimationFn: Animated.timing,
  rightActionReleaseAnimationConfig: swiperAnimationConfig
}

class EntryListItem extends React.Component {
  handleDelete = () => {
    this.swipeable.recenter(Animated.timing, swiperAnimationConfig, this.props.deleteItem)
  }

  addFavourite = () => {
    this.props.setLeftActionActive(true)
    this.swipeable.recenter(
      Animated.timing,
      swiperAnimationConfig,
      this.props.addFavourite
    )
  }

  handleLayout = event => {
    this.props.setLayout(event.nativeEvent.layout)
  }

  render() {
    const {
      index: i,
      item,
      section,
      isFavourite,
      layout,
      isRightActionActive,
      isLeftActionActive
    } = this.props
    const {
      onPress,
      onOpen,
      onSwipeStart,
      onSwipeRelease,
      setRightActionActive,
      setLeftActionActive
    } = this.props

    const rightButtons = [
      <TouchableOpacity
        key={1}
        flex={1}
        justifyContent={"center"}
        paddingLeft={20}
        backgroundColor={colors.red50}
        onPress={this.handleDelete}
        activeOpacity={0.7}
      >
        <TrashIcon
          size={30}
          color={isRightActionActive ? colors.white : colors.white50}
        />
      </TouchableOpacity>
    ]

    const starName = isLeftActionActive
      ? isFavourite
        ? "star-off"
        : "star"
      : isFavourite
      ? "star"
      : "star-outline"

    const leftButtons = [
      <TouchableOpacity
        key={1}
        flex={1}
        justifyContent={"center"}
        alignItems={"flex-end"}
        paddingRight={20}
        activeOpacity={0.7}
        backgroundColor={colors.green50}
        onPress={this.addFavourite}
        onPressIn={() => setLeftActionActive(true)}
        onPressOut={() => setLeftActionActive(false)}
      >
        <MCIcons name={starName} size={30} color={colors.white} />
      </TouchableOpacity>
    ]

    const itemStyles = [{ overflow: "hidden" }]
    const disableFavs =
      !item.meta.id ||
      _.getOr("", "origin", item) === "QUICK ADD" ||
      _.getOr("", "meta.source", item) === "macro"

    return (
      <Animated.View style={itemStyles} onLayout={this.handleLayout}>
        <Swipeable
          onRef={ref => (this.swipeable = ref)}
          rightButtons={rightButtons}
          leftButtons={disableFavs ? null : leftButtons}
          backgroundColor="transparent"
          onSwipeStart={onSwipeStart}
          onSwipeRelease={onSwipeRelease}
          onRightActionActivate={() => setRightActionActive(true)}
          onRightActionDeactivate={() => setRightActionActive(false)}
          onLeftActionActivate={() => setLeftActionActive(true)}
          onLeftActionDeactivate={() => setLeftActionActive(false)}
          rightActionActivationDistance={layout ? layout.width * 0.5 : 200}
          leftActionActivationDistance={layout ? layout.width * 0.5 : 200}
          onRightButtonsOpenRelease={onOpen}
          onRightButtonsCloseRelease={() => setRightActionActive(false)}
          onLeftButtonsOpenRelease={onOpen}
          onLeftButtonsCloseRelease={() => setLeftActionActive(false)}
          onRightActionComplete={this.props.deleteItem}
          onLeftActionComplete={this.props.addFavourite}
          {...defaultSwipeableProps}
        >
          <TrackerMealItemLine item={item} onPress={onPress(item, i, section)} />
        </Swipeable>
      </Animated.View>
    )
  }
}

const favouriteAddedAlert = added => itemLabel => cb => {
  const label = itemLabel.trim() === "" ? "Entry" : itemLabel.trim()
  Alert.alert(
    `${added ? "\u2b50 Added to" : "Removed from"} Favourites`,
    `${label} has been ${added ? "added to" : "removed from"} your favourites.`,
    [{ text: "Ok", onPress: cb }],
    { cancelable: true }
  )
}

const enhanced = compose(
  pure,
  withStateHandlers(
    { layout: null, isRightActionActive: false, isLeftActionActive: false },
    {
      setLayout: () => layout => ({ layout }),
      setRightActionActive: () => x => ({ isRightActionActive: x }),
      setLeftActionActive: () => x => ({ isLeftActionActive: x })
    }
  ),
  withProps(({ onDelete, section, index, ...rest }) => {
    return {
      isFavourite: rest.item.isFavourite ? true : false,
      deleteItem: () => onDelete(section.index)(index),
      addFavourite: () => {
        rest.addFavourite(!rest.item.isFavourite, rest.item).catch(e => {
          logErrorWithMemberId(memberId => {
            console.error(`MId:{${memberId}}, ${e}`)
            Sentry.captureException(
              new Error(`MId:{${memberId}}, Scope:{toggleFavourite}, ${e}`)
            )
          })
        })
        // This alert needs to happen immediately for better UX.
        // It is like optimistic response.
        // We assume that it works.
        favouriteAddedAlert(!rest.item.isFavourite)(rest.item.label || "")(() => {
          rest.setLeftActionActive(false)
        })
      }
    }
  })
)

export default enhanced(EntryListItem)
