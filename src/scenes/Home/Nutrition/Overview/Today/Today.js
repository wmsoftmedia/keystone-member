import { View } from "glamorous-native"
import { compose, withProps } from "recompose"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import React from "react"

import { GaugeWithTarget } from "kui/components/Gauge"
import { cals, today, gqlDate } from "keystone"
import { withLoader } from "hoc"
import Line from "kui/components/Line"
import NutritionStreak from "components/NutritionStreak"
import PropTypes from "prop-types"
import Row from "components/Row"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const MacroGoalsText = p => (
  <Text variant="body2" fontSize={12} color={colors.darkBlue40} {...p} />
)
const MacroTotalText = p => <Text variant="body2" fontSize={12} {...p} />
const MacroTotalLabel = p => <Text variant="body2" fontSize={12} {...p} />

export const MEMBER_NUTRITION_STREAK = gql`
  query MemberNutritionStreak($startDate: Date!) {
    # Streak configuration
    # - start_date DATE, -- the date we start calculating the streak from
    # - max_interval INTEGER DEFAULT 90, -- this helps us limit the cursor operation space
    # - cal_threshold_lower FLOAT DEFAULT 1000, -- min cals required to qualify for the streak
    # - cal_threshold_upper FLOAT DEFAULT 10000, -- max cals allowed to qualify for the streak
    # - allowed_target_distance FLOAT DEFAULT 0.1, -- allowed max distance from the caloric target
    # - member_id INTEGER DEFAULT keystone.current_member_id()
    memberNutritionStreak(startDate: $startDate) {
      startDate
      endDate
      streak
    }
  }
`

const NutritionStreakContainer = compose(
  graphql(MEMBER_NUTRITION_STREAK, {
    options: ({ date }) => ({
      fetchPolicy: "network-only",
      variables: {
        __offline__: true,
        startDate: gqlDate(date || today())
      },
      notifyOnNetworkStatusChange: true
    })
  }),
  withLoader({ color: colors.white }),
  withProps(props => {
    const streak = _.getOr(0, "data.memberNutritionStreak.streak", props)
    return { streak }
  })
)(NutritionStreak)

const Today = props => {
  const { date, profile, totals } = props
  const hasProfile = _.getOr(false, "macros", profile)
  const calTarget = hasProfile ? cals(profile.macros) : null

  return (
    <View flex={1}>
      <View paddingHorizontal={20}>
        <GaugeWithTarget
          label="DAILY TOTAL"
          measure="cal"
          value={totals.cals}
          target={calTarget}
          targetColor={colors.darkBlue40}
          hasTarget={!!hasProfile}
          progressCircleProps={{
            strokeWidth: 8,
            backgroundColor: colors.darkBlue70
          }}
        />
      </View>
      <View flex={1} paddingHorizontal={20} paddingTop={20}>
        <NutritionStreakContainer date={date} />
      </View>
      <Line color={colors.darkBlue60} />
      <Row paddingHorizontal={20} paddingVertical={16} justifyContent="space-between">
        <Row>
          <MacroTotalLabel>{hasProfile ? "P" : "PROTEIN"} </MacroTotalLabel>
          <MacroTotalText>{totals.protein}</MacroTotalText>
          <MacroGoalsText>
            {hasProfile && "/"}
            {`${_.getOr("", "macros.protein", profile)} g`}
          </MacroGoalsText>
        </Row>
        <Row>
          <MacroTotalLabel>{hasProfile ? "F" : "FAT"} </MacroTotalLabel>
          <MacroTotalText>{totals.fat}</MacroTotalText>
          <MacroGoalsText>
            {hasProfile && "/"}
            {`${_.getOr("", "macros.fat", profile)} g`}
          </MacroGoalsText>
        </Row>
        <Row>
          <MacroTotalLabel>{hasProfile ? "C" : "CARBS"} </MacroTotalLabel>
          <MacroTotalText>{totals.carbs}</MacroTotalText>
          <MacroGoalsText>
            {hasProfile && "/"}
            {`${_.getOr("", "macros.carbs", profile)} g`}
          </MacroGoalsText>
        </Row>
      </Row>
    </View>
  )
}

Today.propTypes = {
  totals: PropTypes.shape({
    cals: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired
  }).isRequired
}

export default Today
