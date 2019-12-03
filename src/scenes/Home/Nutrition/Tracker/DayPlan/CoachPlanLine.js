import { Alert } from "react-native"
import { View } from "glamorous-native"
import { compose, withHandlers, withState } from "recompose"
import { withApollo } from "react-apollo"
import React from "react"
import * as Sentry from "sentry-expo"

import { GetDayByIdQuery } from "graphql/query/food/getDayById"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import ActivityIndicator from "components/ActivityIndicator"
import CenterView from "components/CenterView"
import ListItem from "components/ListItem"
import ListItemSeparator from "components/List/ListItemSeparator"
import NutritionPlanHeader from "scenes/Home/Nutrition/Tracker/DayPlan/NutritionPlanHeader"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const DAY_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

const buildFactsDesc = (facts = {}) => {
  return (
    `${facts.calories || "--"} cal` +
    ` | P ${facts.protein || "--"}` +
    ` | F ${facts.fat || "--"}` +
    ` | C ${facts.carbs || "--"}`
  )
}

const enhance = compose(
  withApollo,
  withState("loadingFacts", "setLoadingFacts", false),
  withHandlers({
    onLongPress: props => day => {
      const { client, setLoadingFacts, onSelect } = props
      if (!client || !day || !day.id) {
        return
      }
      setLoadingFacts(true)
      client
        .query(GetDayByIdQuery(day.id))
        .then(r => {
          setLoadingFacts(false)
          const name = _.getOr("Day Plan", "data.nutritionDayById.name", r)
          const notes = _.getOr("Day Plan", "data.nutritionDayById.notes", r)
          const facts = _.getOr({}, "data.nutritionDayById.nutritionFacts", r)
          const factsText = buildFactsDesc(facts)
          const text = `${factsText}\n\n${notes}`
          Alert.alert(
            name,
            text,
            [
              { text: "Cancel", onPress: () => null, style: "cancel" },
              { text: "Add to Diary", onPress: () => onSelect(day) }
            ],
            { cancelable: true }
          )
        })
        .catch(e => {
          setLoadingFacts(false)
          Alert.alert(
            "Error Occured",
            `Something went wrong.\nPlease try again later.`,
            [{ text: "Ok" }],
            { cancelable: true }
          )
          logErrorWithMemberId(memberId => {
            Sentry.captureException(
              new Error(
                `MId:{${memberId}}, Scope:{food.dayPlans}, KeystoneError:{longpress failed}, DayId:{${
                  day.id
                }}, Error:{${_.toString(e)}}`
              )
            )
          })
        })
    },
    onSelect: props => day => () => (day.type === "DAY" ? props.onSelect(day) : null)
  })
)

const stackStyles = { flex: 1 }

class CoachPlanLine extends React.PureComponent {
  renderTopContent(item) {
    return (
      <React.Fragment>
        <Text variant="body1">
          {item.name || <Text color={colors.white50}>Free Day</Text>}{" "}
        </Text>
        <View position="absolute" right={-34} top={10}>
          {this.props.loadingFacts && <ActivityIndicator animating />}
        </View>
      </React.Fragment>
    )
  }

  renderBottomContent(item) {
    const stats = item.nutritionFacts
    const showStats = !_.isEmpty(stats)
    return (
      <Text
        variant={"caption1"}
        numberOfLines={1}
        ellipsizeMode={"tail"}
        color={colors.darkBlue30}
      >
        <Text color={item.isToday ? colors.green50 : colors.darkBlue30}>
          {DAY_OF_WEEK[item.dayOfWeek - 1]}
        </Text>
        {showStats ? " - " : ""}
        {showStats && buildFactsDesc(stats)}
      </Text>
    )
  }

  renderFreeDayDesc() {
    return (
      <Text numberOfLines={1} ellipsizeMode={"tail"} color={colors.white50} fontSize={12}>
        This is a free day with no details provided.
      </Text>
    )
  }

  renderSeparator = () => <ListItemSeparator height={1} color={colors.white30} />

  renderSectionHeader = ({ section }) => <NutritionPlanHeader assignment={section} />

  renderEmpty = () => (
    <CenterView paddingVertical={8} paddingHorizontal={20}>
      <Text color={colors.white50}>No nutrition plans available.</Text>
      <Text color={colors.white50} textAlign="center">
        Please ask your coach to update your nutrition plan.
      </Text>
    </CenterView>
  )

  render() {
    const { item, onLongPress, loadingFacts } = this.props
    return item.type === "DAY" ? (
      <ListItem
        arrowIconName="md-add"
        rows={2}
        contentTop={this.renderTopContent(item)}
        contentBottom={this.renderBottomContent(item)}
        onLongPress={() => onLongPress(item)}
        onPress={loadingFacts ? () => null : this.props.onSelect(item)}
        styleOverrides={{
          container: props => ({
            paddingRight: 10,
            backgroundColor: props.hi ? colors.white10 : colors.transparent,
            height: 56
          }),
          row: () => ({ justifyContent: "flex-start" }),
          arrow: () => ({
            backgroundColor: colors.transparent,
            opacity: loadingFacts ? 0 : 1
          }),
          arrowIcon: () => ({ fontSize: 18, color: colors.white })
        }}
        stackStyle={stackStyles}
      />
    ) : (
      <ListItem
        arrowIconName="md-add"
        rows={2}
        contentTop={this.renderTopContent(item)}
        contentBottom={this.renderFreeDayDesc()}
        styleOverrides={{
          container: () => ({
            paddingRight: 10,
            backgroundColor: colors.transparent,
            height: 56
          }),
          row: () => ({ justifyContent: "flex-start" }),
          arrow: () => ({ backgroundColor: colors.transparent, width: 30 }),
          arrowIcon: () => ({ fontSize: 18, color: colors.transparent })
        }}
      />
    )
  }
}
export default enhance(CoachPlanLine)
