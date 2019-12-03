import { View } from "glamorous-native"
import {
  compose,
  defaultProps,
  setDisplayName,
  setPropTypes,
  withHandlers,
  withStateHandlers
} from "recompose"
import Fuse from "fuse.js"
import React from "react"
import Swipeable from "react-native-swipeable"

import { DEFAULT_SWIPE_PROPS } from "components/Swipe"
import { TrashIcon } from "kui/icons"
import { extractFoodListId } from "keystone/food"
import { getOr } from "keystone"
import FoodLine from "components/FoodList/FoodLine"
import List from "components/List"
import PropTypes from "prop-types"
import SearchBar from "components/FoodList/SearchBar"
import _ from "lodash/fp"
import colors from "kui/colors"

const rightContent = (
  <View
    flex={1}
    justifyContent={"center"}
    paddingLeft={20}
    backgroundColor={colors.red50}
  >
    <TrashIcon size={30} color={colors.white} />
  </View>
)

const fuseOptions = {
  caseSensitive: false,
  shouldSort: true,
  threshold: 0.2,
  minMatchCharLength: 2,
  findAllMatches: true,
  keys: ["name"],
  tokenize: true
}

const searchFood = (items, term) => {
  const fuse = new Fuse(items, fuseOptions)
  return fuse.search(term)
}

class FoodList extends React.PureComponent {
  renderListItem = ({ item, index }) => {
    const Comp = this.props.LineComp
    return this.props.manageMode ? (
      <Swipeable
        rightContent={rightContent}
        backgroundColor="transparent"
        onRightActionRelease={() => this.props.onRightActionRelease(item)}
        onSwipeStart={() => this.props.setSwiping(true)}
        onSwipeComplete={() => this.props.setSwiping(false)}
        {...DEFAULT_SWIPE_PROPS}
      >
        <Comp index={index} item={item} {...this.props} />
      </Swipeable>
    ) : (
      <Comp index={index} item={item} {...this.props} />
    )
  }

  render() {
    const { term } = this.props
    const filteredItems = this.props.sourceFilter
      ? this.props.items.filter(item => !this.props.sourceFilter.includes(item.type))
      : this.props.items
    const items = term ? searchFood(filteredItems, term) : filteredItems

    const hasResults = items.length > 0
    const needFooter = !this.props.offline && hasResults

    const sortedItems = this.props.sortField
      ? _.orderBy([this.props.sortField], [this.props.sortDirection], items)
      : items

    const listProps = {
      ...this.props.listProps,
      ListEmptyComponent:
        this.props.searchable && term && this.props.listProps.searchNotFound
          ? this.props.listProps.searchNotFound
          : getOr(undefined, "listProps.ListEmptyComponent", this.props)
    }

    const Search = this.props.customSearchField ? this.props.customSearchField : SearchBar

    return (
      <View flex={1}>
        {this.props.searchable && (
          <Search term={term} setTerm={this.props.setTerm} {...this.props.searchProps} />
        )}
        <View flex={1} backgroundColor={colors.transparent}>
          <List
            data={sortedItems}
            keyExtractor={extractFoodListId}
            initialNumToRender={10}
            onEndReachedThreshold={0.1}
            onEndReached={this.props.onListEnd}
            scrollEnabled={!this.props.isSwiping}
            renderItem={this.renderListItem}
            ListFooterComponent={needFooter ? this.props.renderListFooter : null}
            {...listProps}
          />
        </View>
      </View>
    )
  }
}

const enhance = compose(
  setDisplayName("FoodList"),
  setPropTypes({
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    sourceFilter: PropTypes.array,
    offline: PropTypes.bool,
    manageMode: PropTypes.bool,
    selectMode: PropTypes.bool,
    selected: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.instanceOf(Set)]),
    onListEnd: PropTypes.func,
    onDelete: PropTypes.func,
    onClick: PropTypes.func,
    listProps: PropTypes.objectOf(PropTypes.func),
    renderListFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    LineComp: PropTypes.func,
    searchable: PropTypes.bool,
    customSearchField: PropTypes.func,
    searchProps: PropTypes.object,
    sortField: PropTypes.string,
    sortDirection: PropTypes.string
  }),
  defaultProps({
    LineComp: FoodLine,
    onClick: () => null,
    sortDirection: "asc"
  }),
  withStateHandlers(
    { isSwiping: false, term: "" },
    {
      setSwiping: () => isSwiping => ({ isSwiping }),
      setTerm: () => term => ({ term })
    }
  ),
  withHandlers({
    onRightActionRelease: ({ onDelete }) => item => onDelete(item)
  })
)

export default enhance(FoodList)
