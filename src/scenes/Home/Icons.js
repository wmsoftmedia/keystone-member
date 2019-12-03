import {
  Circle,
  Defs,
  G,
  Path,
  Polygon,
  Polyline,
  Svg,
  Symbol,
  Text as SvgText,
  Use,
  Line
} from "react-native-svg"
import { View, Text } from "glamorous-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import MDCIcon from "react-native-vector-icons/MaterialCommunityIcons"
import MDIcon from "react-native-vector-icons/MaterialIcons"
import React from "react"
import Icon from "react-native-vector-icons/Ionicons"
import colors from "colors"

import Row from "../../components/Row"

const DEFAULT_SIZE = 36

export const HelpIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"ios-help-circle-outline"} size={size} style={{ color, ...rest.styles }} />
)

export const HomeIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-home"} size={size} style={{ color, ...rest.styles }} />
)

export const ProgressIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"emoticon-happy"} size={size} style={{ color, ...rest.styles }} />
)

export const MenuIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"menu"} size={size} style={{ color, ...rest.styles }} />
)

export const BodyIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-body"} size={size} style={{ color, ...rest.styles }} />
)

export const NutritionIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-nutrition"} size={size} style={{ color, ...rest.styles }} />
)

export const DoneIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"done"} size={size} style={{ color, ...rest.styles }} />
)

export const WeightIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"weight-kilogram"} size={size} style={{ color, ...rest.styles }} />
)

export const ProfileIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-person"} size={size} style={{ color, ...rest.styles }} />
)

export const FeedIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"format-list-bulleted"} size={size} style={{ color, ...rest.styles }} />
)

export const ShowIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"eye"} size={size} style={{ color, ...rest.styles }} />
)

export const HideIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"eye-off"} size={size} style={{ color, ...rest.styles }} />
)

export const DeleteIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"delete"} size={size} style={{ color, ...rest.styles }} />
)

export const ClearIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"clear"} size={size} style={{ color, ...rest.styles }} />
)

export const HistoryIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"history"} size={size} style={{ color, ...rest.styles }} />
)

export const GoalIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"bullseye"} size={size} style={{ color, ...rest.styles }} />
)

export const InvertedClearIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Ionicons name={"md-close-circle"} size={size} style={{ color, ...rest.styles }} />
)

export const CloseIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"close"} size={size} style={{ color, ...rest.styles }} />
)

export const CheckIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"check"} size={size} style={{ color, ...rest.styles }} />
)

export const ArrowUp = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"arrow-up"} size={size} style={{ color, ...rest.styles }} />
)

export const ArrowRightIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"arrow-right"} size={size} style={{ color, ...rest.styles }} />
)

export const CircleIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"circle-outline"} size={size} style={{ color, ...rest.styles }} />
)

export const CheckCircleIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"check-circle-outline"} size={size} style={{ color, ...rest.styles }} />
)

export const IosCheckCircleIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Ionicons name={"ios-checkmark-circle"} size={size} style={{ color, ...rest.styles }} />
)

export const IosCheckmarkIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Ionicons name={"ios-checkmark"} size={size} style={{ color, ...rest.styles }} />
)

export const IIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"ios-information"} size={size} style={{ color, ...rest.styles }} />
)

export const InfoIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon
    name={"ios-information-circle-outline"}
    size={size}
    style={{ color, ...rest.styles }}
  />
)

export const FromToArrowIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"ios-arrow-round-forward"} size={size} style={{ color, ...rest.styles }} />
)

export const StatsIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-stats"} size={size} style={{ color, ...rest.styles }} />
)

export const LocationIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-pin"} size={size} style={{ color, ...rest.styles }} />
)

export const NoDataIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"do-not-disturb"} size={size} style={{ color, ...rest.styles }} />
)

export const PauseIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"pause-circle-outline"} size={size} style={{ color, ...rest.styles }} />
)

export const PlayIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"play-circle-outline"} size={size} style={{ color, ...rest.styles }} />
)

export const PauseIcon2 = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"pause"} size={size} style={{ color, ...rest.styles }} />
)

export const PlayIcon2 = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"play-arrow"} size={size} style={{ color, ...rest.styles }} />
)

export const TimerIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"timer"} size={size} style={{ color, ...rest.styles }} />
)

export const NoteIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"note-text"} size={size} style={{ color, ...rest.styles }} />
)

export const DownIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Ionicons name={"ios-arrow-down"} size={size} style={{ color, ...rest.styles }} />
)

export const BackIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"chevron-left"} size={size} style={{ color, ...rest.styles }} />
)

export const ForwardIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"chevron-right"} size={size} style={{ color, ...rest.styles }} />
)

export const ChevDownIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"chevron-down"} size={size} style={{ color, ...rest.styles }} />
)

export const AddIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"add"} size={size} style={{ color, ...rest.styles }} />
)

export const AddCircleIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"add-circle-outline"} size={size} style={{ color, ...rest.styles }} />
)

export const RemoveIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"remove"} size={size} style={{ color, ...rest.styles }} />
)

export const EditItemIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"pencil"} size={size} style={{ color, ...rest.styles }} />
)

export const InfinityIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"infinity"} size={size} style={{ color, ...rest.styles }} />
)

export const AddFoodIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Row justifyContent="center">
    <Icon
      style={{ zIndex: 100, backgroundColor: "transparent" }}
      name={"md-nutrition"}
      size={size}
      color={color}
    />
    <Text zIndex={99} marginLeft={-2} color={color} fontWeight="900">
      +
    </Text>
  </Row>
)

export const AddMealIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Row justifyContent="center">
    <MDIcon
      style={{ zIndex: 100, backgroundColor: "transparent" }}
      name={"restaurant"}
      size={size}
      color={color}
    />
    <Text zIndex={99} marginLeft={-2} color={color} fontWeight="900">
      +
    </Text>
  </Row>
)

export const WorkoutSequenceIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"format-list-bulleted"} size={size} style={{ color, ...rest.styles }} />
)

export const CopyIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"content-copy"} size={size} style={{ color, ...rest.styles }} />
)

export const UpdateIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"update"} size={size} style={{ color, ...rest.styles }} />
)

export const CancelIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDCIcon name={"cancel"} size={size} style={{ color, ...rest.styles }} />
)

export const BarcodeIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-barcode"} size={size} style={{ color, ...rest.styles }} />
)

export const SearchIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"md-search"} size={size} style={{ color, ...rest.styles }} />
)
// ---------------- SVG

