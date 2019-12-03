import { RefreshControl } from "react-native"
import { SectionList, View } from "glamorous-native"
import {
  branch,
  compose,
  defaultProps,
  renderComponent,
  withHandlers,
  withProps,
  withState
} from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"
import moment from "moment"

import { Row } from "kui/components"
import { Screen } from "components/Background"
import { TextInput } from "kui/components/Input"
import { debounceTermProp } from "keystone/stream"
import { exerciseAttemptsByName } from "graphql/query/training/exerciseAttemps"
import { withSettings } from "hoc"
import Card from "kui/components/Card"
import InfoMessage from "components/InfoMessage"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const MIN_CHARS = 3

const EmptySearch = () => (
  <InfoMessage
    justifyContent="flex-start"
    title="Start typing..."
    subtitle={`Enter exercise name to lookup\nMin ${MIN_CHARS} letters required`}
  />
)

const ExerciseAttemptsList = compose(
  defaultProps({ term: "", limit: 50 }),
  branch(
    ({ term }) => term && term.length >= MIN_CHARS,
    compose(
      debounceTermProp(),
      exerciseAttemptsByName
    ),
    renderComponent(EmptySearch)
  ),
  withProps(props => {
    const attempts = _.getOr([], "data.currentMember.exerciseAttemptsByName.nodes", props)
    const isLoading = _.getOr(false, "data.loading", props)
    const sections = attempts.reduce((acc, a, i) => {
      const index = acc.findIndex(s => s.title === a.date)
      if (index !== -1) {
        acc[index].data = [...acc[index].data, a]
        return acc
      } else {
        return [...acc, { title: a.date, data: [a] }]
      }
    }, [])

    return { sections, isLoading }
  }),
  withHandlers({
    handleRefresh: props => done => {
      props.data
        .refetch()
        .then(done)
        .catch(done)
    }
  })
)(props => {
  const { sections, isLoading, handleRefresh, weightConverter, weightUnit } = props
  return (
    <SectionList
      flex={1}
      sections={sections}
      keyExtractor={(item, i) => String(i)}
      stickySectionHeadersEnabled={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
      ListEmptyComponent={() =>
        isLoading ? null : (
          <InfoMessage
            title="No results"
            subtitle={`There are no exercise attempts\nmatching your criteria`}
          />
        )
      }
      renderItem={({ item }) => (
        <Card
          color={colors.darkBlue90}
          marginHorizontal={20}
          paddingHorizontal={16}
          paddingVertical={12}
        >
          <Row spread>
            <View flex={0.65} paddingRight={4}>
              <Text variant="body1" fontSize={14} lineHeight={18}>
                {_.trim(item.exerciseName)}
              </Text>
            </View>
            <Row flex={0.35} spread>
              <View paddingRight={2} flex={1}>
                <Text variant="caption2" color={colors.darkBlue30}>
                  EFFORT
                </Text>
                <Text variant="caption1" numberOfLines={1}>
                  {item.effort || "--"}
                </Text>
              </View>
              <View flex={1}>
                <Text variant="caption2" color={colors.darkBlue30}>
                  LOAD
                </Text>
                <Text variant="caption1" numberOfLines={1}>
                  {item.weightValue
                    ? weightConverter(item.weightValue) + " " + weightUnit
                    : "--"}
                </Text>
              </View>
            </Row>
          </Row>
        </Card>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Row centerY justifyContent="flex-end" marginHorizontal={20}>
          <Text variant="caption1" color={colors.darkBlue30}>
            {moment(title).format("ddd, DD MMM")}
          </Text>
        </Row>
      )}
      ItemSeparatorComponent={() => <View paddingTop={8} />}
      SectionSeparatorComponent={({ trailingItem, trailingSection }) => (
        <View paddingTop={trailingItem ? 12 : trailingSection ? 20 : 0} />
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  )
})

const ExerciseLookup = props => {
  const { term, onSearchChange, weightConverter, weightUnit } = props
  return (
    <Screen>
      <View paddingHorizontal={20} paddingBottom={16}>
        <TextInput
          value={term}
          placeholder="Exercise name"
          onChange={onSearchChange}
          selectTextOnFocus
        />
      </View>
      <ExerciseAttemptsList
        term={term}
        weightConverter={weightConverter}
        weightUnit={weightUnit}
      />
    </Screen>
  )
}

const enhance = compose(
  withMappedNavigationParams(),
  withSettings,
  withState("term", "setTerm", ({ term }) => term),
  withHandlers({
    onSearchChange: ({ setTerm }) => value => setTerm(value)
  })
)

export default enhance(ExerciseLookup)
