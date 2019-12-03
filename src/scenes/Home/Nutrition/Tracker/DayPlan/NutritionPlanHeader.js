import { View } from "glamorous-native"
import { compose, withProps } from "recompose"
import React from "react"
import moment from "moment"

import { Row } from "kui/components"
import { SectionHeaderLight } from "components/List/SectionHeader"
import { isFutureDay, isPastDate } from "keystone"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const enhance = compose(
  withProps(props => {
    const duration = _.getOr(0, "assignment.duration", props)
    const suffix = duration > 1 ? "weeks" : "week"
    const endDate = _.getOr(null, "assignment.endDate", props)
    const startDate = _.getOr(null, "assignment.startDate", props)

    const isEmptyDay = !_.getOr([], "assignment.data", props).some(day => day.isToday)

    return {
      isEmptyDay,
      name: _.getOr("Untitled", "assignment.name", props),
      endDate,
      durationLabel: duration ? `Duration: ${duration} ${suffix}` : "",
      endDateLabel: `End Date: ${moment(endDate).format("DD MMM YYYY")}`,
      startDateLabel: `Start Date: ${moment(startDate).format("DD MMM YYYY")}`,
      status: isFutureDay(startDate)
        ? "NOT STARTED"
        : isPastDate(endDate)
        ? "FINISHED"
        : "CURRENT"
    }
  })
)

export default enhance(props => (
  <View>
    <SectionHeaderLight
      labelColor={colors.white}
      labelLeft={<Text variant="body1">{props.name}</Text>}
      labelRight={
        props.status === "NOT STARTED" ? (
          "NOT STARTED"
        ) : props.status === "FINISHED" ? (
          <Text variant="button1" color={colors.white50}>
            ENDED
          </Text>
        ) : (
          <Text variant="button1" color={colors.green50}>
            CURRENT
          </Text>
        )
      }
      renderBottom={() => (
        <Row paddingTop={5} justifyContent={"space-between"} width={"100%"}>
          <Text variant={"caption1"} color={colors.darkBlue30}>
            {props.startDateLabel}
          </Text>
          <Text variant={"caption1"} color={colors.darkBlue30}>
            {props.endDate ? props.endDateLabel : props.durationLabel}
          </Text>
        </Row>
      )}
    />
    <Line marginVertical={8} />
    <View alignItems="center" justifyContent="center">
      <Text variant={"caption1"} color={colors.white50}>
        Tap and hold to show day info
      </Text>
    </View>
  </View>
))
