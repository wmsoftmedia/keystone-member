import { compose, withProps, withHandlers } from "recompose"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { ScrollView, View } from "glamorous-native"
import { Dimensions } from "react-native"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"
import _ from "lodash/fp"

import { ModalScreen } from "components/Background"
import { TextButtonForward, PrimaryButton } from "kui/components/Button"
import { routes } from "navigation/routes"
import { withLoader } from "hoc/withLoader"
import Text from "kui/components/Text"
import Line from "kui/components/Line"
import { Row } from "kui/components"
import colors from "kui/colors"

import TargetMuscle from "scenes/Home/TrainingV3/ExerciseInfo/TargetMuscle"
import Media from "scenes/Home/TrainingV3/ExerciseInfo/Media"

export const EXERCISE_INFO_BY_ID = gql`
  query ExerciseInfoById($exerciseId: Uuid!) {
    exerciseById(id: $exerciseId) {
      id
      name
      instructions
      targetMuscle
      equipment
      type
      media
      overrides: exerciseOverridesByExerciseId(first: 1) {
        nodes {
          name
          instructions
          targetMuscle
          equipment
          type
          media
        }
      }
    }
  }
`

const exerciseInfoByExerciseId = graphql(EXERCISE_INFO_BY_ID, {
  options: ({ exerciseId }) => ({
    fetchPolicy: "network-only",
    variables: { __offline__: true, exerciseId },
    notifyOnNetworkStatusChange: true
  })
})

const enhance = compose(
  withNavigation,
  exerciseInfoByExerciseId,
  withLoader({ color: colors.white50 }),
  withProps(props => {
    const exercise = props.data.exerciseById
    const overrides = _.getOr({}, "overrides.nodes[0]", exercise)
    const info = {
      ...exercise,
      ...overrides
    }
    return {
      info: {
        ...info,
        media: info.media || []
      }
    }
  }),
  withHandlers({
    onExerciseHistoryClick: ({ navigation, info }) => () => {
      navigation.navigate(routes.ExerciseLookup, { term: info.name })
    }
  })
)

const InfoSection = ({ title, text }) => {
  return (
    !!text && (
      <View marginBottom={20}>
        <Text variant="button1" color={colors.darkBlue20}>
          {title}
        </Text>
        <Text variant="body1" marginTop={12}>
          {text}
        </Text>
      </View>
    )
  )
}

const ExerciseContent = enhance(props => {
  const { info, onBack } = props
  const { width } = Dimensions.get("window")

  return (
    <View flex={1}>
      <View paddingHorizontal={20}>
        <Text variant="h1" fontSize={20}>
          {info.name}
        </Text>
        <Row marginTop={16}>
          <View flex={1} />
          <TextButtonForward
            margin={-10}
            label="EXERCISE LOG"
            onPress={props.onExerciseHistoryClick}
          />
        </Row>
        <Line marginTop={16} marginHorizontal={0} color={colors.darkBlue80} />
      </View>

      <ScrollView flex={1}>
        {info.media.length > 0 && <Media items={info.media} marginTop={20} />}

        {info.targetMuscle ? (
          <TargetMuscle size={width} targetMuscle={info.targetMuscle} />
        ) : null}

        <View paddingHorizontal={20} marginTop={20}>
          <InfoSection title="DESCRIPTION" text={info.instructions} />

          <InfoSection title="EQUIPMENT" text={info.equipment} />

          <InfoSection title="TYPE" text={info.type} />
        </View>
      </ScrollView>

      <PrimaryButton
        label="GOT IT"
        marginHorizontal={20}
        marginBottom={20}
        onPress={() => onBack()}
      />
    </View>
  )
})

const ExerciseInfo = props => {
  return (
    <ModalScreen paddingTop={20}>
      <ExerciseContent exerciseId={props.exerciseId} onBack={props.navigation.goBack} />
    </ModalScreen>
  )
}

export default withNavigation(withMappedNavigationParams()(ExerciseInfo))
