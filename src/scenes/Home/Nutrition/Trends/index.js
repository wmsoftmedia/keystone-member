import { ScrollView, Text, View } from "glamorous-native"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { connect } from "react-redux"
import { compose, withProps } from "recompose"
import React from "react"
import moment from "moment"
import numeral from "numeral"
import _ from "lodash/fp"

import { Gradient } from "components/Background"
import { Row } from "kui/components"
import { Switch } from "kui/components/Switch"
import { cals, gqlDate, nextNDaysFrom, today } from "keystone"
import { setSwitch } from "components/Switch/actions"
import { withErrorHandler, withLoader, withMemberId } from "hoc"
import Chart from "scenes/Home/Nutrition/Trends/Chart"
import colors from "kui/colors"

const TRENDS = [
  { key: "cals", label: "CAL" },
  { key: "protein", label: "PROTEIN" },
  { key: "fat", label: "FAT" },
  { key: "carbs", label: "CARBS" },
  { key: "fibre", label: "FIBRE" }
]

const DEFAULT_INTERVAL = 7
const DEFAULT_WEEK = 0
const DEFAULT_TREND = TRENDS[0].key

const Title = p => (
  <Text paddingVertical={8} lineHeight={36} fontSize={24} color={colors.white} {...p} />
)

const Subtitle = p => (
  <Text
    fontSize={15}
    lineHeight={24}
    color={colors.darkBlue30}
    textAlign={"center"}
    paddingHorizontal={16}
    {...p}
  />
)

const NoData = () => (
  <View flex={1} alignItems="center">
    <Title>No data to show.</Title>
    <Subtitle>With regular tracking, you can</Subtitle>
    <Subtitle>see your progress trends here.</Subtitle>
  </View>
)

const TrendSelector = props => {
  const { selectedTrend, setSelectedTrend } = props
  return (
    <View height={42}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10
        }}
      >
        <Switch
          values={TRENDS.map(x => x.label)}
          value={TRENDS.findIndex(t => t.key === selectedTrend)}
          onChange={i => setSelectedTrend(TRENDS[i].key)}
        />
      </ScrollView>
    </View>
  )
}

const TrendSummary = props => {
  const { trendData: data, selectedTrend, week } = props
  const trendData = data.filter(d => d.value !== 0 || d.goal !== 0)
  const totalConsumed = trendData.reduce((acc, i) => {
    acc += i.value
    return acc
  }, 0)
  const projectedConsumed = trendData.reduce((acc, i) => {
    acc += i.goal
    return acc
  }, 0)
  const averageDaily = totalConsumed / trendData.length
  const averageGoal = projectedConsumed / trendData.length
  const delta = 100 - (averageDaily * 100) / averageGoal
  const DELTA_GOAL = 10
  const good = Math.abs(delta) < DELTA_GOAL

  const measure = selectedTrend === "cals" ? "cal" : "g"
  const isFibre = selectedTrend === "fibre"
  const thisLastWeek = week === 0 ? "this" : "last"
  const areWere = week === 0 ? "are" : "were"
  const isWas = week === 0 ? "is" : "was"
  const deltaMsg =
    delta < 0 ? `Your intake ${isWas} too high.` : `Your intake ${isWas} too low.`

  return (
    <View alignItems="center" justifyContent="center">
      {!isFibre && <Title>{good ? `Your intake ${isWas} on track!` : deltaMsg}</Title>}
      {isFibre ? (
        <React.Fragment>
          <Subtitle paddingTop={24}>{`Aim for a min of 20g of fibre per day`}</Subtitle>
          <Subtitle opacity={0.5}>{`+15g for every 1000cal`}</Subtitle>
        </React.Fragment>
      ) : (
        <Subtitle>
          {good
            ? `You ${areWere} within ${DELTA_GOAL}% of goal ${thisLastWeek} week.`
            : `Focus on staying within ${DELTA_GOAL}% of your goal.`}
        </Subtitle>
      )}
      <Row paddingTop={8}>
        <Text marginRight={10} lineHeight={16} fontSize={10} color={colors.blue20}>
          AVERAGE: {numeral(averageDaily).format("0,0")} {measure.toUpperCase()}
        </Text>
        <Text marginLeft={10} lineHeight={16} fontSize={10} color={colors.blue20}>
          TOTAL: {numeral(totalConsumed).format("0,0")} {measure.toUpperCase()}
        </Text>
      </Row>
    </View>
  )
}

const Trends = props => {
  const { trends, week, setWeek } = props
  const trendData = trends
  const hasData = trendData && trendData.length > 1
  return (
    <View flex={1} justifyContent="flex-end">
      <Gradient />
      <View height={180}>
        <TrendSelector {...props} />
        {hasData ? <TrendSummary {...props} trendData={trendData} /> : <NoData />}
      </View>
      <View flex={1}>
        <Chart
          onRangePress={setWeek}
          selectedRange={week}
          data={hasData ? trendData : []}
        />
      </View>
    </View>
  )
}

const NUTRITION_HISTORY = gql`
  query MemberNutritionHistory($interval: Int!, $startDate: Date!, $memberId: Int!) {
    memberNutritionHistory(
      interval: $interval
      startDate: $startDate
      memberId: $memberId
    ) {
      nodes {
        id
        date
        actual {
          cals
          protein
          fat
          carbs
          fibre
        }
        target {
          cals
          protein
          fat
          carbs
          fibre
        }
      }
    }
  }
`

const withData = graphql(NUTRITION_HISTORY, {
  options: ({ memberId, week = 0, interval = 7, startDate = today() }) => ({
    fetchPolicy: "network-only",
    variables: {
      __offline__: true,
      memberId,
      interval,
      startDate: gqlDate(
        moment()
          .subtract(week, "weeks")
          .endOf("isoWeek")
      )
    },
    notifyOnNetworkStatusChange: true
  })
})

const mapStateToProps = state => {
  const selectedTrend = state.ui.switches.nutritionTrend || DEFAULT_TREND
  const interval = state.ui.switches.nutritionTrendInterval || DEFAULT_INTERVAL
  const week = state.ui.switches.nutritionTrendWeek || DEFAULT_WEEK
  return { selectedTrend, interval, week }
}

const mapDispatchToProps = dispatch => {
  return {
    setSelectedTrend: i => dispatch(setSwitch("nutritionTrend")(i)),
    setWeek: i => dispatch(setSwitch("nutritionTrendWeek")(i))
  }
}

const enhanced = compose(
  withMemberId,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withData,
  withErrorHandler,
  withLoader({
    color: colors.white,
    message: "Loading Trends...",
    containerProps: { padding: 24 }
  }),
  withProps(props => {
    const { selectedTrend, week } = props
    const nodes = _.getOr([], "data.memberNutritionHistory.nodes", props)
    const thisWeek = nextNDaysFrom(
      7,
      moment()
        .subtract(week, "weeks")
        .startOf("isoWeek")
    ).map(gqlDate)

    const goals = thisWeek.map(date => ({
      date,
      ...nodes.find(n => n.date === date)
    }))

    const trends = goals.map(p => ({
      ...p,
      date: gqlDate(p.date),
      value: p.actual ? p.actual[selectedTrend] : 0,
      goal: p.target
        ? selectedTrend === "cals"
          ? cals(p.target)
          : p.target[selectedTrend]
        : 0
    }))

    return { trends }
  })
)

export default enhanced(Trends)