const editFoodSvg = {
  path: `M21.7,14.6L19.5,13c0-0.1,0.1-0.3,0-1c0,0,0-0.2,0-0.5c0-0.1,0-0.4,0-0.5l2-1.6c0.1-0.1,0.3-0.3,0.1-0.7l-2-3.4
		c-0.1-0.1-0.2-0.4-0.6-0.2l-2.5,1c-0.3-0.2-1-0.7-1.7-1l-0.3-2.6c0-0.1-0.1-0.4-0.5-0.4h-4c-0.2,0-0.5,0-0.5,0.4L9.1,5.1
		c-0.2,0.1-0.5,0.2-1.7,1l-2.6-1C4.6,5,4.4,4.9,4.1,5.3l-2,3.4c0,0.1-0.2,0.4,0.1,0.7L4.4,11c0,0.1,0,0.2,0,0.5c0,0.1,0,0.3,0,0.5
		c0,0,0,0.2,0,0.5c0,0.1,0,0.4,0,0.5l-2.1,1.6c-0.1,0.1-0.3,0.3-0.1,0.7l2,3.4c0.1,0.1,0.2,0.4,0.6,0.2l2.6-1c0.3,0.2,1,0.7,1.7,1
		l0.4,2.6c0,0.1,0.1,0.4,0.5,0.4h4c0.1,0,0.4,0,0.5-0.4l0.4-2.6c0.2-0.1,0.5-0.2,1.7-1l2.6,1c0.2,0.1,0.4,0.2,0.6-0.2l2-3.4
		C21.9,15.1,22,14.9,21.7,14.6z M14.1,12.8l-5.2,3.7c-0.3,0.2-0.5,0.2-0.6,0.2c-0.4,0-0.6-0.2-0.7-0.3c-0.3-0.3-0.3-0.5-0.3-0.7
		c0-0.2,0.1-0.4,0.1-0.5v0L11,9.5c0.3-0.4,0.6-0.4,0.8-0.4c0.3,0,0.5,0.1,0.6,0.2l1.8,1.9c0.3,0.3,0.3,0.5,0.3,0.7
		C14.5,12.5,14.2,12.7,14.1,12.8z M14.2,10.5l-1-0.9l1.5-2.9l1.1,0.6l-0.7,1.3L16,8.1l0.6,1.1L14.2,10.5z`
}

export const EditFoodIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg height={size} width={size} scale={1}>
    <Path d={editFoodSvg.path} fill={color} scale={size / 24} />
  </Svg>
)

const chefHatSvg = {
  path: `M 4.349575,20.748691 H 19.99877 v 2.25088 H 4.349575 Z m 0,-10.37009 H 19.99877 v 9.27147 H 4.349575 Z M 1,9.0388007
    c 0,-3.081558 2.5188791,-5.573608 5.600486,-5.573608 3.081608,0 5.573686,2.49205 5.573686,5.573608 0,3.0815403
    -2.492078,5.5735803 -5.573686,5.5735803 C 3.5188791,14.612381 1,12.120341 1,9.0388007 Z m 5.252132,-2.465264 c 0,-3.08154
    2.492081,-5.57357185 5.573695,-5.57357185 3.108407,0 5.600493,2.49203185 5.600493,5.57357185 0,3.08158 -2.492086,5.6003943
    -5.600493,5.6003943 -3.081614,0 -5.573695,-2.5188143 -5.573695,-5.6003943 z m 5.573695,0 c 0,-3.08154 2.518869,-5.57357185
    5.600493,-5.57357185 3.0816,0 5.57368,2.49203185 5.57368,5.57357185 0,3.08158 -2.49208,5.6003943 -5.57368,5.6003943
    -3.081624,0 -5.600493,-2.5188143 -5.600493,-5.6003943 z`
}

export const ChefHatIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg height={size} width={size} scale={1}>
    <Path d={chefHatSvg.path} fill={color} scale={size / 24} />
  </Svg>
)

const mealSvg = {
  path: `M23,12c0-6.1-4.9-11-11-11S1,5.9,1,12c0,2.8,1,5.3,2.7,7.2l0.1,0.1v-1.9c-0.6-0.1-0.9-0.6-1-0.9c-0.4-0.8-0.4-1.6-0.4-2
		l0.2-5.1h0.4l0.2,5.1h0.8l0.2-5.1h0.4l0.2,5.1h0.8l0.2-5.1h0.4l0.2,5.1c0,1.2-0.3,1.7-0.4,2c-0.4,0.8-0.8,0.9-1,0.9v2.9L5,20.5
		c1.9,1.6,4.3,2.5,7,2.5c3.2,0,6.1-1.4,8.1-3.6v-2.7h-1.3c0-5.1,2.2-7.7,2.5-7.7v8.7C22.4,16.1,23,14.1,23,12z`
}

export const MealIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg height={size} width={size} scale={1}>
    <Path d={mealSvg.path} fill={color} scale={size / 24} />
  </Svg>
)

const manageMealSvg = {
  path: `M 23,12 C 23,5.9 18.1,1 12,1 5.9,1 1,5.9 1,12 c 0,2.8 1,5.3 2.7,7.2 l 0.1,0.1 V 17.4 C 3.2,17.3 2.9,16.8 2.8,16.5 2.4,15.7 2.4,14.9 2.4,14.5 L 2.6,9.4 H 3 l 0.2,5.1 H 4 L 4.2,9.4 h 0.4 l 0.2,5.1 H 5.6 L 5.8,9.4 h 0.4 l 0.2,5.1 c 0,1.2 -0.3,1.7 -0.4,2 -0.4,0.8 -0.8,0.9 -1,0.9 v 2.9 0.2 c 1.9,1.6 4.3,2.5 7,2.5 3.2,0 6.1,-1.4 8.1,-3.6 V 16.7 H 18.8 C 18.8,11.6 21,9 21.3,9 v 8.7 C 22.4,16.1 23,14.1 23,12 Z m -6.4,1.7 -0.9,1.5 c -0.1,0.2 -0.2,0.1 -0.3,0.1 l -1.2,-0.4 c -0.5,0.4 -0.7,0.4 -0.8,0.4 l -0.2,1.2 c 0,0.2 -0.2,0.2 -0.2,0.2 H 11.2 C 11,16.7 11,16.6 11,16.5 L 10.8,15.3 C 10.5,15.2 10.2,14.9 10,14.9 l -1,0.4 c -0.2,0.1 -0.2,0 -0.3,-0.1 L 7.8,13.7 c -0.1,-0.2 0,-0.3 0,-0.3 l 0.9,-0.7 c 0,0 0,-0.2 0,-0.2 0,-0.1 0,-0.2 0,-0.2 0,-0.1 0,-0.2 0,-0.2 0,-0.1 0,-0.2 0,-0.2 l -1,-0.7 c -0.1,-0.1 0,-0.3 0,-0.3 L 8.6,9.4 C 8.8,9.1 8.9,9.1 9,9.1 l 1.2,0.4 C 10.7,9.1 10.9,9.1 11,9.1 L 11.1,8 c 0,-0.2 0.1,-0.2 0.2,-0.2 h 1.8 c 0.2,0 0.2,0.1 0.2,0.2 l 0.1,1.2 c 0.3,0.1 0.6,0.4 0.8,0.4 l 1.1,-0.4 c 0.2,-0.1 0.2,0 0.3,0.1 l 0.9,1.5 c 0.1,0.2 0,0.3 0,0.3 l -0.9,0.7 c 0,0 0,0.2 0,0.2 0,0.1 0,0.2 0,0.2 0,0.3 0,0.4 0,0.4 l 1,0.7 c 0.1,0.2 0.1,0.3 0,0.4 z m -4.2,-2.6 c 0,0 -0.1,-0.1 -0.3,-0.1 -0.1,0 -0.2,0 -0.3,0.2 l -1.6,2.6 v 0 c 0,0 0,0.1 0,0.2 0,0.1 0,0.2 0.1,0.3 0,0 0.1,0.1 0.3,0.1 0.1,0 0.1,0 0.3,-0.1 l 2.3,-1.7 c 0,0 0.2,-0.1 0.2,-0.4 0,-0.1 0,-0.2 -0.1,-0.3 z M 13.2,11.5 14.3,11 14,10.5 13.7,10.7 14,10.1 13.5,9.8 12.8,11.1 Z`
}

