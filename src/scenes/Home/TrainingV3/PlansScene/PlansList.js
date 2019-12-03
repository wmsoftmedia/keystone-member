import { View, TouchableOpacity, FlatList } from "glamorous-native"
import { branch, compose, withHandlers, withProps, withState } from "recompose"
import { defaultProps, setPropTypes } from "recompose"
import { RefreshControl } from "react-native"
import React from "react"
import moment from "moment"
import _ from "lodash/fp"

import InfoMessage from "components/InfoMessage"
import { Row } from "kui/components"
import { TextInput } from "kui/components/Input"
import { WorkoutIcon } from "kui/icons"
import { withActiveAssignedTrainingPlans } from "graphql/query/training/assignedPlans"
import { withCompletedAssignedTrainingPlans } from "graphql/query/training/assignedPlans"
import Card from "kui/components/Card"
import Label from "kui/components/Label"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import colors from "kui/colors"

const LabelText = p => <Text variant="caption1" color={colors.darkBlue30} {...p} />

const PlanListItem = ({ item, onClick }) => {
  const period =
    moment(item.startDate).format("dd, DD MMM") +
    " - " +
    moment(item.endDate).format("dd, DD MMM")
  const label =
    item.daysUntil > 0
      ? "Starts in " + item.daysUntil + " " + (item.daysUntil === 1 ? "day" : "days")
      : item.daysLeft > 0
      ? item.daysLeft + (item.daysLeft === 1 ? " day" : " days") + " left"
      : ""
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => onClick(item)}
      marginHorizontal={20}
    >
      <Card color={colors.darkBlue90} padding={16}>
        <Row alignItems="center">
          <WorkoutIcon size={24} color={colors.white} />
          <View flex={1}>
            <Text
              variant="body2"
              paddingLeft={8}
              ellipsizeMode={"tail"}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </View>
        </Row>
        <Row paddingTop={4} justifyContent="space-between" alignItems="center">
          <LabelText>{period}</LabelText>
          {!!label && (
            <Label variant={item.daysUntil > 0 ? "future" : "active"} text={label} />
          )}
        </Row>
      </Card>
    </TouchableOpacity>
  )
}

const PlansList = ({ items, isLoading, handleRefresh, onClick, setTerm, term }) => (
  <View flex={1}>
    <TextInput
      marginHorizontal={20}
      marginBottom={20}
      placeholder="Search"
      onChange={setTerm}
      value={term}
    />
    <FlatList
      flex={1}
      data={items}
      keyExtractor={item => item.id}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
      ListEmptyComponent={() =>
        isLoading ? null : (
          <InfoMessage
            title={"No plans to show"}
            subtitle={"Choose a plan from other options above."}
          />
        )
      }
      renderItem={({ item }) => <PlanListItem item={item} onClick={onClick} />}
      ItemSeparatorComponent={() => <View paddingTop={12} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  </View>
)

const enhanced = compose(
  setPropTypes({ tab: PropTypes.number }),
  defaultProps({ tab: 0 }),
  branch(
    props => props.tab === 0,
    withActiveAssignedTrainingPlans,
    withCompletedAssignedTrainingPlans
  ),
  withState("headTab", "setHeadTab", 0),
  withState("term", "setTerm", ""),
  withProps(props => {
    const { term } = props
    const isLoading = _.getOr(false, "data.loading", props)
    const plans = _.getOr([], "data.currentMember.assignedTrainingPlans.nodes", props)
    const programs = plans.map(p => ({
      id: p.id,
      name: _.getOr("Unknown name", "trainingPlan.name", p),
      startDate: p.startDate,
      endDate: p.endDate,
      daysUntil: moment(p.startDate).diff(props.date, "days"),
      daysLeft: moment(p.endDate).diff(
        moment(props.date).isAfter(p.startDate) ? props.date : p.startDate,
        "days"
      )
    }))
    const items = programs.filter(w => w.name.toLowerCase().includes(term.toLowerCase()))
    return {
      isLoading,
      items: _.orderBy([o => +moment(o.startDate)], ["asc"], items)
    }
  }),
  withHandlers({
    handleRefresh: props => done =>
      props.data
        .refetch()
        .then(done)
        .catch(done)
  })
)

export default enhanced(PlansList)
