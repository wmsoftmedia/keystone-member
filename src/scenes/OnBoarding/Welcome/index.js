import { Dimensions } from "react-native"
import { Image, ScrollView, View } from "glamorous-native"
import { compose, withHandlers, withState } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"

import { KeystoneK } from "kui/icons"
import { PrimaryButton, SecondaryButton } from "kui/components/Button"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import { setOnBoarding } from "scenes/OnBoarding/actions"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import body from "scenes/OnBoarding/Welcome/images/body.png"
import colors from "kui/colors"
import feelings from "scenes/OnBoarding/Welcome/images/feelings.png"
import nutrition from "scenes/OnBoarding/Welcome/images/nutrition.png"
import workouts from "scenes/OnBoarding/Welcome/images/workouts.png"

const width = Dimensions.get("window").width

const FEATURES = [
  () => (
    <View flex={1} alignItems="center" paddingHorizontal={20} justifyContent="center">
      <KeystoneK scale={0.63} />
      <Text variant="h1" paddingTop={40} textAlign="center" fontSize={32}>
        {`Welcome to\nKeystone`}
      </Text>
      <Text variant="h2" paddingVertical={28} textAlign="center">
        {`Let's take a quick tour.`}
      </Text>
    </View>
  ),
  () => (
    <View flex={1} alignItems="center">
      <Text
        variant="h1"
        paddingBottom={18}
        textAlign="center"
        fontSize={22}
        lineHeight={28}
      >
        Track your Feelings
      </Text>
      <Text variant="body1" textAlign="center" paddingHorizontal={40}>
        Track your feelings daily. It is important for self-reflection and emotional
        balance.
      </Text>
      <View flex={1} paddingLeft={36} paddingVertical={10}>
        <Image flex={1} source={feelings} width={width - 36} resizeMode="contain" />
      </View>
    </View>
  ),
  () => (
    <View flex={1} alignItems="center">
      <Text
        variant="h1"
        paddingBottom={18}
        textAlign="center"
        fontSize={22}
        lineHeight={28}
      >
        Control your Nutrition
      </Text>
      <Text variant="body1" textAlign="center" paddingHorizontal={40}>
        Stay in control of what you eat. Create your own meals, days, recipes or search
        food. Review your weekly food intake.
      </Text>
      <View flex={1}>
        <View flex={1} paddingVertical={10}>
          <Image flex={1} source={nutrition} width={width} resizeMode="contain" />
        </View>
      </View>
    </View>
  ),
  () => (
    <View flex={1} alignItems="center">
      <Text
        variant="h1"
        paddingBottom={18}
        textAlign="center"
        fontSize={22}
        lineHeight={28}
      >
        Track your Workouts
      </Text>
      <Text variant="body1" textAlign="center" paddingHorizontal={40}>
        Follow workouts in hands-free focus mode or log at any time. Review exercise
        history and your monthly training trends.
      </Text>
      <View flex={1}>
        <View flex={1} paddingVertical={10}>
          <Image flex={1} source={workouts} width={width} resizeMode="contain" />
        </View>
      </View>
    </View>
  ),
  () => (
    <View flex={1} alignItems="center">
      <Text
        variant="h1"
        paddingBottom={18}
        textAlign="center"
        fontSize={22}
        lineHeight={28}
      >
        Track your Progress
      </Text>
      <Text variant="body1" textAlign="center" paddingHorizontal={40}>
        You can only manage what you measure. It is important to track your body metrics
        regularly.
      </Text>
      <View flex={1}>
        <View flex={1} paddingVertical={10}>
          <Image flex={1} source={body} width={width} resizeMode="contain" />
        </View>
      </View>
    </View>
  )
]

class Welcome extends React.Component {
  scrollNext = (animated = true) => {
    const {
      featureList,
      props: { featureIndex, setFeatureIndex }
    } = this
    const nextFeatureIndex = featureIndex + 1
    featureList.scrollTo({ animated, x: nextFeatureIndex * width })
    setFeatureIndex(nextFeatureIndex)
  }

  render() {
    const { scrollNext } = this
    const { featureIndex, onMomentumScrollEnd, onWelcomeDone } = this.props
    const featuresNumber = FEATURES.length

    return (
      <Screen>
        <View flex={1} paddingBottom={20}>
          <ScrollView
            horizontal
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            innerRef={component => (this.featureList = component)}
            onMomentumScrollEnd={onMomentumScrollEnd}
          >
            {FEATURES.map((item, i) => (
              <View width={width} flex={1} key={i}>
                {item()}
              </View>
            ))}
          </ScrollView>
          <View paddingBottom={32} alignItems="center">
            <Pagination pages={featuresNumber} selectedPage={featureIndex} />
          </View>
          {featureIndex < featuresNumber - 1 ? (
            <View paddingHorizontal={46}>
              <PrimaryButton
                label="NEXT"
                onPress={() => scrollNext()}
                marginBottom={16}
              />
              <SecondaryButton
                label="SKIP"
                onPress={onWelcomeDone}
                labelProps={{ color: colors.white50 }}
              />
            </View>
          ) : (
            <View paddingHorizontal={46} paddingBottom={64}>
              <PrimaryButton label="GO" onPress={onWelcomeDone} />
            </View>
          )}
        </View>
      </Screen>
    )
  }
}

const Pagination = ({ pages, selectedPage = 0 }) => {
  return (
    <Row>
      {_.range(0, pages).map(p => (
        <View
          key={p}
          height={4}
          borderRadius={2}
          marginHorizontal={6}
          backgroundColor={p === selectedPage ? colors.blue60 : colors.darkBlue80}
          width={p === selectedPage ? 20 : 6}
        />
      ))}
    </Row>
  )
}

const enhance = compose(
  withNavigation,
  connect(
    null,
    dispatch => {
      return {
        onWelcomeDone: () => dispatch(setOnBoarding("showWelcome")(false))
      }
    }
  ),
  withState("featureIndex", "setFeatureIndex", 0),
  withHandlers({
    onMomentumScrollEnd: ({ setFeatureIndex }) => event => {
      const selectedPage = event.nativeEvent.contentOffset.x / width
      setFeatureIndex(selectedPage)
    }
  })
)

export default enhance(Welcome)