export const ManageMealIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg height={size} width={size} scale={1}>
    <Path d={manageMealSvg.path} fill={color} scale={size / 24} />
  </Svg>
)

const basketSvg = {
  path1: `M1.6,8.5v-5c0-1.1,0.9-2,2-2h17c1.1,0,2,0.9,2,2v5h-0.8H1.6z`,
  path2: `M18.6,22H5.4c-1.1,0-1.9-0.8-2-1.9L3,11V7h18v4.1l-0.4,9C20.5,21.2,19.7,22,18.6,22z`,
  path3: `M20.8,4.4l-2.1,0.8l-0.7-0.8l1.5-2.2l0.9,0.6l-0.7,1l0.7-0.3L20.8,4.4z M18.7,5.8c0.2,0.2,0.1,0.5,0.1,0.6
		c-0.1,0.4-0.3,0.6-0.4,0.6L14,9.5c-0.3,0.1-0.4,0.1-0.5,0.1c-0.3,0-0.5-0.2-0.5-0.3c-0.2-0.3-0.1-0.5-0.1-0.6
		c0-0.2,0.1-0.3,0.1-0.3l0,0l3.4-4.2c0.2-0.3,0.6-0.2,0.7-0.2c0.2,0,0.4,0.2,0.5,0.3l0,0L18.7,5.8z`
}

export const BasketIcon = ({ color, size = DEFAULT_SIZE, num = "" }) => (
  <Svg height={size} width={size} scale={1}>
    <Path d={basketSvg.path1} fill="transparent" stroke={color} scale={size / 24} />
    <Path d={basketSvg.path2} fill={color} scale={size / 24} />
    <Path d={basketSvg.path3} fill={color} scale={size / 24} />
    <SvgText
      scale={size / 24}
      textAnchor="middle"
      x="12"
      y="18"
      fontSize="10"
      fill={num === 0 ? colors.white50 : colors.white}
      style="line-height: 1.25; font-family: sans-serif;"
    >
      {num}
    </SvgText>
  </Svg>
)

const addMealSvg = {
  path: `M23,12c0-6.1-4.9-11-11-11S1,5.9,1,12c0,2.8,1,5.3,2.7,7.2l0.1,0.1v-1.9c-0.6-0.1-0.9-0.6-1-0.9c-0.4-0.8-0.4-1.6-0.4-2
		l0.2-5.1H3l0.2,5.1H4l0.2-5.1h0.4l0.2,5.1h0.8l0.2-5.1h0.4l0.2,5.1c0,1.2-0.3,1.7-0.4,2c-0.4,0.8-0.8,0.9-1,0.9v2.9v0.2
		c1.9,1.6,4.3,2.5,7,2.5c3.2,0,6.1-1.4,8.1-3.6v-2.7h-1.3c0-5.1,2.2-7.7,2.5-7.7v8.7C22.4,16.1,23,14.1,23,12z M15,19.4h-2.5v2.5h-1
		v-2.5H9v-1h2.5v-2.5h1v2.5H15V19.4z`
}

export const AddKitchenMealIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg height={size} width={size} scale={1}>
    <Path d={addMealSvg.path} fill={color} scale={size / 24} />
  </Svg>
)

const mealPlanSvg = {
  path1: `M19,4c0.8,0,1.2,0.4,1.4,0.6C21,5.2,21,5.8,21,6v14c0,0.8-0.4,1.2-0.6,1.4C19.8,22,19.3,22,19,22H5c-0.8,0-1.2-0.4-1.4-0.6
		C3,20.8,3,20.3,3,20V6c0-0.8,0.4-1.2,0.6-1.4C4.2,4,4.7,4,5,4h1V2h2v2h8V2h2v2H19z M19,20V9H5v11H19z`,
  path2: `M16,12.5l-2.1,1l-0.8-0.7l1.3-2.3l1,0.5l-0.6,1l0.7-0.4L16,12.5z M13.9,14.2c0.2,0.2,0.2,0.4,0.2,0.5
		c0,0.4-0.2,0.6-0.3,0.7l-4.5,3c-0.3,0.1-0.4,0.1-0.5,0.1c-0.4,0-0.5-0.1-0.6-0.2C8,18.1,8,17.8,8,17.7c0-0.2,0.1-0.3,0.1-0.4v0
		l3.1-4.6c0.2-0.3,0.5-0.3,0.7-0.3c0.3,0,0.5,0.1,0.5,0.2l0,0L13.9,14.2z`
}

export const MealPlanIcon = ({ color, size = DEFAULT_SIZE, num = "" }) => (
  <Svg height={size} width={size} scale={1}>
    <Path d={mealPlanSvg.path1} fill={color} scale={size / 24} />
    <Path d={mealPlanSvg.path2} fill={color} scale={size / 24} />
  </Svg>
)

const workoutsSvg = {
  path1: `M2.7,12.7c-0.4,0-0.6-0.2-0.7-0.3c-0.3-0.3-0.3-0.6-0.3-0.7c0-0.4,0.2-0.6,0.3-0.7c0.3-0.3,0.6-0.3,0.7-0.3h4v2H2.7z
  M4.8,4.6C4.3,4.5,4.1,4.3,4,4.3C3.8,4,3.8,3.7,3.8,3.5c0-0.4,0.2-0.6,0.3-0.7c0.3-0.3,0.6-0.3,0.7-0.3h5v2.1H4.8z M3.7,8.7
 C3.3,8.7,3.1,8.5,3,8.4C2.7,8.1,2.7,7.8,2.7,7.7C2.7,7.2,2.9,7,3,6.9c0.3-0.3,0.6-0.3,0.7-0.3h3v2.1H3.7z M12.8,19.3l1-4.5l2.1,2.1
 V23h2v-7.7l-2.1-2.1l0.6-3.1c1.1,1.2,2,1.7,2.5,1.9c1.4,0.6,2.5,0.6,3,0.6v-2c-1.3,0-2.1-0.4-2.5-0.6c-1.2-0.6-1.6-1.4-1.8-1.8
 l-1-1.6C16.3,6.2,16,6,15.9,5.9c-0.5-0.3-0.8-0.3-1-0.3c-0.2,0-0.3,0-0.4,0.1c-0.2,0-0.3,0-0.4,0L8.8,8v4.8h2V9.3l1.8-0.7L11,16.9
 l-5-1.1l-0.4,2.1L12.8,19.3z M16.4,5.1c0.9,0,1.2-0.4,1.4-0.6c0.6-0.6,0.6-1.1,0.6-1.4c0-0.9-0.4-1.3-0.6-1.5C17.3,1,16.7,1,16.4,1
 c-0.9,0-1.2,0.4-1.4,0.6c-0.6,0.6-0.6,1.2-0.6,1.5c0,0.9,0.4,1.3,0.6,1.4C15.6,5.1,16.1,5.1,16.4,5.1z`
}

