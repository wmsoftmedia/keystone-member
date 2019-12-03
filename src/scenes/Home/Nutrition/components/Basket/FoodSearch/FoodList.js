import { compose, branch, withProps, withHandlers, renameProp } from "recompose"
import React from "react"
import moment from "moment"

import { DEFAULT_PAGE_SIZE } from "components/FoodList/PagedFoodList"
import { PagedFoodList } from "components/FoodList"
import { allRecentFoodTransformed } from "graphql/query/food/allRecent"
import { debounceTermProp } from "keystone/stream"
import { searchFoodTransformed as ksSearch } from "graphql/query/keystoneFoodbank/search"
import { trim, getOr } from "keystone"
import { withErrorScene, withExtendedErrorHandler } from "hoc/withErrorHandler"
import { withLoader } from "hoc"
import InfoMessage from "components/InfoMessage"
import _ from "lodash/fp"
import colors from "kui/colors"

const tz = moment.tz.guess() || "Australia/Melbourne"
const region = tz.indexOf("Europe/") === 0 ? "GB" : "AU"
const meta = {
  max_results: DEFAULT_PAGE_SIZE,
  region
}

const fetchingMerge = (prev, next, newPage) => {
  const { currentMember } = prev
  const newNodes = getOr([], `currentMember.keystoneFoodSearch.nodes`, next)
  const oldNodes = getOr([], `keystoneFoodSearch.nodes`, currentMember)
  const newCount = oldNodes.length + newNodes.length
  return {
    currentMember: {
      ...currentMember,
      keystoneFoodSearch: {
        ...currentMember.keystoneFoodSearch,
        page: newPage,
        count: newCount,
        nodes: [...oldNodes, ...newNodes]
      }
    }
  }
}

const getPageStat = data => {
  const isLastPage = Math.floor(data.totalCount / DEFAULT_PAGE_SIZE) === data.page
  return {
    currentPage: data.page,
    pageCount: _.getOr(0, "nodes.length", data),
    totalPage: data.totalCount,
    isLastPage
  }
}

const getFetchVars = props => {
  return {
    meta: {
      ...meta,
      page_number: props.currentPage + 1
    }
  }
}

const withSearchTermDebounce = debounceTermProp()
const withRecentData = allRecentFoodTransformed
const withSearchData = ksSearch

const enhancedSearch = compose(
  withSearchTermDebounce,
  withProps(() => ({ meta })),
  withSearchData,
  withErrorScene({
    renderScene: () => (
      <InfoMessage
        title="Something is not right"
        subtitle="We are unable to search right now, please try again later."
      />
    )
  }),
  withLoader({ message: "Searching...", color: colors.white }),
  withProps(props => ({
    items: props.searchFoodItems,
    queryProp: "data",
    dataPath: `currentMember.keystoneFoodSearch`,
    fetchingMerge,
    getPageStat,
    getFetchVars,
    listProps: {
      ListEmptyComponent: () => (
        <InfoMessage
          title="No results."
          subtitle="We did not find any food items matching your criteria."
        />
      )
    }
  }))
)

const enhance = compose(
  withRecentData,
  withExtendedErrorHandler({
    dataKeys: ["AllRecentFood"]
  }),
  withLoader({
    color: colors.white,
    dataKeys: ["AllRecentFood"],
    message: "Loading Recent Food..."
  }),
  branch(
    p => trim(p.term) === "",
    withProps(props => ({
      items: props.recentFoodItems,
      offline: true,
      listProps: {
        ListEmptyComponent: () => <InfoMessage title="No recent food yet" />
      }
    })),
    enhancedSearch
  )
)

const enhanceFoodList = compose(
  withProps({ selectMode: true }),
  renameProp("selectedIds", "selected"),
  withHandlers({
    onClick: props => food => props.toggleFood(food)
  })
)

export default enhance(enhanceFoodList(PagedFoodList))
