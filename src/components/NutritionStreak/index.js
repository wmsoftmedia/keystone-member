import { LinearGradient } from "expo-linear-gradient"
import { Text, TouchableOpacity, View } from "glamorous-native"
import { compose, defaultProps, withProps } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"

import { calcAchievementInfo } from "components/NutritionStreak/achievement"
import { homeRoutes } from "navigation/routes"
import Row from "components/Row"
import _ from "lodash/fp"
import colors from "kui/colors"
import fonts from "kui/fonts"

const Title = props => (
  <Text
    color={colors.white}
    fontFamily={fonts.montserratSemiBold}
    fontSize={15}
    lineHeight={16}
    paddingBottom={8}
  >
    {props.children}
  </Text>
)

const SubTitle = props => (
  <Text
    fontSize={12}
    lineHeight={16}
    color={colors.white50}
    paddingBottom={12}
    numberOfLines={1}
  >
    {props.children}
  </Text>
)

const MapLabel = props => (
  <Text fontSize={10} lineHeight={16} color={colors.blue20}>
    {props.children}
  </Text>
)

const Chip = props => {
  const { progress = 1, gradient } = props
  return (
    <View borderRadius={4} height={8} flex={1} backgroundColor={colors.darkBlue70}>
      {
        <LinearGradient
          colors={gradient}
          start={[0, 0.5]}
          end={[1, 0.5]}
          style={{
            borderRadius: 4,
            height: 8,
            flex: 1,
            width: `${progress * 100}%`
          }}
        />
      }
    </View>
  )
}

const NutritionStreak = props => {
  const { streak, achievementInfo, navigation } = props
  const {
    icon,
    title,
    message,
    startLabel,
    endLabel,
    segments,
    len,
    gradient
  } = achievementInfo
  return (
    <View flex={1}>
      <Title>{title}</Title>
      <SubTitle>{message}</SubTitle>
      <Row justifyContent="space-between" alignItems={"center"} width={"100%"}>
        <TouchableOpacity
          borderRadius={8}
          width={36}
          height={36}
          marginRight={12}
          onPress={() => navigation.navigate(homeRoutes.NutritionAchievements)}
        >
          {icon ? icon() : null}
        </TouchableOpacity>
        <View flex={1}>
          <Row justifyContent="space-between" paddingBottom={4}>
            <MapLabel>{startLabel}</MapLabel>
            <MapLabel>{endLabel}</MapLabel>
          </Row>
          <Row justifyContent="space-between">
            {_.range(0, segments).map((v, i) => {
              const s = len / segments
              const delta = streak - i * s
              const progress = delta >= s ? 1 : delta < 0 ? 0 : (streak % s) / s
              return (
                <React.Fragment key={String(i)}>
                  <Chip key={String(i)} progress={progress} gradient={gradient} />
                  {i !== segments - 1 && <View width={10} />}
                </React.Fragment>
              )
            })}
          </Row>
        </View>
      </Row>
    </View>
  )
}

const enhance = compose(
  defaultProps({ streak: 0 }),
  withProps(props => {
    const { streak } = props
    const achievementInfo = calcAchievementInfo(streak)
    return { achievementInfo }
  }),
  withNavigation
)

export default enhance(NutritionStreak)