export const WorkoutsIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <View style={{ ...rest.styles }}>
    <Svg height={size} width={size} scale={1}>
      <Path d={workoutsSvg.path1} fill={color} scale={size / 24} />
    </Svg>
  </View>
)

const kataWorkoutsSvg = {
  path1: `M0,0H24V24H0Z`,
  path2: `M22.93,10.5c0-3.22-1.73-4.15-2.93-4.4V5H12V6H10V5H2v6h8V7h2v4h8V7.12c.94.27,1.93,1.09,1.93,3.38s-1,3.12-1.93,3.39V13H12v1H10V13H2v6h8V15h2v4h8V14.91C21.2,14.65,22.93,13.72,22.93,10.5ZM6,10A2,2,0,1,1,8,8,2,2,0,0,1,6,10Zm10,0a2,2,0,1,1,2-2A2,2,0,0,1,16,10ZM9,18H4.71v-.63a1.25,1.25,0,0,0,.37.1h.2a1.84,1.84,0,0,0,.43-.06,4.77,4.77,0,0,0,.62-.17c.25-.08.38-.12.63-.18A2.27,2.27,0,0,1,7.38,17h.2a1.23,1.23,0,0,1,.63.22V14.79a1.14,1.14,0,0,0-.63-.22h-.2a2.27,2.27,0,0,0-.42,0,5,5,0,0,0-.63.18,4.77,4.77,0,0,1-.62.17,1.84,1.84,0,0,1-.43.06,1.7,1.7,0,0,1-.7-.23H4.21v.29h0V18H3V14H9ZM4.71,16.82V15.4a1.76,1.76,0,0,0,.57.12,2.19,2.19,0,0,0,.53-.07,4.43,4.43,0,0,0,.58-.16l.09,0,.09,0c.18-.05.29-.09.49-.13a1.52,1.52,0,0,1,.32,0h.15l.18,0v1.45H7.38a3.07,3.07,0,0,0-.53.06c-.23.05-.37.1-.58.16l-.09,0-.09,0a3.51,3.51,0,0,1-.49.13,1.14,1.14,0,0,1-.32.05H5.13a.67.67,0,0,1-.31-.09ZM16,18a2,2,0,1,1,2-2A2,2,0,0,1,16,18Z`
}

export const KataWorkoutsIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <View style={{ ...rest.styles }}>
    <Svg height={size} width={size} scale={1}>
      <Path d={kataWorkoutsSvg.path1} fill="none" scale={size / 24} />
      <Circle cx={6} cy={8} r={1} fill={color} scale={size / 24} />
      <Circle cx={16} cy={8} r={1} fill={color} scale={size / 24} />
      <Circle cx={16} cy={16} r={1} fill={color} scale={size / 24} />
      <Path d={kataWorkoutsSvg.path2} fill={color} scale={size / 24} />
    </Svg>
  </View>
)

export const KataHistoryIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <View style={{ ...rest.styles }}>
    <Svg height={size} width={size} scale={1}>
      <Line
        x1={12}
        y1={12.5}
        x2={8.38}
        y2={6.22}
        fill="none"
        stroke={color}
        strokeMiterlimit={10}
        strokeWidth={1.5}
        opacity={0.3}
        scale={size / 24}
      />
      <Line
        x1={12}
        y1={12.5}
        x2={5.73}
        y2={8.87}
        fill="none"
        stroke={color}
        strokeMiterlimit={10}
        strokeWidth={1.5}
        opacity={0.15}
        scale={size / 24}
      />
      <Polyline
        points="15.5 14.5 12 12.5 12 5.25"
        fill="none"
        stroke={color}
        strokeMiterlimit={10}
        strokeWidth={1.5}
        scale={size / 24}
      />
      <Path d="M24,0H0V24H24Z" fill="none" scale={size / 24} />
      <Path
        d="M4.32,13h-2a9.77,9.77,0,1,0,.51-4.21L2.34,8l-.85.53,1.78,2.82L6.08,9.6l-.53-.85-.78.49A7.74,7.74,0,1,1,4.32,13Z"
        fill={color}
        scale={size / 24}
      />
    </Svg>
  </View>
)

export const TransferIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <MDIcon name={"compare-arrows"} size={size} style={{ color, ...rest.styles }} />
)

export const AccountDisabledIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Icon name={"ios-snow"} size={size} style={{ color, ...rest.styles }} />
)

const rateStarSvg = {
  path1: "M0 127.9h127.9V0H0v127.9z",
  path2:
    "M64 39.9l-5.1 13.7-1.3 3.5h-15l9.8 7.2 3 2.2-1.1 3.5-3.9 13.1L61 76l2.9-1.9L67 76l10.7 7.1L73.8 70l-1.1-3.5 3-2.2 9.6-7.2H70.6l-1.3-3.5L64 39.9m10 11.9h27.2L78.9 68.5 87 95.6 64 80.5 40.9 95.6 49 68.5 26.6 51.8h27.2L64 24.6l10 27.2z",
  path3:
    "M64 10.7L54 23.8l-2.2 2.7-3.4-.9-15.6-4.2-.9 16v3.2l-3.5 1.3-15.1 5.8L22.2 61l1.9 2.9-1.9 2.9-8.8 13.5 15.2 6 3.3 1.3v3.5l.9 16 15.6-4.2 3.4-.9 2.2 2.7 10 12.6 10-12.5 2.2-2.7 3.4.9 15.6 4.2.9-16v-3.5l3.3-1.3 15.1-5.8-8.8-13.5-1.9-2.9 1.9-2.9 8.8-13.5L99.4 42l-3.3-1.3v-3.5l-.7-16.5-15.6 4.2-3.4.9-2.2-2.7L64 10.7M78.2 20l22-5.9 1.1 22.7 21.3 8.2-12.4 19 12.4 19-21.3 8.2-1.1 22.7-22-5.9L64 125.6l-14.2-17.7-22 5.9-1.2-22.7L5.3 83l12.4-19L5.3 45l21.3-8.2 1.1-22.7 22 5.9L64 2.3 78.2 20z"
}

