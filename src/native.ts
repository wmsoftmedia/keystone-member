import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  PanResponderCallbacks,
  Platform,
} from "react-native";
import { NavigationProp } from "react-navigation";
import { TransitionConfig, HeaderTransitionConfig } from "react-navigation-stack/src/types";

import { getNavigationParam, gqlDate, today } from "keystone";
import { gradients } from "kui/colors";

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const confirm = (
  positiveCb: () => void,
  message = "",
  title = "Are You Sure?",
  positiveText = "Yes",
  negativeText = "No",
) =>
  Alert.alert(
    title,
    message,
    [
      {
        text: negativeText,
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: positiveText, onPress: positiveCb, style: "destructive" },
    ],
    { cancelable: true },
  );

export const horizontalTransitionConfig = (): TransitionConfig & HeaderTransitionConfig => ({
  transitionSpec: {
    // @ts-ignore
    duration: 300,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: (sceneProps) => {
    const { layout, position, scene } = sceneProps;
    const { index } = scene;

    const x = layout.initWidth;
    const translateX = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [x, 0, 0],
    });

    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.99, index],
      outputRange: [1, 1, 1],
    });

    return {
      backgroundColor: gradients.bg1[0],
      opacity,
      transform: [{ translateX }],
    };
  },
});

// (transitionProps: TransitionProps, prevTransitionProps?: TransitionProps, isModal?: boolean) =>
//   TransitionConfig & HeaderTransitionConfig;
// @ts-ignore
export const verticalTransitionConfig = (transition, prevTransition, isModal, isPopup) => {
  return {
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
    },
    // @ts-ignore
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;

      const height = layout.initHeight;
      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0],
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1],
      });

      return {
        opacity,
        transform: [{ translateY }],
      };
    },
  };
};

export const window = Dimensions.get("window");

export const getDate = (navigation: NavigationProp<any>) =>
  gqlDate(getNavigationParam(navigation, "date") || today());

// GESTURES -------------------------------------------------------------------

export const createPanResponder = (config: PanResponderCallbacks) =>
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderTerminate: () => true,
    onShouldBlockNativeResponder: () => true,
    onPanResponderMove: () => true,
    onPanResponderRelease: () => true,
    ...config,
  });
