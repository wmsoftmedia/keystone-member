import { TouchableOpacity } from "glamorous-native"
import React from "react"
import moment from "moment"

import { ChevronDownIcon } from "kui/icons"
import { Row } from "kui/components"
import { getDate } from "native"
import { getNavigationParam } from "keystone"
import { headerStyle } from "styles"
import { modalNavigationOptions } from "navigation/utils"
import { routes } from "navigation/routes"
import DismissModal from "scenes/Home/Nutrition/buttons/DismissModal"
import ExerciseLookup from "scenes/Home/ExerciseLookup"
import ExercisePopup from "scenes/Home/TrainingV3/TrainingScene/ExercisePopup"
import GoalsScene from "scenes/Home/TrainingV3/GoalsScene"
import HistoryScene from "scenes/Home/TrainingV3/HistoryScene"
import OverviewScene from "scenes/Home/TrainingV3/OverviewScene"
import PlanScene from "scenes/Home/TrainingV3/PlanScene"
import PlansScene from "scenes/Home/TrainingV3/PlansScene"
import SetPopup from "scenes/Home/TrainingV3/TrainingScene/SetPopup"
import StatsScene from "scenes/Home/TrainingV3/StatsScene"
import Text from "kui/components/Text"
import TrainingRateScene from "scenes/Home/TrainingV3/TrainingScene/TrainingRateScene"
import TrainingScene, { TrainingTitleActions } from "scenes/Home/TrainingV3/TrainingScene"
import TrainingSummaryScene from "scenes/Home/TrainingV3/TrainingScene/TrainingSummaryScene"
import TrainingTitle from "scenes/Home/TrainingV3/TrainingScene/TrainingTitle"
import WorkoutsScene from "scenes/Home/TrainingV3/WorkoutsScene"
import ExerciseInfo from "scenes/Home/TrainingV3/ExerciseInfo"
import ExercisesScene from "scenes/Home/TrainingV3/ExercisesScene"
import colors from "kui/colors"

export const trainingRoutes = {
  WorkoutsScene: {
    screen: ({ navigation, ...rest }) => {
      return <WorkoutsScene date={getDate(navigation)} {...rest} />
    },
    path: "/workouts",
    navigationOptions: {
      title: "Workouts"
    }
  },
  PlansScene: {
    screen: ({ navigation, ...rest }) => {
      return <PlansScene date={getDate(navigation)} {...rest} />
    },
    path: "/plans",
    navigationOptions: {
      title: "Plans"
    }
  },
  StatsScene: {
    screen: ({ navigation, ...rest }) => {
      return <StatsScene date={getDate(navigation)} {...rest} />
    },
    path: "/stats",
    navigationOptions: () => {
      return {
        headerTransparent: true,
        headerStyle: { ...headerStyle, backgroundColor: colors.transparent },
        headerLeft: <DismissModal />
      }
    }
  },
  HistoryScene: {
    screen: ({ navigation, ...rest }) => {
      return <HistoryScene date={getDate(navigation)} {...rest} />
    },
    path: "/stats",
    navigationOptions: ({ navigation }) => {
      const date = getNavigationParam(navigation, "date") || undefined
      const month = moment(date).format("MMMM")
      return {
        headerTitle: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MonthPicker", {
                date,
                onMonthSelect: selectedDate =>
                  navigation.setParams({ date: selectedDate })
              })
            }
          >
            <Row centerY>
              <Text variant="h2" paddingRight={4}>
                {month}
              </Text>
              <ChevronDownIcon color={colors.darkBlue40} size={20} />
            </Row>
          </TouchableOpacity>
        )
      }
    }
  },
  GoalsScene: {
    screen: ({ navigation, ...rest }) => {
      return <GoalsScene date={getDate(navigation)} {...rest} />
    },
    path: "/stats",
    navigationOptions: () => {
      return {
        headerTransparent: true,
        headerStyle: { ...headerStyle, backgroundColor: colors.transparent },
        headerLeft: <DismissModal />
      }
    }
  },
  PlanScene: {
    screen: ({ navigation, ...rest }) => {
      const params = navigation.state.params
      return <PlanScene date={getDate(navigation)} {...params} {...rest} />
    },
    path: "/plan",
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params
      return {
        title: params.assignedPlanName || "Training plan"
      }
    }
  },
  [routes.ExercisesScene]: {
    screen: ExercisesScene,
    path: "/exercises",
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params
      return {
        title: params && params.title ? params.title : "Exercise History"
      }
    }
  },
  [routes.WorkoutScene]: {
    screen: OverviewScene,
    path: "/workout",
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params
      return {
        title: params.title ? params.title : "Workout"
      }
    }
  },
  [routes.OverviewScene]: {
    screen: OverviewScene,
    path: "/workout/overview",
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params
      return {
        ...modalNavigationOptions,
        title: params.title ? params.title : "Workout Overview"
      }
    }
  },
  TrainingScene: {
    screen: ({ navigation, ...rest }) => {
      const params = navigation.state.params
      return <TrainingScene date={getDate(navigation)} {...params} {...rest} />
    },
    path: "/workout/training",
    navigationOptions: ({ navigation }) => {
      const onFinish = getNavigationParam(navigation, "onFinish")
      const workout = getNavigationParam(navigation, "workout")
      const updateModelTimer = getNavigationParam(navigation, "updateModelTimer")
      const canDrawHeader = !!workout && !!updateModelTimer
      return {
        headerTitle: !canDrawHeader ? null : (
          <TrainingTitle workout={workout} updateModelTimer={updateModelTimer} />
        ),
        headerRight: <TrainingTitleActions onFinish={onFinish} />
      }
    }
  },
  TrainingRateScene: {
    screen: ({ navigation, ...rest }) => {
      return (
        <TrainingRateScene
          date={getDate(navigation)}
          {...navigation.state.params}
          {...rest}
        />
      )
    },
    path: "/workout/trainingRate",
    navigationOptions: {
      title: "Session Feedback"
    }
  },
  TrainingSummaryScene: {
    screen: ({ navigation, ...rest }) => {
      return (
        <TrainingSummaryScene
          date={getDate(navigation)}
          {...navigation.state.params}
          {...rest}
        />
      )
    },
    path: "/workout/trainingSummary",
    navigationOptions: () => {
      return {
        title: "Workout Summary"
      }
    }
  },
  [routes.ExercisePopup]: {
    screen: ExercisePopup,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params
      const title =
        params.colRounds && params.roundIndex >= 0
          ? "Set " + (params.roundIndex + 1) + "/" + params.colRounds
          : "Exercise details"
      return {
        ...modalNavigationOptions,
        title: title
      }
    }
  },
  [routes.ExerciseLookup]: {
    screen: ExerciseLookup,
    path: "/exercise-lookup",
    navigationOptions: {
      title: "Exercise Log"
    }
  },
  [routes.SetPopup]: {
    screen: SetPopup,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params
      return {
        ...modalNavigationOptions,
        title: params.title ? params.title : ""
      }
    }
  },
  [routes.ExerciseInfo]: {
    screen: ExerciseInfo,
    navigationOptions: {
      ...modalNavigationOptions,
      title: "Exercise Info"
    }
  }
}