export const RateStarIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 128 128" height={size} width={size}>
    <Path d={rateStarSvg.path1} fill="none" />
    <Path d={rateStarSvg.path2} fill={color} />
    <Path d={rateStarSvg.path3} fill={color} />
  </Svg>
)

export const QuickAddIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg fill={"none"} viewBox="0 0 48 48" width={size} height={size}>
    <G>
      <G>
        <G>
          <G>
            <G>
              <G>
                <Path fill={"none"} d="M0,48h48V0H0V48z" />
              </G>
            </G>
            <G>
              <Path
                fill={color}
                d="M42.6,9.8l-3.2,1.8l2.8-5.2L37.6,4l-6,11.6l3.8,3.6l9.8-5.2L42.6,9.8z M28.4,15L28.4,15
						c-0.7-0.6-1.6-1-2.6-1c-1.2-0.1-2.4,0.4-3.2,1.4L8.4,38.2v0.2C8.2,39,8,39.6,8,40.2c0,1,0.3,2,1,2.8c0.8,0.6,1.8,1,2.8,1
						c0.9,0,1.8-0.2,2.6-0.8l20.8-15c0.4-0.2,1.4-1,1.4-3.2c0.1-1-0.3-2-1-2.8L28.4,15z"
              />
            </G>
            <Polygon fill={color} points="21.3,28 21.3,22.7 8,25.3" />
            <Polygon fill={color} points="17.3,33.3 17.3,28 4,30.7" />
            <Polygon fill={color} points="13.3,38.7 13.3,33.3 0,36 " />
            <Polygon fill={color} points="25.3,22.7 25.3,17.3 12,20" />
            <G>
              <Path
                fill={color}
                d="M42.6,9.8l-3.2,1.8l2.8-5.2L37.6,4l-6,11.6l3.8,3.6l9.8-5.2L42.6,9.8z"
              />
            </G>
            <G>
              <G>
                <Line
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  x1="39"
                  y1="46.4"
                  x2="39"
                  y2="30.4"
                />
                <Line
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  x1="47"
                  y1="38.4"
                  x2="31"
                  y2="38.4"
                />
              </G>
            </G>
          </G>
        </G>
      </G>
    </G>
  </Svg>
)

export const SearchFoodIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <G>
      <G>
        <G>
          <G>
            <Path fill="none" d="M0,48h48V0H0V48z" />
          </G>
        </G>
        <G>
          <Path
            fill={color}
            d="M36.6,9.8l-3.2,1.8l2.8-5.2L31.6,4l-6,11.6l3.8,3.6l9.8-5.2L36.6,9.8z M22.4,15L22.4,15c-0.7-0.6-1.6-1-2.6-1
				c-1.2-0.1-2.4,0.4-3.2,1.4L2.4,38.2v0.2C2.2,39,2,39.6,2,40.2c0,1,0.3,2,1,2.8c0.8,0.6,1.8,1,2.8,1c0.9,0,1.8-0.2,2.6-0.8
				l20.8-15c0.4-0.2,1.4-1,1.4-3.2c0.1-1-0.3-2-1-2.8L22.4,15z"
          />
        </G>
      </G>
      <G>
        <Path
          fill={color}
          d="M48,46.3L46.3,48l-5.7-5.7v-0.9l-0.3-0.3c-2.7,2.3-6.6,2.4-9.3,0.1c-3.1-2.5-3.5-7.1-0.9-10.1s7.1-3.5,10.1-0.9
			c3.1,2.5,3.5,7.1,0.9,10.1l0.3,0.3h0.9L48,46.3z M35.4,40.6c2.8,0,5.1-2.3,5.1-5.1c0,0,0,0,0,0c0-2.8-2.3-5.2-5.2-5.2
			s-5.2,2.3-5.2,5.2C30.3,38.3,32.6,40.6,35.4,40.6C35.4,40.6,35.4,40.6,35.4,40.6z"
        />
      </G>
    </G>
  </Svg>
)

export const DeleteMealIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G>
      <Path fill="none" d="M0,0h24v24H0V0z" />
    </G>
    <G>
      <G>
        <Path
          fill={color}
          d="M8.9,1.7L8.5,8.8H6.8L6.4,1.7H5.6L5.2,8.8H3.6L3.2,1.7H2.4L2,8.8l0,0c0,0.5,0,1.6,0.9,2.8C3.2,12,3.7,12.7,5,12.8V22h2
			v-9.1c0.4,0,1.3-0.1,2.2-1.3c0.3-0.4,0.9-1.2,0.9-2.8L9.6,1.7H8.9z"
        />
        <Path fill={color} d="M11,13.9h2V22h2V1.7C14.5,1.7,11,5.8,11,13.9z" />
      </G>
    </G>
    <G>
      <G />
      <G>
        <G>
          <G>
            <G>
              <Line
                fill="none"
                stroke={color}
                strokeWidth={2}
                class="st1"
                x1="16.5"
                y1="12"
                x2="22.5"
                y2="12"
              />
            </G>
          </G>
        </G>
      </G>
      <G />
    </G>
  </Svg>
)

export const CreateMealIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G>
      <Path fill="none" d="M0,0h24v24H0V0z" />
    </G>
    <G>
      <G>
        <Path
          fill={color}
          d="M8.9,1.7L8.5,8.8H6.8L6.4,1.7H5.6L5.2,8.8H3.6L3.2,1.7H2.4L2,8.8l0,0c0,0.5,0,1.6,0.9,2.8C3.2,12,3.7,12.7,5,12.8V22h2
			v-9.1c0.4,0,1.3-0.1,2.2-1.3c0.3-0.4,0.9-1.2,0.9-2.8L9.6,1.7H8.9z"
        />
        <Path fill={color} d="M11,13.9h2V22h2V1.7C14.5,1.7,11,5.8,11,13.9z" />
      </G>
    </G>
    <G>
      <G />
      <G>
        <G>
          <G>
            <G>
              <Line
                fill="none"
                stroke={color}
                strokeWidth={2}
                class="st1"
                x1="16.5"
                y1="12"
                x2="22.5"
                y2="12"
              />
            </G>
          </G>
        </G>
        <G>
          <G>
            <G>
              <Line
                fill="none"
                stroke={color}
                strokeWidth={2}
                x1="16.5"
                y1="12"
                x2="22.5"
                y2="12"
              />
            </G>
          </G>
        </G>
      </G>
      <G />
    </G>
  </Svg>
)

