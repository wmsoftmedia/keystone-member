import { Pedometer } from "expo-sensors"
import { View, TouchableOpacity } from "glamorous-native"
import { useNavigationParam, useNavigation } from "react-navigation-hooks"
import React, { useState, useEffect } from "react"
import moment from "moment"

import { DEFAULT_STEP_GOAL } from "constants"
import { GaugeWithTarget } from "kui/components/Gauge"
import { PlusIcon } from "kui/icons"
import { homeRoutes } from "navigation/routes"
import { isIOS } from "native"
import kui from "kui"

export const STEP_GOAL = DEFAULT_STEP_GOAL

const Steps = props => {
  const [subscription, setSubscription] = useState(null)
  const [currentSteps, setCurrentSteps] = useState(0)
  const [pastSteps, setPastSteps] = useState(0)

  const date = useNavigationParam("date")
  const nav = useNavigation()

  const steps = props.steps ? props.steps : pastSteps

  useEffect(() => {
    if (!isIOS) {
      return
    }

    setSubscription(
      Pedometer.watchStepCount(result => {
        setCurrentSteps(result.steps)
      })
    )

    getSteps(date)

    return function cleanup() {
      if (subscription) {
        subscription.remove(), setSubscription(null)
      }
    }
  }, [date])

  const getSteps = date => {
    const start = moment(date).toDate()
    const end = moment(date)
      .endOf("date")
      .toDate()

    Pedometer.getStepCountAsync(start, end).then(
      result => {
        setPastSteps(result.steps)
      },
      () => {
        //console.warn(error)
      }
    )
  }

  return (
    <View {...props}>
      <GaugeWithTarget
        label="DAILY STEPS"
        value={steps}
        target={STEP_GOAL}
        targetColor={kui.colors.darkBlue40}
        hasTarget={true}
        disableWarning
        progressCircleProps={{
          strokeWidth: 8,
          backgroundColor: kui.colors.darkBlue60
        }}
        renderSuffix={() => (
          <TouchableOpacity
            onPress={() =>
              nav.navigate(homeRoutes.StepNavigator, {
                mobileSteps: pastSteps,
                date
              })
            }
          >
            <PlusIcon size={24} />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default Steps
