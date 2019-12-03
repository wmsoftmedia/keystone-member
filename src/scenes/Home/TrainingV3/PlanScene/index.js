import { compose, withProps, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet } from "react-native"
import React from "react"
import { View } from "glamorous-native"
import _ from "lodash/fp"
import moment from "moment"

import { routes } from "navigation/routes"
import { today } from "keystone"
import { withLoader } from "hoc"
import { withAssignedTrainingPlan } from "graphql/query/training/assignedPlanById"
import SlotList from "scenes/Home/TrainingV3/PlanScene/SlotList"
import NoData from "components/NoData"
import colors, { gradients } from "kui/colors"
import Label from "kui/components/Label"
import Text from "kui/components/Text"
import { Row } from "kui/components"

const LabelText = p => <Text variant="caption1" color={colors.darkBlue30} {...p} />

const PlanSceneBase = props => {
  const { plan, handleRefresh, onClick } = props

  const daysUntil = _.getOr(0, "plan.daysUntil", props)
  const daysLeft = _.getOr(0, "plan.daysLeft", props)

  const label =
    daysUntil > 0
      ? "Starts in " + daysUntil + " " + (daysUntil === 1 ? "day" : "days")
      : daysLeft > 0
      ? daysLeft + (daysLeft === 1 ? " day" : " days") + " left"
      : ""

  return (
    <View flex={1}>
      {plan ? (
        <View flex={1}>
          <Row
            paddingHorizontal={20}
            alignItems="center"
            justifyContent="space-between"
            paddingTop={16}
          >
            <LabelText paddingBottom={2}>
              {moment(plan.startDate).format("dd, DD MMM")}
              {" - "}
              {moment(plan.endDate).format("dd, DD MMM")}
            </LabelText>

            {!!label && (
              <Label variant={plan.daysUntil > 0 ? "future" : "active"} text={label} />
            )}
          </Row>

          <SlotList plan={plan} handleRefresh={handleRefresh} onClick={onClick} />
        </View>
      ) : (
        <NoData
          color={colors.white}
          padding={18}
          message="We're unable to load the workout at the moment. Please, try again later."
        />
      )}
    </View>
  )
}

const withData = compose(
  withAssignedTrainingPlan,
  withLoader({
    color: colors.white,
    message: "Loading training program..."
  }),
  withProps(({ date, data }) => {
    const tpa = data.trainingPlanAssignmentById
    if (tpa) {
      const slots = _.getOr([], "trainingPlan.slots.nodes", tpa).map(slot => ({
        ...slot,
        date: moment(tpa.startDate).add(slot.offset, "days"),
        duration: 0
      }))

      const sortedSlots = _.orderBy("offset", ["asc"], slots)

      const plan = {
        id: tpa.id,
        trainingPlanId: _.getOr("Unknown name", "trainingPlan.id", tpa),
        name: _.getOr("Unknown name", "trainingPlan.name", tpa),
        notes: _.getOr("", "trainingPlan.notes", tpa),
        duration: _.getOr("", "trainingPlan.duration", tpa),
        startDate: tpa.startDate,
        endDate: tpa.endDate,
        daysUntil: moment(tpa.startDate).diff(date, "days"),
        daysLeft: moment(tpa.endDate).diff(
          moment(date).isAfter(tpa.startDate) ? date : tpa.startDate,
          "days"
        ),
        slots: sortedSlots,
        todaySlots: sortedSlots.filter(slot => moment(date).isSame(slot.date, "day"))
      }

      return { plan }
    }
  })
)

const enhanced = compose(
  withData,
  withNavigation,
  withHandlers({
    onClick: ({ navigation }) => slot => {
      if (slot.workoutTemplateId) {
        navigation.navigate(routes.WorkoutScene, {
          workoutName: slot.workoutTemplateName,
          workoutId: slot.workoutTemplateId,
          date: today()
        })
      }
    },
    handleRefresh: props => done => {
      props.data
        .refetch()
        .then(done)
        .catch(done)
    }
  })
)

const PlanScene = enhanced(PlanSceneBase)

export default props => (
  <View flex={1}>
    <LinearGradient colors={gradients.bg1} style={StyleSheet.absoluteFill} />
    <PlanScene {...props} />
  </View>
)
