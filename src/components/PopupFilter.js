import { FlatList, View, TouchableOpacity } from "glamorous-native"
import { compose, defaultProps, setPropTypes, withHandlers, withState } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"
import _ from "lodash/fp"

import { ModalScreen } from "components/Background"
import Text from "kui/components/Text"
import Line from "kui/components/Line"
import { PrimaryButton, SecondaryButton } from "kui/components/Button"
import Checkbox from "kui/components/Checkbox"
import { Row } from "kui/components"
import PropTypes from "prop-types"
import colors from "kui/colors"

const CheckboxFilter = ({
  values,
  items,
  valueExtractor,
  labelExtractor,
  onItemClick,
  filterId
}) => (
  <View marginVertical={8}>
    {items.map((item, i) => {
      const selected =
        _.findIndex(v => valueExtractor(v) === valueExtractor(item), values) !== -1
      return (
        <Row key={i} marginVertical={12}>
          <Checkbox
            label={labelExtractor(item)}
            checked={selected}
            onChange={() => onItemClick(filterId, item)}
          />
        </Row>
      )
    })}
  </View>
)

const TagsFilter = ({
  values,
  items,
  valueExtractor,
  labelExtractor,
  onItemClick,
  filterId
}) => (
  <View marginVertical={16}>
    <Row flexWrap="wrap" margin={-6}>
      {items.map((item, i) => {
        const selected =
          _.findIndex(v => valueExtractor(v) === valueExtractor(item), values) !== -1
        return (
          <TouchableOpacity
            key={i}
            backgroundColor={selected ? colors.darkBlue60 : colors.transparent}
            activeOpacity={0.5}
            onPress={() => onItemClick(filterId, item)}
            borderRadius={20}
            paddingHorizontal={12}
            paddingVertical={8}
            margin={6}
          >
            <Text variant="caption2" opacity={selected ? 1 : 0.5}>
              {(labelExtractor(item) || "").toUpperCase()}
            </Text>
          </TouchableOpacity>
        )
      })}
    </Row>
  </View>
)

const PopupFilter = props => {
  const { onItemClick, filterValues, filterIdExtractor } = props

  const count = _.keys(filterValues).reduce((a, k) => a + filterValues[k].length, 0)

  const filters = props.filters.filter(f => (f.items || []).length)

  return (
    <ModalScreen
      flex={1}
      justifyContent="flex-end"
      grabby
      gradient={false}
      backgroundColor={colors.darkBlue80}
    >
      <FlatList
        flex={1}
        data={filters}
        keyExtractor={(item, i) => String(i)}
        stickySectionHeadersEnabled={false}
        renderItem={({ item: filter, index }) => {
          const FilterComponent = filter.type === "checkbox" ? CheckboxFilter : TagsFilter
          const filterId = filterIdExtractor(filter, index)
          return (
            <View paddingHorizontal={20}>
              <Text variant="body2">{filter.title}</Text>
              <FilterComponent
                filterId={filterId}
                values={filterValues[filterId]}
                items={filter.items}
                valueExtractor={props.valueExtractor}
                labelExtractor={props.labelExtractor}
                onItemClick={onItemClick}
              />
            </View>
          )
        }}
        ItemSeparatorComponent={() => <Line marginBottom={20} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <PrimaryButton
        label="SHOW RESULTS"
        onPress={props.onShowResult}
        marginHorizontal={20}
        marginBottom={20}
      />
      {!!props.clearFilter && (
        <SecondaryButton
          label="CLEAR FILTER"
          disabled={!count}
          onPress={props.onClearFilter}
          marginHorizontal={20}
          marginBottom={20}
        />
      )}
    </ModalScreen>
  )
}

const enhance = compose(
  withMappedNavigationParams(),
  defaultProps({
    valueExtractor: item => {
      return _.isObject(item) ? item.value : item
    },
    labelExtractor: item => {
      return _.isObject(item) ? item.label : item
    },
    filterIdExtractor: (filter, index) => {
      return filter && filter.id ? filter.id : "f" + index
    }
  }),
  setPropTypes({
    filters: PropTypes.array.isRequired,
    onSetFilter: PropTypes.func.isRequired
  }),
  withState("filterValues", "setFilterValues", props => {
    const { filters, filterIdExtractor, valueExtractor } = props
    return filters.reduce((acc, filter, i) => {
      return {
        ...acc,
        [filterIdExtractor(filter, i)]: (filter.values || []).map(v => valueExtractor(v))
      }
    }, {})
  }),
  withHandlers({
    onItemClick: props => (filterId, item) => {
      const { filterValues, valueExtractor, setFilterValues } = props
      const value = valueExtractor(item)
      filterValues[filterId] =
        filterValues[filterId].indexOf(value) !== -1
          ? filterValues[filterId].filter(v => v !== value)
          : [...filterValues[filterId], value]
      setFilterValues(filterValues)
    },
    onShowResult: props => () => {
      const { navigation, onSetFilter, filterValues } = props
      onSetFilter(filterValues)
      navigation.goBack()
    },
    onClearFilter: props => () => {
      const { navigation, onSetFilter, filterValues } = props
      onSetFilter(_.keys(filterValues).reduce((acc, key) => ({ ...acc, [key]: [] }), {}))
      navigation.goBack()
    }
  })
)

export default enhance(PopupFilter)
