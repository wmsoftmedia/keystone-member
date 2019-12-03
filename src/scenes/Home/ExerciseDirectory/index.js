import { FlatList, View, TouchableOpacity } from "glamorous-native"
import { RefreshControl } from "react-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import { defaultProps, setPropTypes, lifecycle, branch } from "recompose"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"
import PropTypes from "prop-types"
import _ from "lodash/fp"

import { Row } from "kui/components"
import { IconButton, PrimaryButton } from "kui/components/Button"
import { SortIcon, FilterIcon } from "kui/icons"
import { Screen } from "components/Background"
import { TextInput } from "kui/components/Input"
import Checkbox from "kui/components/Checkbox"
import { allExercises } from "graphql/query/training/exercises"
import Card from "kui/components/Card"
import InfoMessage from "components/InfoMessage"
import Text from "kui/components/Text"
import colors, { gradients } from "kui/colors"
import { filterFuzzy } from "keystone"

const MIN_CHARS = 0

const PAGE_SIZE = 20

const initialFilterValues = { targetMuscle: [], equipment: [], family: [] }

const ExercisesItem = compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      return (
        nextProps.selected !== this.props.selected ||
        !_.isEqual(nextProps.item, this.props.item)
      )
    }
  })
)(props => {
  const { item, selected, selectable, onItemClick, onSelect } = props
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => onItemClick(item)}
      marginHorizontal={20}
    >
      <Card color={colors.darkBlue90} paddingHorizontal={16} paddingVertical={12}>
        <Row spread>
          <View flex={0.45} paddingRight={4}>
            <Row>
              {selectable ? (
                <Checkbox
                  checked={selected}
                  marginLeft={-4}
                  flex={1}
                  label={_.trim(item.name)}
                  labelProps={{
                    fontSize: 14,
                    lineHeight: 18,
                    flex: 1,
                    marginLeft: 8
                  }}
                  onChange={() => onSelect(item.id)}
                />
              ) : (
                <Text flex={1} variant="body1" fontSize={14} lineHeight={18}>
                  {_.trim(item.name)}
                </Text>
              )}
            </Row>
          </View>
          <Row flex={0.55} spread>
            <View paddingRight={2} flex={1}>
              <Text variant="caption2" color={colors.darkBlue30} numberOfLines={1}>
                EQUIPMENT
              </Text>
              <Text variant="caption1" numberOfLines={1}>
                {item.equipment || "--"}
              </Text>
            </View>
            <View flex={1}>
              <Text variant="caption2" color={colors.darkBlue30} numberOfLines={1}>
                MUSCLE GROUP
              </Text>
              <Text variant="caption1" numberOfLines={1}>
                {item.targetMuscle || "--"}
              </Text>
            </View>
          </Row>
        </Row>
      </Card>
    </TouchableOpacity>
  )
})

