import { View } from "glamorous-native"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import { withProps, lifecycle, compose } from "recompose"
import React from "react"
import moment from "moment"
import numeral from "numeral"

import { AddIcon } from "kui/icons"
import { FloatButton, IconButton } from "kui/components/Button"
import { Gradient } from "components/Background"
import { HelpIcon } from "scenes/Home/Icons"
import { metricDisplay } from "scenes/Home/Feelings/display"
import { routes } from "navigation/routes"
import { setSwitch } from "components/Switch/actions"
import { withErrorHandler, withLoader, withMemberId } from "hoc"
import Chart from "scenes/Home/Feelings/Trends/Chart"
import Switch, { TouchableItem } from "kui/components/Switch"
import Text, { B, I } from "kui/components/Text"
import Tooltip from "kui/components/Tooltip"
import _ from "lodash/fp"
import colors, { gradients } from "kui/colors"
import withTooltip from "hoc/withTooltip"

const H = p => (
  <Text
    variant="body2"
    paddingVertical={4}
    fontSize={12}
    color={colors.darkBlue70}
    {...p}
  />
)

const TRENDS = ["GRA", "MOT", "SLE", "S.O."]
const TRENDS_TOOLTIPS = setSelectedTrend => {
  return [
    {
      label: TRENDS[0],
      title: "Gratitude",
      text:
        "Gratitude is one of the most crucial things in life. It is much harder to achieve a positive outcome with a negative mind. With low gratitude, motivation will drop, sleep quality will decrease, and stress management will be more difficult, which will lead to ever decreasing gratitude.",
      _renderContent: () => (
        <React.Fragment>
          <H>Why does it matter?</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Gratitude is <B>one of the most crucial</B> things in life. It is much harder
            to achieve a positive outcome with a negative mind. With low gratitude,
            motivation will drop, sleep quality will decrease, and stress management will
            be more difficult, which will lead to ever decreasing gratitude. The whole
            chicken or the egg scenario.
          </Text>

          <H>Recognise the pattern</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            We all have so much to be thankful for in life, the air we breathe, the
            ability to train, the jobs we have or the family. Just like when you buy a new
            car, you start to see it everywhere because of your Reticular Activating
            System, you have a <B>heightened sense of consciousness</B> for the car so you
            see it everywhere, this works similar with gratitude and seeing positive
            things.
          </Text>

          <H>How can I address it?</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Here&apos;s a great technique to try: If you bookend your day with gratitude
            e.g. wake up in the morning and write down{" "}
            <B>3 things you are grateful for</B>, and finish the day writing 3 things you
            were grateful for that day, you will have a heightened sense of awareness for
            the positive in your life and more positivity will happen.
          </Text>

          <H>It is Your choice.</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            It is not what happens that counts, it is how you react to it. Choosing the
            right emotion will give you the sense of ownership over your actions in most
            difficult situations. Choose happiness, live with gratitude.
          </Text>
        </React.Fragment>
      ),
      order: 1,
      name: "feelings-gratitude",
      scrollProps: { maxHeight: 300 },
      onNext: () => setSelectedTrend(TRENDS[1])
    },
    {
      label: TRENDS[1],
      title: "Motivation",
      text:
        "Motivation is a powerful catalyst to boost your potential. Be concious of your motivation levels to take the most out of your days.",
      _renderContent: () => (
        <React.Fragment>
          <Text variant="caption1" color={colors.darkBlue90}>
            It is always great to feel motivated. Motivation is an powerful catalyst of
            your potential, but we all run out of fuel every now and then. Here are some
            tips on how to manage your motivation:
          </Text>
          <H>Rating 1-4</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            It&apos;s ok to have low motivation at times, but you need to reconnect to
            your WHY. <I>Remember WHY you started</I>, what drove you to take action, tap
            into that feeling. You aren’t always going to feel 100% motivated, but the
            difference between those who get results and those who always struggle is when
            motivation is low the ones that get results tap into the ATHLETES mindset and
            simply get the job done.
          </Text>
          <H>Rating 5-6</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Try shifting your goals from being outcome-based over to be process-based. Set
            simple achievable goals like hitting 4 training sessions a week and get BETTER
            nutrition habbits 6/7 days. You do this and you will WIN your week of fitness,
            and when we win, we gain momentum and motivation. The results will follow.
          </Text>
          <H>Rating 7+</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            You feel very motivated, you are starting to inspire people around you, you
            are lifting people up and motivating them. It makes you feel even better than
            before.
          </Text>
        </React.Fragment>
      ),
      order: 2,
      name: "feelings-motivation",
      scrollProps: { maxHeight: 300 },
      onNext: () => setSelectedTrend(TRENDS[2]),
      onPrev: () => setSelectedTrend(TRENDS[0]),
      onStop: () => setSelectedTrend(TRENDS[0])
    },
    {
      label: TRENDS[2],
      title: "Sleep",
      text:
        "This is obviously a crucial factor to recovery and transformation, if you don’t sleep or don't sleep well you crave everything you probably shouldn’t eat in quantities that you should probably avoid.",
      _renderContent: () => (
        <React.Fragment>
          <Text variant="caption1" color={colors.darkBlue90}>
            This is obviously a crucial factor to recovery and transformation, if you
            don’t sleep you crave everything you probably shouldn’t eat in quantities that
            you should probably avoid.
          </Text>
          <H>Rating 1-4</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            When sleep is low, it feels like everything else is super hard. So we need to
            focus on this as soon as possible. Focus on having 7 hours of sleep and create
            a wind down routine. Here are some good routines before going to bed:
            <I>{`\n - `}finish eating 2 hours before bed</I>
            <I>{`\n - `}reduce screen time to 30 min before bed</I>
            <I>
              {`\n - `}15 min before sleep hop into bed and turn on a night time guided
              meditation
            </I>
          </Text>
          <H>Rating 5-6</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Time to take it up a notch and get you to a 7 out of 10 with sleep, we don’t
            just want quantity of hours now, we want quality of hours. Focusing on
            vitamins in your nutrition and quality of food overall will help you increase
            the quality of your sleep making you feel more refreshed and recovered.
          </Text>
          <H>Rating 7+</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Keep doing what you are doing. In a society riddled with insomnia and people
            feeling like they can&apos;t sleep - you&apos;re doing well! Keep your sleep
            at minimum 7-8 hours a night and be asleep before 10pm.
          </Text>
        </React.Fragment>
      ),
      order: 3,
      name: "feelings-sleep",
      scrollProps: { maxHeight: 300 },
      onNext: () => setSelectedTrend(TRENDS[3]),
      onPrev: () => setSelectedTrend(TRENDS[1]),
      onStop: () => setSelectedTrend(TRENDS[0])
    },
    {
      label: TRENDS[3],
      title: "Stress Optimisation",
      text:
        "This is a factor that often gets out of our control. It is almost impossible to eliminate stress from our lives, but we have to do our best to optimise it. When stressed - it is crucial to plan things in advance. It is also important to control your environment.",
      _renderContent: () => (
        <React.Fragment>
          <Text variant="caption1" color={colors.darkBlue90}>
            This is a factor that often gets out of our control. It is almost impossible
            to eliminate stress from our lives, but we have to do our best to optimise it.
            When stressed - it is crucial to plan things in advance. It is also important
            to control your environment.
          </Text>
          <H>General Tips</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Drink plenty of water, meditate, sit quietly for 5 minutes twice a day use
            breathing techniques (simply breathe in for 3 seconds and breath out for 6
            seconds) to calm your mind down. Optimised and controlled stress will help you
            to make highler quality choices when it comes to transformation.
          </Text>
          <H>Rating 1-4</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Stress is one of the biggest factors that holds people back from a body
            transformation. Most of the time We get stressed because of the external
            factors we can’t control, this triggers us to want to calm ourselves and we
            reach to food or alcohol for the feel good fix. Create a list of the 5
            triggers that push you towards self sabotage (over drinking and eating), then
            create and recognise an “if when, then” scenario. If we can consciously create
            an alternate scenario for our brain to choose in the situation we can start
            creating new habits that can combat the negativity that is stress.
            {`\n`}Example:{" "}
            <I>
              If I had a long stressful day at work normally I go home and drink a bottle
              of wine to recover.
            </I>
            {`\n`}Instead, try this:{" "}
            <I>
              When I have a long stressful day at work I will have a bath and listen to my
              favourite music for 30 minutes.
            </I>
          </Text>
          <H>Rating 5-6</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Focus on the power of breath. Anything can happen to you, but it is how you
            respond that matters. When you are in a stressful experience, normally it
            shoves us into flight or fight mode (this is where poor decisions are made a
            lot of the time), instead shift your energy system, remind yourself you are in
            control, no one else. Breathe in for 3 seconds and out for 6 seconds, this
            calms the mind, and allows you to move through problems much easier, try to do
            this for 15-20 breaths (but even 3 breaths will do sometimes).
          </Text>
          <H>Rating 7+</H>
          <Text variant="caption1" color={colors.darkBlue90}>
            Good work! To take it to the next level - try meditation for 10 minutes a day
            (even 2 minutes is fine to start). Do it first thing in the morning. This will
            start to give you some super powers you didn&apos;t even know you had.
          </Text>
        </React.Fragment>
      ),
      order: 4,
      name: "feelings-stress-optimization",
      scrollProps: { maxHeight: 300 },
      onPrev: () => setSelectedTrend(TRENDS[2]),
      onStop: () => setSelectedTrend(TRENDS[0])
    }
  ]
}
const DEFAULT_INTERVAL = 30
const DEFAULT_TREND = TRENDS[0]