export const DifficultyIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 24 24" color={color} height={size} width={size}>
    <Path d="M0,24h24V0H0V24z" fill="none" />
    <Path
      d="M7.9,10c0-0.6,0.4-1,1-1s1,0.4,1,1s-0.4,1-1,1S7.9,10.6,7.9,10z"
      fill={color}
    />
    <Path
      d="M9.5,16c0-0.8,1.5-1.4,2.5-1.4s2.5,0.6,2.5,1.3c0,0.7-1.5,1.3-2.5,1.3S9.5,16.8,9.5,16z"
      fill={color}
    />
    <Path
      d="M14.1,10c0-0.6,0.4-1,1-1s1,0.4,1,1s-0.4,1-1,1S14.1,10.6,14.1,10z"
      fill={color}
    />
    <Path
      d="M20,4.7C20,3.6,22,0,22,0s2,3.6,2,4.7c0,1.1-0.9,2-2,2S20,5.8,20,4.7z"
      fill={color}
    />
    <Path
      d="M21,12.2L21,12.2c0,5-4,9-9,9s-9-4-9-9s4-9,9-9S21,7.2,21,12.2z M19.2,12.2C19.2,8.2,16,5,12,5 s-7.2,3.2-7.2,7.2S8,19.4,12,19.4C16,19.4,19.2,16.2,19.2,12.2z"
      fill={color}
    />
  </Svg>
)

export const HIITIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 84 92" width={size} height={size} color={color}>
    <Defs>
      <Symbol id="sym-a" viewBox="0 0 24 24">
        <G>
          <Path
            d="M11.3,4.4A8.51,8.51,0,0,0,4.7,7.1,8.46,8.46,0,0,0,2,13.7a8.67,8.67,0,0,0,1.2,4.6,8.63,8.63,0,0,0,3.4,3.4A7.94,7.94,0,0,0,11.3,23a8.51,8.51,0,0,0,6.6-2.7,8.46,8.46,0,0,0,2.7-6.6,8.51,8.51,0,0,0-2.7-6.6A8.46,8.46,0,0,0,11.3,4.4Zm0,16.3a7.1,7.1,0,1,1,7.1-7.1A7.1,7.1,0,0,1,11.3,20.7Z"
            fill={color}
          />
          <Path
            d="M7.9,3.7a11.35,11.35,0,0,1,3.4-.4,11.08,11.08,0,0,1,3.4.5c.1,0,.4.1.6-.1s.3-.2.1-.6c-.1-.2-.2-.5-.4-1,0-.1-.1-.3-.4-.5a.85.85,0,0,0-.5-.3,13.22,13.22,0,0,0-5.6,0,5.2,5.2,0,0,0-.5.3.62.62,0,0,0-.3.5c-.1.1-.1.1-.4,1-.1.1-.2.4,0,.5A.56.56,0,0,0,7.9,3.7Z"
            fill={color}
          />
          <Path
            d="M21.8,4.7a3.28,3.28,0,0,0-.6-.8,8.78,8.78,0,0,0-.8-.7.59.59,0,0,0-.5-.2.78.78,0,0,0-.6.3L17.4,5.2a7.87,7.87,0,0,1,1.4,1.1,5.63,5.63,0,0,1,1.1,1.3l1.9-1.9a.85.85,0,0,0,.2-.6A.4.4,0,0,0,21.8,4.7Z"
            fill={color}
          />
        </G>
        <G>
          <Circle cx="13.69" cy="9.5" r="1.5" fill={color} />
          <G>
            <Polygon
              points="12.57 16.45 10.57 16.53 10.64 11.36 13.96 13.12 12.57 16.45"
              fill={color}
            />
            <Path
              d="M16.42,13.33c-3.11,1.4-2.34-.55-3.65-1.39s-4,.19-4,.19v2"
              fill={"none"}
              stroke={color}
              strokeWidth={1.5}
            />
            <Polyline
              points="11.39 16.16 9 18.74 5.02 19.35"
              fill={"none"}
              stroke={color}
              strokeWidth={1.5}
            />
            <Path
              d="M11.39,16.16l3.06,1.5a.2.2,0,0,1,.07.3l-2.71,3.59"
              fill={"none"}
              stroke={color}
              strokeWidth={1.5}
            />
          </G>
          <Polygon points="4.07 11.5 10.64 11 10.64 12 4.07 11.5" fill={color} />
          <Polygon points="4.07 17.5 10.64 17 10.64 18 4.07 17.5" fill={color} />
          <Polygon points="4.07 15.5 10.64 15 10.64 16 4.07 15.5" fill={color} />
          <Polygon points="4.07 13.5 8.97 13.87 8.97 13.13 4.07 13.5" fill={color} />
        </G>
      </Symbol>
    </Defs>
    <G>
      <Use width="24" height="24" transform="scale(3.5)" href="#sym-a" />
    </G>
  </Svg>
)

export const ProductNutritionIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 48 48" color={color} height={size} width={size}>
    <Defs>
      <Symbol
        id="productNutritionIcon"
        data-name="icon - product nutrition info"
        viewBox="0 0 24 24"
      >
        <Path d="M0 0h24v24H0z" fill="none" />
        <G fill={color}>
          <Path d="M8 8h7.5v.5H8zM8 9h6.5v.5H8zM9 14h2v.5H9zM12.5 14h.5v.5h-.5zM13.5 14h.5v.5h-.5zM9 15h3v.5H9zM12.5 15h.5v.5h-.5zM13.5 15h.5v.5h-.5zM9 16h2v.5H9zM12.5 16h.5v.5h-.5zM13.5 16h.5v.5h-.5zM14.5 14h.5v.5h-.5zM14.5 15h.5v.5h-.5zM14.5 16h.5v.5h-.5zM14.71 18.5h.5V20h-.5zM13.21 18.5h.5V20h-.5zM15.46 18.5h.5v2h-.5zM13.96 18.5h.5v2h-.5zM12.46 18.5h.5v2h-.5zM9 13h3v.5H9zM12.5 13h.5v.5h-.5zM13.5 13h.5v.5h-.5zM14.5 13h.5v.5h-.5zM9 11h3v.5H9z" />
          <Path d="M17 4H7L6 6v16h12V6zm0 17H7V7h10z" />
          <Path d="M8 12v5.5h8V10H8zm.56-1.44h6.88v1.38H8.56zM8.5 12.5h7V17h-7z" />
          <Path d="M12.5 11h.5v.5h-.5zM13.5 11h.5v.5h-.5zM14.5 11h.5v.5h-.5z" />
        </G>
      </Symbol>
    </Defs>
    <Use width="24" height="24" transform="scale(2)" href="#productNutritionIcon" />
  </Svg>
)

export const ProductLabelIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 48 48" color={color} height={size} width={size}>
    <Defs>
      <Symbol id="a" data-name="icon - product box" viewBox="0 0 24 24">
        <Path d="M0 0h24v24H0z" fill="none" />
        <G fill={color}>
          <Path d="M17 4H7L6 6h12l-1-2zM18 11.92V6H6v16h12v-9zm-1-.7l-10 2.5v-1.94l10-2.5zM7 7h10v1.25l-10 2.5zm0 14v-6.25l10-2.5v.89c-.67.75-1.39 1.49-1.82 2s-1.35-.23-2.5.92l-.13.16c-2.46.11-4.39 1.14-4.39 2.4A6 6 0 0 0 8.68 21zm1.77-2.41c0-.76 1.39-1.59 3.38-1.78a1.39 1.39 0 0 0 0 1.53 6.55 6.55 0 0 0-3.06.93 1 1 0 0 1-.32-.68zm8.23.53l-.14.16a6.64 6.64 0 0 0-3.08-.93 2.57 2.57 0 0 0 .71-.51 2.28 2.28 0 0 0 .56-.81 3.8 3.8 0 0 1 1.95 1zm0-1.89a5.4 5.4 0 0 0-1.84-.8c0-.44-.05-.8.26-1.08L17 13.88z" />
        </G>
      </Symbol>
    </Defs>
    <Use width="24" height="24" transform="scale(2)" href="#a" />
  </Svg>
)