const ExercisesList = props => {
  const { exercises, page, isLoading, selectedItems, setPage, selectable } = props
  const { onSelect, onItemClick } = props

  return (
    <FlatList
      flex={1}
      data={exercises}
      removeClippedSubviews={true}
      keyExtractor={(item, i) => String(i)}
      stickySectionHeadersEnabled={false}
      refreshControl={<RefreshControl refreshing={isLoading} />}
      onEndReached={() => setPage(page + 1)}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={() =>
        !isLoading && (
          <InfoMessage
            title="No results"
            subtitle={`There are no exercises\nmatching your criteria`}
          />
        )
      }
      renderItem={({ item, index }) => (
        <ExercisesItem
          index={index}
          item={item}
          selectable={selectable}
          selected={selectedItems.indexOf(item.id) !== -1}
          onItemClick={onItemClick}
          onSelect={onSelect}
        />
      )}
      ItemSeparatorComponent={() => <View paddingTop={8} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  )
}

const ExerciseDirectory = props => {
  const { term, exercises, isLoading, page, totalExercises, filtersCount } = props
  const { onSearchChange, onItemClick, setPage, onSortClick, onFilterClick } = props
  const { selectable, selectedItems, onSelect, onSave } = props
  return (
    <Screen>
      <View paddingHorizontal={20}>
        <TextInput
          value={term}
          placeholder="Exercise name"
          onChange={onSearchChange}
          selectTextOnFocus
        />
      </View>

      {!!totalExercises && (
        <View paddingHorizontal={20} paddingTop={0}>
          <Row spread marginHorizontal={-10}>
            <IconButton onPress={() => onSortClick()}>
              <Row centerY>
                <SortIcon />
                <Text variant="button1" marginLeft={4}>
                  SORT
                </Text>
              </Row>
            </IconButton>
            <IconButton onPress={() => onFilterClick()}>
              <Row centerY opacity={filtersCount ? 1 : 0.5}>
                <FilterIcon />
                <Text variant="button1" marginLeft={4}>
                  FILTER{filtersCount ? " (" + filtersCount + ")" : ""}
                </Text>
              </Row>
            </IconButton>
          </Row>
        </View>
      )}

      <ExercisesList
        isLoading={isLoading}
        page={page}
        selectable={selectable}
        selectedItems={selectedItems}
        onSelect={onSelect}
        exercises={exercises}
        setPage={setPage}
        onItemClick={onItemClick}
      />
      {selectable && (
        <View
          paddingHorizontal={20}
          paddingBottom={20}
          paddingTop={10}
          backgroundColor={gradients.bg[1]}
          elevation={15}
          shadowOpacity={0.4}
          shadowColor={colors.black}
          shadowOffset={{ width: 0, height: 0 }}
          shadowRadius={20}
        >
          <PrimaryButton
            label={
              selectedItems.length > 0
                ? "ADD " +
                  selectedItems.length +
                  " EXERCISE" +
                  (selectedItems.length > 1 ? "S" : "")
                : "CLOSE"
            }
            onPress={onSave}
          />
        </View>
      )}
    </Screen>
  )
}

const enhance = compose(
  withNavigation,
  withMappedNavigationParams(),
  defaultProps({
    selectable: false,
    onSaveSelect: () => {},
    customExercises: []
  }),
  setPropTypes({
    selectable: PropTypes.bool,
    selected: PropTypes.array,
    onSaveSelect: PropTypes.func
  }),
  withState("term", "setTerm", ({ term }) => term || ""),
  withState("selectedItems", "setSelectedItems", ({ selected }) => selected || []),
  withState("sort", "setSort", "name"),
  withState("filterValues", "setFilterValues", initialFilterValues),
  withState("page", "setPage", 1),
  withState("page", "setPage", 1),
  withState("debouncing", "setDebouncing", true),
  lifecycle({
    componentDidMount() {
      this.props.setDebouncing(false)
    }
  }),
  branch(({ debouncing }) => !debouncing, allExercises),
  withProps(props => {
    const { page, sort, filterValues, customExercises } = props
    const isLoading = _.getOr(true, "data.loading", props)
    // for optimizatoin do not show list while exercises loading
    const nodes = _.getOr([], "data.allExercises.nodes", props)

    const allExercises = nodes.map(ex => {
      const { overrides, ...restExercise } = ex
      return {
        ...restExercise,
        ...(_.getOr({}, "nodes[0]", overrides) || {})
      }
    })
    const allWithCustoms = [
      ...allExercises,
      ...(customExercises || []).map(e => ({ ...e, custom: true }))
    ]

    const exercises =
      props.term.length > MIN_CHARS - 1
        ? filterFuzzy(props.term, allWithCustoms, el => el.name)
        : []
    const totalExercises = exercises.length

    const muscles = _.uniqWith(
      _.isEqual,
      exercises.reduce((acc, e) => {
        return e.targetMuscle
          ? [
              ...acc,
              ..._.split(",", e.targetMuscle).map(tm => {
                return { value: _.trim(tm), label: _.trim(tm) }
              })
            ]
          : acc
      }, [])
    )

    const equipments = _.uniqWith(
      _.isEqual,
      exercises.reduce((acc, e) => {
        return e.equipment
          ? [
              ...acc,
              ..._.split(",", e.equipment).map(tm => {
                return { value: _.trim(tm), label: _.trim(tm) }
              })
            ]
          : acc
      }, [])
    )

    const families = _.uniqWith(
      _.isEqual,
      exercises.reduce((acc, e) => {
        return e.family
          ? [
              ...acc,
              ..._.split(",", e.family).map(tm => {
                return { value: _.trim(tm), label: _.trim(tm) }
              })
            ]
          : acc
      }, [])
    )

    const hasOneOfValues = (str, values) =>
      values.length == 0 || (str && values.filter(v => str.indexOf(v) !== -1).length)

    const filteredExercises = exercises.filter(
      e =>
        hasOneOfValues(e.equipment, filterValues.equipment || []) &&
        hasOneOfValues(e.targetMuscle, filterValues.targetMuscle || [])
    )

    const sortedExercises = _.sortBy(sort, filteredExercises)

    const exercisesToShow = _.slice(0, PAGE_SIZE * page, sortedExercises)

    return {
      isLoading,
      totalExercises: totalExercises,
      exercises: exercisesToShow,
      filtersCount:
        (filterValues.targetMuscle && filterValues.targetMuscle.length ? 1 : 0) +
        (filterValues.equipment && filterValues.equipment.length ? 1 : 0),
      filters: [
        {
          id: "targetMuscle",
          title: "Target muscle",
          values: filterValues.targetMuscle,
          items: muscles
        },
        {
          id: "equipment",
          title: "Equipment",
          values: filterValues.equipment,
          items: equipments
        },
        {
          id: "family",
          title: "Category",
          values: filterValues.family,
          items: families
        }
      ]
    }
  }),
  withHandlers({
    onSearchChange: ({ setTerm, setPage, setFilterValues }) => value => {
      setPage(1)
      setFilterValues(initialFilterValues)
      setTerm(value)
    },
    onItemClick: ({ navigation }) => item => {
      !item.custom &&
        navigation.navigate("ExerciseInfo", {
          exerciseId: item.id
        })
    },
    onSortClick: ({ navigation, sort, setSort }) => () => {
      navigation.navigate("PopupPicker", {
        value: sort,
        title: "Sort by",
        items: [
          { value: "name", label: "Name" },
          { value: "targetMuscle", label: "Muscle group" },
          { value: "equipment", label: "Equipment" }
        ],
        onSelect: item => {
          setSort(item.value)
        }
      })
    },
    onFilterClick: ({ navigation, filters, setFilterValues }) => () => {
      navigation.navigate("PopupFilter", {
        filters,
        clearFilter: true,
        onSetFilter: filterValues => {
          setFilterValues(filterValues)
        }
      })
    },
    onSelect: ({ selectedItems, setSelectedItems }) => id => {
      setSelectedItems(
        selectedItems.indexOf(id) !== -1
          ? selectedItems.filter(si => si !== id)
          : [...selectedItems, id]
      )
    },
    onSave: ({ data, onSaveSelect, selected, selectedItems, customExercises }) => () => {
      const exercises = _.getOr([], "allExercises.nodes", data).map(ex => {
        const { overrides, ...restExercise } = ex
        return {
          ...restExercise,
          ...(_.getOr({}, "nodes[0]", overrides) || {})
        }
      })

      const allWithCustoms = [...exercises, ...customExercises]

      const prevItems = selected.filter(s => selectedItems.indexOf(s) !== -1)
      const newItems = selectedItems.reduce(
        (acc, s) => (prevItems.indexOf(s) !== -1 ? acc : [...acc, s]),
        prevItems
      )

      const items = newItems
        .map(id => allWithCustoms.find(e => e.id === id))
        .filter(e => !!e)

      onSaveSelect(items)
    }
  })
)

export default enhance(ExerciseDirectory)
