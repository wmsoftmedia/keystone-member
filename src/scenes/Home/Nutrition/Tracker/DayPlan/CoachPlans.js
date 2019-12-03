// packages
import { View } from "glamorous-native"
import { compose, withProps, withHandlers } from "recompose"
import React from "react"
import moment from "moment"

import { withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import CoachPlanLine from "scenes/Home/Nutrition/Tracker/DayPlan/CoachPlanLine"
import InfoMessage from "components/InfoMessage"
import List from "components/List"
import NutritionPlanHeader from "scenes/Home/Nutrition/Tracker/DayPlan/NutritionPlanHeader"
import _ from "lodash/fp"
import allMyPlans from "graphql/query/food/allMyPlans"
import colors from "kui/colors"

const withData = allMyPlans

const dataKeys = ["AllMyPlans"]

const enhance = compose(
  withData,
  withExtendedErrorHandler({ dataKeys }),
  withLoader({ dataKeys }),
  withHandlers({
    handleRefresh: props => done => props.AllMyPlans.refetch().finally(done)
  }),
  withProps(props => {
    const assignments = _.getOr(
      [],
      "AllMyPlans.currentMember.memberNutritionPlansByMemberId.nodes",
      props
    )

    return {
      sections: assignments.map(a => ({
        name: _.getOr("Untitled", "plan.name", a),
        duration: _.getOr(0, "plan.duration", a),
        startDate: _.getOr(null, "startDate", a),
        endDate: _.getOr(null, "endDate", a),
        nutritionFacts: _.getOr({}, "nutritionFacts", a),
        notes: _.getOr("", "program.notes", a),
        data: _.sortBy(
          "dayOfWeek",
          _.getOr([], "plan.schedule.nodes", a).map(d => ({
            ...d.day,
            type: d.dayType,
            dayOfWeek: d.orderIndex + 1,
            isToday: moment(props.date).isoWeekday() === d.orderIndex + 1
          }))
        )
      }))
    }
  })
)

class PlansList extends React.Component {
  renderItem = ({ item }) => <CoachPlanLine item={item} onSelect={this.props.onSelect} />

  renderSectionHeader = ({ section }) => <NutritionPlanHeader assignment={section} />

  renderEmpty = () => (
    <InfoMessage
      title="No plans available."
      subtitle={`You can ask your coach to create \nand assign a meal plan for you.`}
    />
  )

  render() {
    const { handleRefresh, sections } = this.props

    return (
      <View flex={1}>
        <List
          sectionList
          refreshable
          handleRefresh={handleRefresh}
          sections={sections}
          keyExtractor={item => `${item.id}${item.dayOfWeek}`}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ListEmptyComponent={this.renderEmpty}
          stickySectionHeadersEnabled={false}
          refreshProps={{ tintColor: colors.white50 }}
        />
      </View>
    )
  }
}

export default enhance(PlansList)
