import React from "react"
import { Text } from "glamorous-native"
import {
  compose,
  withProps,
  withHandlers,
  setPropTypes,
  setDisplayName,
  defaultProps,
  withState
} from "recompose"
import PropTypes from "prop-types"

import { getOr } from "keystone"
import FoodList from "./FoodList"
import AnimatedEllipsis from "components/AnimatedEllipsis"
import CenterView from "components/CenterView"
import colors from "colors"

export const DEFAULT_PAGE_SIZE = 20

const enhance = compose(
  setDisplayName("FoodList"),
  setPropTypes({
    items: PropTypes.array.isRequired,
    queryProp: PropTypes.string,
    dataPath: PropTypes.string,
    fetchingMerge: PropTypes.func,
    getFetchVars: PropTypes.func,
    onClick: PropTypes.func,
    selectMode: PropTypes.bool,
    offline: PropTypes.bool,
    pageSize: PropTypes.number,
    manageMode: PropTypes.bool,
    sourceFilter: PropTypes.array
  }),
  defaultProps({
    selectMode: false,
    manageMode: false,
    offline: false,
    pageSize: DEFAULT_PAGE_SIZE
  }),
  withState("isFetching", "setFetchingState", false),
  withState("isSwiping", "setSwiping", false),
  withProps(props => {
    if (props.offline) return {}
    const dataList = getOr({}, props.dataPath, props[props.queryProp])

    if (props.getPageStat) return props.getPageStat(dataList)

    const itemCount = (dataList.nodes || []).length
    const currentPage = Math.ceil(itemCount / props.pageSize)
    const totalPage = Math.ceil(dataList.totalCount / props.pageSize)
    const isLastPage = totalPage
      ? totalPage === currentPage
      : itemCount % props.pageSize !== 0

    return { itemCount, currentPage, totalPage, isLastPage }
  }),
  withHandlers({
    // proxy funcs to implement default fetchMore routine
    // passes all data to functions of the same name in props if exist
    getFetchVars: props => () => {
      return props.getFetchVars
        ? props.getFetchVars(props)
        : { offset: props.itemCount }
    },
    fetchingMerge: props => (cur, next) => {
      if (props.fetchingMerge)
        return props.fetchingMerge(cur, next, props.currentPage + 1)

      const newNodes = getOr([], `${props.dataPath}.nodes`, next)
      return {
        [props.dataPath]: {
          ...cur[props.dataPath],
          nodes: [...cur[props.dataPath].nodes, ...newNodes]
        }
      }
    }
  }),
  withHandlers({
    // generic routine to request next bunch of data
    onListEnd: props => () => {
      if (props.offline || props.isLastPage || props.isFetching) return
      props.setFetchingState(true)
      props[props.queryProp].fetchMore({
        variables: props.getFetchVars(),
        updateQuery: (cur, { fetchMoreResult: next }) => {
          props.setFetchingState(false)
          if (!next) return cur
          return props.fetchingMerge(cur, next)
        }
      })
    },
    renderListFooter: props => () => (
      <CenterView padding={20}>
        {props.isLastPage ? (
          <Text color={colors.primary5}>Bon Appétit!</Text>
        ) : (
          <Text color={colors.primary5}>
            Loading more results<AnimatedEllipsis animationDelay={150} />
          </Text>
        )}
      </CenterView>
    )
  })
)

export default enhance(FoodList)
