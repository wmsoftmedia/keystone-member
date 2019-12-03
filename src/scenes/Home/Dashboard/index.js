import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, RefreshControl } from "react-native"
import { branch, compose, lifecycle, withProps, withState, withHandlers } from "recompose"
import { renderComponent } from "recompose"
import { withApollo } from "react-apollo"
import * as Animatable from "react-native-animatable"
import React from "react"
import { connect } from "react-redux"
import styled, { FlatList, View } from "glamorous-native"

import { BookingsButton } from "scenes/Home/Dashboard/Buttons"
import {
  COLOR_MAP,
  DELAYS_REVERSED,
  DELAY_FACTOR,
  DUR,
  DURATION_FACTOR
} from "scenes/Home/Dashboard/constants"
import { DashboardCard } from "kui/components/Card"
import { HelpIcon } from "scenes/Home/Icons"
import { IconButton } from "kui/components/Button"
import { Row } from "kui/components"
import { gqlDate, today } from "keystone"
import { routes } from "navigation/routes"
import { sendDeviceId } from "deviceId"
import { trackEvent } from "init"
import { withLoader } from "hoc"
import withStepsSync from "hoc/withStepsSync"
import BodyOverview from "scenes/Home/Body/Overview/Stats"
import CollectData from "scenes/OnBoarding/CollectData"
import FeatureContext from "components/FeatureContext"
import FeelingsOverview from "scenes/Home/Feelings/Overview/Stats"
import FoodJournalOverview from "scenes/Home/NutritionJournal/Overview"
import NoAccess from "scenes/Home/NoAccess"
import NutritionOverview from "scenes/Home/Nutrition/Overview/Today"
import PropTypes from "prop-types"
import Splash from "components/Splash"
import Text from "kui/components/Text"
import Tooltip from "kui/components/Tooltip"
import TrainingOverview from "scenes/Home/Training/Overview"
import Welcome from "scenes/OnBoarding/Welcome"
import _ from "lodash/fp"
import colors, { gradients } from "kui/colors"
import withAccountStatus from "hoc/withAccountStatus"
import withDailyData from "hoc/withDailyData"
import withTooltip from "hoc/withTooltip"
import { addApolloDep } from "../../../configureStore"

const Wrapper = styled(View)({
  flex: 1,
  backgroundColor: colors.black,
  height: "100%",
  width: "100%"
})

const CardContainer = props => {
  const { children, index, style, ...rest } = props
  return (
    <Animatable.View
      animation={"fadeIn"}
      delay={DELAYS_REVERSED[index] * DELAY_FACTOR}
      duration={DUR[index] * DURATION_FACTOR}
      style={{ paddingVertical: 6, paddingHorizontal: 20, ...style }}
      {...rest}
    >
      {React.Children.map(children, child => {
        return React.cloneElement(child, { color: COLOR_MAP[index] })
      })}
    </Animatable.View>
  )
}

const navTo = (navigation, tracker, date) => () => {
  navigation.navigate(tracker, { date })
  trackEvent("navigation", "open", tracker)
}

// -- Dashboard ---------------------------------------------------------------

class Dashboard extends React.Component {
  dashboardList = null

  componentDidMount() {
    sendDeviceId(this.props.client, true)
  }

  scrollToItem = (index, animated = false) => {
    this.dashboardList.scrollToIndex({ animated, index: index })
  }

  scrollToTop = (animated = true) => {
    this.dashboardList.scrollToOffset({ offset: 0, animated })
  }

