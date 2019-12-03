import { TouchableOpacity, View } from "glamorous-native"
import { compose, getContext, pure, withHandlers, lifecycle } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"
import numeral from "numeral"

import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from "kui/icons"
import { CircleGauge, GaugeWithTarget } from "kui/components/Gauge"
import { HelpIcon } from "scenes/Home/Icons"
import { IconButton, TextButtonForward } from "kui/components/Button"
import { Row } from "kui/components"
import { cals, titleCase } from "keystone"
import { routes } from "navigation/routes"
import { setSwitch } from "components/Switch/actions"
import Card from "kui/components/Card"
import Line from "kui/components/Line"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import Tooltip from "kui/components/Tooltip"
import _ from "lodash/fp"
import colors from "kui/colors"

const Header = props => {
  const { totals, profile, expanded, onProfilePress, onChevronClick } = props
  const { onTipsClick, onKitchenClick } = props
  const { startTooltip, onActionTap, onScrollToBottom } = props

  const calActual = totals.cals
  const calTarget = profile && profile.macros ? cals(profile.macros) : 0

  const proteinTarget = _.getOr(null, "macros.protein", profile)
  const fatTarget = _.getOr(null, "macros.fat", profile)
  const carbsTarget = _.getOr(null, "macros.carbs", profile)
  const hasProfile = profile && profile.label

  const isOverTarget = calTarget > 0 && calActual > calTarget
  const overTargetBy = isOverTarget ? ((calActual - calTarget) / calTarget) * 100 : 0
  const overTargetFormat = overTargetBy < 10 ? "0.[0]" : "0"

  return (
    <View>
      <Row alignItems="flex-end" spread>
        <Row>
          <Text variant="h1">Diary</Text>
          {false && (
            <IconButton
              onPress={() => {
                if (!expanded) onChevronClick()
                startTooltip()
              }}
              paddingHorizontal={12}
            >
              <HelpIcon size={20} color={colors.darkBlue30} />
            </IconButton>
          )}
        </Row>
        <Row>
          <Tooltip
            active={false}
            order={7}
            name="nutrition-manage-food"
            text="TODO: Create you own food, recipes, meals and day plans!"
            title="Manage Food"
            onPrev={onActionTap}
          >
            <TextButtonForward padding={5} label="MANAGE FOOD" onPress={onKitchenClick} />
          </Tooltip>
          <Tooltip
            order={8}
            name="nutrition-tips"
            text="TODO: text"
            title="Nutrition Tips"
          >
            <TextButtonForward padding={5} label="TIPS" onPress={onTipsClick} />
          </Tooltip>
        </Row>
      </Row>
      <Card marginTop={8} paddingVertical={16} backgroundColor={colors.darkBlue90}>
        <Tooltip
          active={false}
          order={1}
          name="nutrition-cals"
          text="TODO: text"
          title="Your calory goal and intake"
          onStop={onChevronClick}
          marginHorizontal={20}
        >
          <Row centerY>
            <View flex={1}>
              <GaugeWithTarget
                value={calActual}
                target={calTarget}
                label="DAILY TOTAL"
                measure="cal"
                targetColor={colors.darkBlue40}
                hasTarget={!!hasProfile}
                valueTextProps={{ fontSize: 22 }}
                targetTextProps={{ fontSize: 22 }}
                progressCircleProps={{
                  strokeWidth: 8,
                  backgroundColor: colors.darkBlue70
                }}
                showValueWithin={isOverTarget}
                renderInside={() =>
                  isOverTarget ? (
                    <View alignItems="center">
                      <Text
                        variant="h2"
                        color={colors.warningRed}
                        fontSize={16}
                        lineHeight={22}
                        marginBottom={-2}
                      >
                        {numeral(overTargetBy).format(overTargetFormat)}%
                      </Text>
                      <Text variant="caption1">over</Text>
                    </View>
                  ) : null
                }
              />
            </View>
            <IconButton marginRight={-10} onPress={onChevronClick}>
              {expanded ? (
                <ChevronUpIcon size={20} color={colors.darkBlue40} />
              ) : (
                <ChevronDownIcon size={20} color={colors.darkBlue40} />
              )}
            </IconButton>
          </Row>
        </Tooltip>
        {expanded && (
          <React.Fragment>
            {hasProfile && <Line marginTop={16} />}
            <View paddingHorizontal={20} paddingVertical={12}>
              {hasProfile && (
                <TouchableOpacity onPress={onProfilePress}>
                  <Tooltip
                    active={false}
                    order={2}
                    name="nutrition-profile"
                    text="TODO: text"
                    title="Your Nutrition Profile"
                    // active={!!hasProfile}
                    onStop={onChevronClick}
                  >
                    <Row centerY>
                      <InfoIcon />

                      <Text variant="caption2" paddingLeft={8}>
                        {titleCase(profile.label).toUpperCase()}
                      </Text>
                    </Row>
                  </Tooltip>
                </TouchableOpacity>
              )}
            </View>
            <Line marginBottom={16} />
            <Tooltip
              active={false}
              order={3}
              name="nutrition-pfc"
              text="TODO: text"
              title="Protein, Fat and Carbs"
              onStop={onChevronClick}
              onNext={() => {
                onChevronClick()
                onScrollToBottom()
              }}
              marginHorizontal={20}
            >
              <Row spread>
                <CircleGauge
                  value={totals.protein || "0"}
                  max={hasProfile ? proteinTarget : Infinity}
                  labelBelow={"PROTEIN (G)"}
                  color={colors.green50}
                  showValueWithin
                  hideTarget
                  renderInside={renderInside(hasProfile, proteinTarget)}
                />
                <CircleGauge
                  value={totals.fat || "0"}
                  max={hasProfile ? fatTarget : Infinity}
                  labelBelow={"FAT (G)"}
                  showValueWithin
                  hideTarget
                  renderInside={renderInside(hasProfile, fatTarget)}
                />
                <CircleGauge
                  value={totals.carbs || "0"}
                  max={hasProfile ? carbsTarget : Infinity}
                  labelBelow={"CARBS (G)"}
                  color={colors.turquoise50}
                  showValueWithin
                  hideTarget
                  renderInside={renderInside(hasProfile, carbsTarget)}
                />
              </Row>
            </Tooltip>
          </React.Fragment>
        )}
      </Card>
    </View>
  )
}