export const CameraIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 24 24" color={color} height={size} width={size}>
    <Defs>
      <Symbol id="a" data-name="icon - camera white" viewBox="0 0 24 24">
        <Path d="M0 0h24v24H0z" fill="none" />
        <Path
          d="M18.75 10.17a.6.6 0 0 0 .44-.19.57.57 0 0 0 0-.85.6.6 0 0 0-.88 0 .52.52 0 0 0-.19.42.54.54 0 0 0 .09.31.62.62 0 0 0 .22.22.55.55 0 0 0 .32.09zM12 17a4.2 4.2 0 0 0 2.27-.6 4.2 4.2 0 0 0 1.63-1.61 3.89 3.89 0 0 0 .6-2.16 3.92 3.92 0 0 0-1.32-3.09A4.17 4.17 0 0 0 12 8.26a4.14 4.14 0 0 0-3.18 1.28 3.91 3.91 0 0 0-1.32 3.09 3.94 3.94 0 0 0 1.32 3.09A4.17 4.17 0 0 0 12 17zm7.21-9.63a1.63 1.63 0 0 1 1.26.51A1.55 1.55 0 0 1 21 9.11V17a1.57 1.57 0 0 1-.53 1.23 1.65 1.65 0 0 1-1.26.51H4.79a1.63 1.63 0 0 1-1.26-.51A1.56 1.56 0 0 1 3 17V9.11a1.55 1.55 0 0 1 .53-1.23 1.65 1.65 0 0 1 1.26-.51H7a.67.67 0 0 0 .71-.51l.56-1.61A.51.51 0 0 1 8.38 5a.6.6 0 0 1 .26-.18.68.68 0 0 1 .3-.07h6.12a.65.65 0 0 1 .7.51l.56 1.61a.71.71 0 0 0 .29.35.63.63 0 0 0 .42.16zm-9.13 3.39A2.55 2.55 0 0 1 12 10a2.55 2.55 0 0 1 1.92.76 2.35 2.35 0 0 1 .79 1.85 2.35 2.35 0 0 1-.79 1.84 2.53 2.53 0 0 1-1.92.77 2.51 2.51 0 0 1-1.92-.77 2.33 2.33 0 0 1-.79-1.84 2.38 2.38 0 0 1 .79-1.85z"
          fill={color}
        />
      </Symbol>
    </Defs>
    <Use width="24" height="24" href="#a" />
  </Svg>
)

export const RetakeCameraIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 24 24" color={color} height={size} width={size}>
    <Defs>
      <Symbol id="a" data-name="icon - retake white" viewBox="0 0 24 24">
        <Path
          d="M1 12h2.76v-.23a8.84 8.84 0 0 1 2.89-6.66 8.69 8.69 0 0 1 6.7-2.76 8.82 8.82 0 0 1 6.83 2.83A8.79 8.79 0 0 1 23 12a8.78 8.78 0 0 1-2.82 6.82 8.79 8.79 0 0 1-6.83 2.83 8.57 8.57 0 0 1-5.87-2.07l1.65-1.75a6.56 6.56 0 0 0 4.22 1.38 6.57 6.57 0 0 0 5.1-2.11 6.55 6.55 0 0 0 2.12-5.1 6.55 6.55 0 0 0-2.12-5.1 6.57 6.57 0 0 0-5.1-2.11 6.56 6.56 0 0 0-5 2 6.57 6.57 0 0 0-2.18 5V12h3.14l-4.08 4.59z"
          fill={color}
          opacity={0.5}
        />
        <Path d="M0 0h24v24H0z" fill="none" />
        <Path
          d="M17.6 11a.39.39 0 0 0 .29-.12.38.38 0 0 0 0-.57.38.38 0 0 0-.29-.13.42.42 0 0 0-.3.13.35.35 0 0 0-.13.28.34.34 0 0 0 .06.21.5.5 0 0 0 .15.15.46.46 0 0 0 .22.05zm-4.5 4.56a2.8 2.8 0 0 0 1.51-.4A2.89 2.89 0 0 0 15.7 14a2.61 2.61 0 0 0 .4-1.45 2.65 2.65 0 0 0-.88-2.06 2.79 2.79 0 0 0-2.12-.85 2.81 2.81 0 0 0-2.13.85 2.63 2.63 0 0 0-.87 2.06 2.62 2.62 0 0 0 .9 2.1 2.78 2.78 0 0 0 2.1.86zm4.8-6.42a1.06 1.06 0 0 1 .84.34 1 1 0 0 1 .36.82v5.26a1.06 1.06 0 0 1-.36.82 1.1 1.1 0 0 1-.84.34H8.29a1.1 1.1 0 0 1-.84-.34 1.05 1.05 0 0 1-.35-.82v-5.31a1 1 0 0 1 .35-.82 1.1 1.1 0 0 1 .84-.34h1.45a.44.44 0 0 0 .47-.35l.38-1.07a.43.43 0 0 1 .09-.17.37.37 0 0 1 .18-.12.42.42 0 0 1 .2 0h4.07a.44.44 0 0 1 .47.34l.4 1.02a.45.45 0 0 0 .19.24.41.41 0 0 0 .28.11zm-6.08 2.26a1.69 1.69 0 0 1 1.28-.51 1.64 1.64 0 0 1 1.27.51 1.69 1.69 0 0 1 0 2.46 1.66 1.66 0 0 1-1.27.51 1.66 1.66 0 0 1-1.28-.51 1.69 1.69 0 0 1 0-2.46z"
          fill={color}
        />
      </Symbol>
    </Defs>
    <Use width="24" height="24" href="#a" />
  </Svg>
)