  render() {
    const { date, navigation, startTooltip, firstName, handleRefresh } = this.props

    return (
      <Wrapper>
        <LinearGradient colors={gradients.bg1} style={StyleSheet.absoluteFill} />

        <FlatList
          data={[{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }]}
          keyExtractor={item => String(item.index)}
          contentContainerStyle={{
            paddingBottom: 20
          }}
          ListHeaderComponent={
            <Row paddingVertical={4} paddingHorizontal={20} width={"100%"}>
              <Tooltip
                title={`Hello${firstName ? ", " + firstName : ""}! 👋`}
                text={`Welcome to your Keystone Dashboard.\nLet's take a quick tour!`}
                order={1}
                name="dashboard-view"
              >
                <Row>
                  <Text variant="h1">My Day</Text>
                  <IconButton onPress={() => startTooltip()}>
                    <HelpIcon size={20} color={colors.darkBlue30} />
                  </IconButton>
                </Row>
              </Tooltip>
              <View flex={1} alignItems={"flex-end"}>
                <BookingsButton />
              </View>
            </Row>
          }
          refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
          innerRef={component => {
            this.dashboardList = component
          }}
          renderItem={item => {
            const { index } = item
            switch (index) {
              case 0:
                return (
                  <Tooltip
                    title="Feelings 😁"
                    text="Tracking your feelings daily is important for self-reflection and keeping an eye on your emotional balance."
                    order={2}
                    name="dashboard-feelings"
                    onStop={this.scrollToTop}
                    onNext={() => this.scrollToItem(1)}
                    onPrev={() => this.scrollToTop(false)}
                    scrollProps={{ maxHeight: 150 }}
                  >
                    <CardContainer style={{ height: 172 }} index={index}>
                      <DashboardCard
                        title="Feelings"
                        renderAction={() => (
                          <IconButton
                            icon="feelings"
                            onPress={navTo(navigation, routes.FeelingTrends, date)}
                          />
                        )}
                      >
                        <FeelingsOverview date={date} refresh={this.props.refresh} />
                      </DashboardCard>
                    </CardContainer>
                  </Tooltip>
                )
              case 1:
                return (
                  <FeatureContext feature="member_app_food_journal">
                    {showJournal => (
                      <Tooltip
                        title={showJournal ? "Food Journal 🍎" : "Nutrition 🍎"}
                        text={
                          showJournal
                            ? "An easy and fast way to track your food!"
                            : "Track what you eat every day - longer streaks will unlock new achievements. Consistency is key! Focus on reaching your calorie goal. See more nutrition tips in your diary."
                        }
                        order={3}
                        name="dashboard-nutrition"
                        onStop={this.scrollToTop}
                        onNext={() => this.scrollToItem(2)}
                        onPrev={() => this.scrollToItem(0)}
                      >
                        <CardContainer
                          style={{ minHeight: showJournal ? 270 : 316 }}
                          index={index}
                        >
                          <DashboardCard
                            title={showJournal ? "Food Journal" : "Nutrition"}
                            renderAction={() => (
                              <IconButton
                                icon="nutrition"
                                onPress={navTo(
                                  navigation,
                                  showJournal
                                    ? routes.NutritionJournal
                                    : routes.NutritionRoot,
                                  date
                                )}
                                onLongPress={() =>
                                  showJournal
                                    ? navTo(navigation, routes.NutritionRoot, date)()
                                    : null
                                }
                              />
                            )}
                          >
                            {showJournal ? (
                              <FoodJournalOverview
                                date={date}
                                refresh={this.props.refresh}
                              />
                            ) : (
                              <NutritionOverview
                                date={date}
                                refresh={this.props.refresh}
                              />
                            )}
                          </DashboardCard>
                        </CardContainer>
                      </Tooltip>
                    )}
                  </FeatureContext>
                )
              case 2:
                return (
                  <Tooltip
                    title="Training 🏋️"
                    text="Stay active every day! Be mindful of how much you walk during the day and try to reach approximately 10000 steps daily. Logging workouts is also important."
                    order={4}
                    name="dashboard-training"
                    onStop={this.scrollToTop}
                    onNext={() => this.scrollToItem(3)}
                    onPrev={() => this.scrollToItem(1)}
                  >
                    <CardContainer style={{ height: 260 }} index={index}>
                      <DashboardCard
                        title="Training"
                        renderAction={() => (
                          <IconButton
                            icon="training"
                            onPress={navTo(navigation, routes.TrainingRoot, date)}
                          />
                        )}
                      >
                        <TrainingOverview date={date} refresh={this.props.refresh} />
                      </DashboardCard>
                    </CardContainer>
                  </Tooltip>
                )
              case 3:
                return (
                  <Tooltip
                    title="Body 💪"
                    text="You can only manage what you measure. It is important to track your body metrics regularly."
                    order={5}
                    name="dashboard-body"
                    onPrev={() => this.scrollToItem(2)}
                    onFinish={this.scrollToTop}
                  >
                    <CardContainer style={{ minHeight: 192 }} index={index}>
                      <DashboardCard
                        title="Body"
                        renderAction={() => (
                          <IconButton
                            icon="body"
                            onPress={navTo(navigation, routes.BodyRoot, date)}
                          />
                        )}
                      >
                        <View flex={1} paddingHorizontal={20}>
                          <BodyOverview date={date} refresh={this.props.refresh} />
                        </View>
                      </DashboardCard>
                    </CardContainer>
                  </Tooltip>
                )
            }
          }}
          flex={1}
        />
      </Wrapper>
    )
  }
}
// -- HOC ---------------------------------------------------------------------
Dashboard.propTypes = { date: PropTypes.string.isRequired }
const renderSplash = withDailyData({
  left: renderComponent(() => <Splash message={"Loading your day"} />)
})
const renderNoAccessFlow = renderComponent(
  lifecycle({
    componentDidMount() {
      this.props.navigation.setParams({ hideNav: true })
    }
  })(NoAccess)
)
const renderWelcomeFlow = renderComponent(
  lifecycle({
    componentDidMount() {
      this.props.navigation.setParams({ hideNav: true, hideProfileButton: true })
    }
  })(Welcome)
)
const renderCollectDataFlow = renderComponent(
  lifecycle({
    componentDidMount() {
      this.props.navigation.setParams({ hideNav: true, hideProfileButton: true })
    }
  })(CollectData)
)
const renderNormalFlow = branch(
  ({ date }) => date && gqlDate(date) === gqlDate(today()),
  compose(
    connect(
      state => {
        const showWelcome = _.getOr(false, "onBoarding.showWelcome", state)
        return { showWelcome }
      },
      null
    ),
    branch(({ showWelcome }) => showWelcome, renderWelcomeFlow),
    renderSplash,
    withProps(props => {
      const firstName = _.getOr("", "data.currentMember.firstName", props)
      const isOnBoarded = _.getOr(true, "data.currentMember.isOnBoarded", props)
      return { firstName, isOnBoarded }
    }),
    branch(({ isOnBoarded }) => !isOnBoarded, renderCollectDataFlow),
    lifecycle({
      componentDidMount() {
        addApolloDep(this.props.client)
        this.props.navigation.setParams({ hideNav: false, hideProfileButton: false })
      }
    })
  )
)
const withAccountStatusCheck = compose(
  withAccountStatus,
  withLoader({ renderLoader: () => <Splash message="Checking your account" /> })
)
const withRefresh = compose(
  withState("refresh", "setRefresh", Date.now()),
  withHandlers({ handleRefresh: ({ setRefresh }) => () => setRefresh(Date.now()) })
)
const enhance = compose(
  withApollo,
  withAccountStatusCheck,
  withTooltip,
  withRefresh,
  withStepsSync(),
  branch(({ isAccountActive }) => !isAccountActive, renderNoAccessFlow, renderNormalFlow)
)
export default enhance(Dashboard)