const Title = p => (
  <Text
    paddingTop={24}
    paddingBottom={12}
    fontSize={28}
    lineHeight={36}
    paddingHorizontal={20}
    color={colors.white}
    textAlign={"center"}
    {...p}
  />
)

const Subtitle = p => (
  <Text
    fontSize={15}
    fontHeight={24}
    color={colors.darkBlue30}
    opacity={0.8}
    textAlign={"center"}
    paddingHorizontal={20}
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

const TooltipItem = ({ itemProps, ...rest }) => {
  return (
    <Tooltip {...itemProps} flex={1} height={32}>
      <TouchableItem {...rest} />
    </Tooltip>
  )
}

const TrendSelector = props => {
  const { selectedTrend, setSelectedTrend, values } = props

  return (
    <View alignItems="center" justifyContent="center" paddingHorizontal={20}>
      <Switch
        values={values}
        value={values[TRENDS.findIndex(t => t === selectedTrend)]}
        onChange={i => setSelectedTrend(i.label)}
        touchableItem={TooltipItem}
        getItemProps={i => i}
        getValue={i => i}
      />
    </View>
  )
}

const deltaMessages = {
  GRA: { up: "You're more Grateful!", down: "You're less Grateful." },
  MOT: { up: "You're more Motivated!", down: "Your Motivation is down." },
  SLE: { up: "You're Sleeping better!", down: "Your Sleep quality is down." },
  "S.O.": {
    up: "You're managing Stress better!",
    down: "You're more Stressed."
  }
}

const TrendSummary = props => {
  const { trendData, interval, selectedTrend } = props
  const earliest = _.minBy("date", trendData)
  const latest = _.maxBy("date", trendData)
  const max = _.maxBy("value", trendData)
  const delta = latest.value - earliest.value
  const deltaRounded = numeral(delta * Math.sign(delta)).format("0.[0]")
  const message = deltaMessages[selectedTrend]
  const formattedDelta = delta > 0 ? message.up : delta < 0 ? message.down : "No change."

  const maxVal = max.value
  const positiveTrend = delta > 0

  const details =
    delta === 0
      ? `The rating hasn't changed \nover the last ${interval} days.`
      : `Your highest rating was ${maxVal}/10 ${
          positiveTrend ? "and" : "but"
        }\nyour average rating is ${
          positiveTrend ? "up" : "down"
        } by ${deltaRounded}\nover the last ${interval} days.`

  return (
    <View flex={1} alignItems="center">
      <Title>{formattedDelta}</Title>
      <Subtitle>{details}</Subtitle>
    </View>
  )
}

const Trends = props => {
  const {
    trends,
    selectedTrend,
    interval,
    setInterval,
    setSelectedTrend,
    navigation
  } = props
  const trendData = trends[selectedTrend]

  const hasData = trendData && trendData.length >= 1

  return (
    <View flex={1} justifyContent="flex-end">
      <Gradient />
      <View flex={0.4}>
        <TrendSelector {...props} />
        {hasData ? <TrendSummary {...props} trendData={trendData} /> : <NoData />}
      </View>
      <View flex={0.6}>
        <Chart
          onRangePress={setInterval}
          selectedRange={interval}
          data={hasData ? trendData : []}
          selectedTrend={selectedTrend}
        />
      </View>

      <Tooltip
        position="absolute"
        right={24}
        bottom={84}
        width={52}
        height={52}
        text="You can track your Feelings by clicking on this button."
        order={5}
        name="feelings-add"
        title="Record Daily"
        scrollProps={{ maxHeight: 200 }}
        onFinish={() => setSelectedTrend(TRENDS[0])}
      >
        <FloatButton onPress={() => navigation.navigate(routes.FeelingsTracker)}>
          <AddIcon />
        </FloatButton>
      </Tooltip>
    </View>
  )
}

const MEMBER_FEELINGS = gql`
  query MemberFeelings($memberId: Int!, $interval: Int!) {
    memberMetricKpis(memberId: $memberId, interval: $interval) {
      nodes {
        id
        date
        key
        value
      }
    }
  }
`

const withData = graphql(MEMBER_FEELINGS, {
  options: ({ memberId, interval }) => ({
    fetchPolicy: "network-only",
    variables: { __offline__: true, memberId, interval },
    notifyOnNetworkStatusChange: true
  })
})

const mkMetric = () => metric => {
  const { value } = metric
  return metricDisplay({ ...metric, value })
}

const mapStateToProps = state => {
  const selectedTrend = state.ui.switches.feelingsTrend || DEFAULT_TREND
  const interval = state.ui.switches.feelingsTrendInterval || DEFAULT_INTERVAL
  return { selectedTrend, interval }
}

const mapDispatchToProps = dispatch => {
  return {
    setSelectedTrend: i => dispatch(setSwitch("feelingsTrend")(i)),
    setInterval: i => dispatch(setSwitch("feelingsTrendInterval")(i))
  }
}

const enhanced = compose(
  withNavigation,
  withMemberId,
  withTooltip,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withData,
  withErrorHandler,
  withLoader({
    color: colors.white,
    backgroundColor: gradients.bg1[0],
    message: "Loading trends...",
    containerProps: { padding: 24 }
  }),
  withProps(props => {
    const nodes = _.getOr([], "data.memberMetricKpis.nodes", props)
    const measurements = _.orderBy(["key", "date"], ["asc", "asc"], nodes)

    const points = measurements
      .filter(m => m.value !== 0)
      .map(mkMetric(props))
      .map(m => ({ ...m, date: moment(m.date) }))
    const trends = _.pickBy(p => p.length >= 1, _.groupBy("abbrev", points))

    const values = TRENDS_TOOLTIPS(props.setSelectedTrend)

    return { trends, values }
  }),
  lifecycle({
    componentDidMount() {
      this.props.navigation.setParams({
        onTooltipStart: () => {
          this.props.setSelectedTrend(TRENDS[0])
          this.props.startTooltip()
        }
      })
    }
  })
)

export default enhanced(Trends)

export const ShowTipsButton = ({ navigation }) => {
  const onTooltipStart = _.getOr(null, "state.params.onTooltipStart", navigation)
  return onTooltipStart ? (
    <IconButton onPress={onTooltipStart} padding={12}>
      <HelpIcon size={20} color={colors.darkBlue30} />
    </IconButton>
  ) : null
}