export const BlankTimerIcon = ({ color, size = DEFAULT_SIZE }) => (
  <Svg viewBox="0 0 24 24" color={color} height={size} width={size}>
    <Defs>
      <Symbol id="b" viewBox="0 0 24 24">
        <Path d="M0,0H24V24H0Z" fill="none" />
        <Path
          d="M7.26,2.08l-.58-.81L3.44,3.62,4,4.43l.81-.59L5.67,5c.52-.42,1.06-.81,1.62-1.18L6.45,2.67Z"
          fill={color}
        />
        <Path
          d="M11.25,3.29c.25,0,.5,0,.75,0s.5,0,.75,0a1.5,1.5,0,1,0-1.5,0ZM12,1.5a.5.5,0,1,1-.5.5A.5.5,0,0,1,12,1.5Z"
          fill={color}
        />
        <Path
          d="M16.74,2.08l.58-.81,3.24,2.35L20,4.43l-.81-.59L18.33,5c-.52-.42-1.06-.81-1.62-1.18l.84-1.15Z"
          fill={color}
        />
      </Symbol>
      <Symbol id="a" viewBox="0 0 24 24">
        <Path d="M0,0H24V24H0Z" fill="none" />
        <Path
          d="M12,3.25A8.75,8.75,0,1,1,3.25,12,8.76,8.76,0,0,1,12,3.25m0-1A9.75,9.75,0,1,0,21.75,12,9.76,9.76,0,0,0,12,2.25Z"
          fill={color}
        />
        <Path
          d="M12,4.25A7.75,7.75,0,1,1,4.25,12,7.76,7.76,0,0,1,12,4.25m0-2A9.75,9.75,0,1,0,21.75,12,9.76,9.76,0,0,0,12,2.25Z"
          fill={color}
        />

        <Path
          d="M12,2.25h0V12h9.75A9.75,9.75,0,0,0,12,2.25Z"
          fill={color}
          opacity={0.5}
        />
      </Symbol>
    </Defs>
    <Use width="24" height="24" href="#a" />
    <Use width="24" height="24" href="#b" />
  </Svg>
)

export const KSInfinityIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Svg viewBox="0 0 24 24" color={color} height={size} width={size}>
    <Path d="M0,0H24V24H0Z" fill="none" />
    <Path
      d="M18,7a5.3,5.3,0,0,0-3.47,1.39L8.12,14.13a3.15,3.15,0,0,1-2.19.93A3,3,0,0,1,2.83,12a3.1,3.1,0,0,1,3.1-3.15,3.15,3.15,0,0,1,2.19.93l1,.92,1.37-1.2-1.09-1A5,5,0,0,0,5.93,7a5,5,0,0,0,0,10A5.3,5.3,0,0,0,9.4,15.61L13.32,12l2.47-2.22A3.15,3.15,0,0,1,18,8.85a3.15,3.15,0,0,1,0,6.3,3.15,3.15,0,0,1-2.19-.93l-1-.92-1.37,1.2,1.19,1A5,5,0,1,0,18,7Z"
      fill={color}
    />
  </Svg>
)

export const TrainingProgramsIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Svg viewBox="0 0 24 24" color={color} height={size} width={size}>
    <Path d="M0,0H24V24H0Z" fill="none" />
    <Path
      d="M16,4V3H14V1H10V3H8V4H4V22H20V4ZM13.69,6,15,7.32l.67-.67.66.67L15.69,8,17,9.32l-.33.33L13.35,6.32ZM17,10.65l-.66.67L11.69,6.65,12.35,6ZM12,1.5a1,1,0,1,1-1,1A1,1,0,0,1,12,1.5ZM8.69,9.65l2,2,2-2-2-2L11.35,7,16,11.65l-.67.66-2-2-2,2,2,2-.67.67L8,10.32Zm-1,1,4.66,4.67-.66.66L7,11.32ZM9,21H5V18H9Zm-.65-5.68-.66-.67L8.35,14,7,12.65l.33-.33,3.34,3.33-.34.33L9,14.65ZM14,21H10V18h4Zm5,0H15V18h4Z"
      fill={color}
    />
  </Svg>
)

export const TrainingIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Svg viewBox="0 0 48 48" color={color} height={size} width={size}>
    <Polygon
      points="4 30.67 9.33 36 6.67 38.67 9.33 41.33 12 38.67 17.33 44 18.67 42.67 5.33 29.33 4 30.67"
      fill={color}
    />
    <Polygon points="4 25.33 22.67 44 25.33 41.33 6.67 22.67 4 25.33" fill={color} />
    <Polygon
      points="44 17.33 38.67 12 41.33 9.33 38.67 6.67 36 9.33 30.67 4 29.33 5.33 42.67 18.67 44 17.33"
      fill={color}
    />
    <Polygon
      points="18.66 10.65 26.67 18.67 18.67 26.67 10.68 18.68 8.01 21.34 26.68 40.01 29.34 37.34 21.33 29.33 29.33 21.33 37.32 29.32 39.99 26.66 21.32 7.99 18.66 10.65"
      fill={color}
    />

    <Polygon points="25.33 4 22.67 6.67 41.33 25.33 44 22.67 25.33 4" fill={color} />
    <Polygon points="48 0 48 48 0 48 0 0 48 0" fill="none" />
  </Svg>
)

// export const RestIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
//   <MDCIcon
//     name={"alarm-snooze"}
//     size={size}
//     style={{ color, ...rest.styles }}
//   />
// )

export const RestIcon = ({ color, size = DEFAULT_SIZE, ...rest }) => (
  <Svg viewBox="0 0 24 24" color={color} height={size} width={size}>
    <Path
      d="M19.75,12a7.73,7.73,0,0,0-1.82-5l-.74.74,1.88,1.88-.47.47L13.89,5.4l.47-.47,1.88,1.88L17,6.07A7.74,7.74,0,0,0,6.07,17l.74-.74L4.93,14.36l.47-.47,4.71,4.71-.47.47L7.76,17.19,7,17.93A7.74,7.74,0,0,0,19.75,12ZM12.47,4.93l6.6,6.6-.94.94-6.6-6.6ZM7.29,10.12l2.82,2.82,2.83-2.83L10.11,7.28l.94-.94,6.6,6.6-.94.94-2.82-2.82-2.83,2.83,2.83,2.83-.94.94-6.6-6.6ZM4.93,12.47l.94-.94,6.6,6.6-.94.94Z"
      fill={color}
      opacity={0.3}
    />
    <Path d="M0,0H24V24H0Z" fill="none" />
    <Polygon
      points="9.56 8.73 12.21 8.73 9.32 15.46 9.32 17 14.68 17 14.68 15.25 11.78 15.25 14.68 8.37 14.68 7 9.56 7 9.56 8.73"
      fill={color}
    />
    <Path
      d="M18.51,4.75l.66-.91.81.59.58-.81L17.32,1.27l-.58.81.81.59-.66.91a9.67,9.67,0,0,0-3.44-1.21,1.5,1.5,0,1,0-2.9,0A9.67,9.67,0,0,0,7.11,3.58l-.66-.91.81-.59-.58-.81L3.44,3.62,4,4.43l.81-.59.67.91a9.75,9.75,0,1,0,13,0ZM11.5,2a.5.5,0,0,1,1,0,.51.51,0,0,1-.09.27l-.41,0-.41,0A.51.51,0,0,1,11.5,2ZM12,19.75A7.75,7.75,0,1,1,19.75,12,7.76,7.76,0,0,1,12,19.75Z"
      fill={color}
    />
  </Svg>
)
