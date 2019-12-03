import { Dimensions } from "react-native"
import { ScrollView, TouchableOpacity, View } from "glamorous-native"
import { compose, withState } from "recompose"
import React from "react"
import _ from "lodash/fp"

import { AvocadoIcon, AppleIcon, OrangeIcon, MelonIcon } from "kui/icons"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import Switch from "kui/components/Switch"
import Text from "kui/components/Text"
import colors from "kui/colors"

const windowWidth = Dimensions.get("window").width

const TABS = ["AVOCADO", "APPLE", "ORANGE", "MELON"]
const ACHIEVEMENTS = {
  AVOCADO: {
    icon: AvocadoIcon,
    name: "Beginner Avocado",
    description: `The first challenge is to\ntrack consistently for 7 days straight.`,
    renderGrid: () => (
      <Grid
        rows={4}
        columns={7}
        color={colors.green50}
        highlighted={7}
        Icon={AvocadoIcon}
      />
    )
  },
  APPLE: {
    icon: AppleIcon,
    name: "Amateur Apple",
    description: `Track consistently for 28 days in a row\n to become Professor Orange.`,
    renderGrid: () => (
      <Grid rows={4} columns={7} color={colors.red50} highlighted={28} Icon={AppleIcon} />
    )
  },
  ORANGE: {
    icon: OrangeIcon,
    name: "Professor Orange",
    description: "Try to create a streak of 90 days to progress to the highest level!",
    renderGrid: () => (
      <Grid
        rows={4}
        columns={4}
        color={colors.orange50}
        highlighted={3}
        labels={["JUNE", "JULY", "AUGUST", ""]}
        Icon={OrangeIcon}
      />
    )
  },
  MELON: {
    icon: MelonIcon,
    name: "Melon Master",
    description:
      "This is the hardest challenge! Track for 90+ days to unlock new achievements.",
    renderGrid: () => (
      <Grid
        rows={4}
        columns={4}
        color={colors.yellow50}
        highlighted={6}
        labels={["JUNE", "JULY", "AUGUST", ""]}
        Icon={MelonIcon}
      />
    )
  }
}

export const TouchableItem = ({ disabled, selected, label, onPress }) => {
  const Icon = ACHIEVEMENTS[label].icon

  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      onPress={onPress}
      flex={1}
      justifyContent="center"
      alignItems="center"
      alignSelf="stretch"
      marginHorizontal={6}
      paddingVertical={2}
      paddingHorizontal={12}
      borderRadius={20}
      opacity={disabled ? 0.3 : 1}
      backgroundColor={selected ? colors.darkBlue60 : colors.transparent}
    >
      {Icon ? (
        <Icon />
      ) : (
        <Text variant="caption2" opacity={selected ? 1 : 0.5}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const Achievements = props => {
  const { selectedTab, setSelectedTab } = props

  return (
    <Screen>
      <View paddingHorizontal={20}>
        <Switch
          values={TABS}
          value={TABS.findIndex(t => t === selectedTab)}
          onChange={i => setSelectedTab(TABS[i])}
          touchableItem={TouchableItem}
        />
      </View>
      <ScrollView>
        <View flex={1} paddingHorizontal={20}>
          <TabContent {...ACHIEVEMENTS[selectedTab]} />
        </View>
      </ScrollView>
    </Screen>
  )
}

const TabContent = ({ name, description, renderGrid }) => {
  return (
    <View flex={1} paddingTop={30}>
      <Text
        variant="h1"
        fontSize={22}
        fontHeight={28}
        paddingBottom={20}
        textAlign="center"
      >
        {name}
      </Text>
      <Text variant="body1" textAlign="center" paddingBottom={28}>
        {description}
      </Text>
      {renderGrid && renderGrid()}
      <Text
        variant={"caption1"}
        color={colors.darkBlue30}
        paddingHorizontal={10}
        paddingBottom={20}
      >
        Note: You have to stay within 20% of your caloric target for a day to be included
        in the current streak.
      </Text>
    </View>
  )
}

const Grid = ({
  rows = 4,
  columns = 7,
  highlighted = 0,
  labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  color = colors.green50,
  Icon
}) => {
  const iconSize = Math.round(windowWidth * 0.35)
  const cellPadding = Math.round(windowWidth * 0.038)
  const cellSize = Math.round((windowWidth - (90 - cellPadding)) / columns) - cellPadding

  return (
    <View flex={1} paddingHorizontal={10} paddingBottom={32}>
      <View flex={1} paddingRight={30}>
        {labels && (
          <Row spread paddingBottom={8}>
            {labels.map(l => (
              <Text key={l} variant="caption2" width={cellSize} textAlign="center">
                {l}
              </Text>
            ))}
          </Row>
        )}
        {_.range(0, rows).map(r => (
          <Row spread key={r} paddingBottom={cellPadding}>
            {_.range(0, columns).map(c => {
              const isHighlighted = r * columns + c < highlighted
              return (
                <View
                  key={c}
                  width={cellSize}
                  height={cellSize}
                  backgroundColor={isHighlighted ? color : colors.darkBlue80}
                  borderRadius={4}
                />
              )
            })}
          </Row>
        ))}
      </View>
      {Icon && (
        <View
          position="absolute"
          right={10}
          bottom={16}
          backgroundColor={colors.darkBlue90}
          borderRadius={4}
          overflow="visible"
          height={iconSize}
        >
          <Icon size={iconSize} />
        </View>
      )}
    </View>
  )
}

const enhance = compose(withState("selectedTab", "setSelectedTab", TABS[0]))

export default enhance(Achievements)