const renderInside = (hasProfile, target) => value => (
  <View alignItems="center">
    <Text variant="body2" fontSize={14}>
      {value}
      {hasProfile ? "" : "g"}
    </Text>
    {hasProfile && (
      <Text variant="caption2" opacity={0.6} lineHeight={12}>
        /{target}g
      </Text>
    )}
  </View>
)

Header.propTypes = {
  profile: PropTypes.shape({
    label: PropTypes.string.isRequired
  })
}

export const REDUX_KEY = "nutritionTrackerHeaderToggle"

const mapStateToProps = state => {
  const expanded = _.getOr(false, `ui.switches.${REDUX_KEY}`, state)
  return { expanded }
}

const mapDispatchToProps = dispatch => ({
  toggleHeader: value => dispatch(setSwitch(REDUX_KEY)(value))
})

export default compose(
  pure,
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    onChevronClick: props => () => props.toggleHeader(!props.expanded),
    onProfilePress: ({ navigation, profile }) => () =>
      navigation.navigate(routes.NutritionProfile, { profile }),
    onTipsClick: props => () => props.navigation.navigate(routes.NutritionTips),
    onKitchenClick: props => () => props.navigation.navigate(routes.KitchenRoot)
  }),
  getContext({ startTooltip: PropTypes.func, tooltipEvents: PropTypes.object }),
  lifecycle({
    componentDidMount() {
      this.props.tooltipEvents.on("prevStep", stepName => {
        if (stepName === "nutrition-pfc") {
          this.props.onChevronClick()
          this.props.onScrollToTop()
        }
      })
    }
  })
)(Header)
