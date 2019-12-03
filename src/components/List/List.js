import { FlatList, View } from "glamorous-native"
import { RefreshControl, SectionList } from "react-native"
import React from "react"

import NoData from "components/NoData"
import PropTypes from "prop-types"
import colors from "kui/colors"

class List extends React.Component {
  state = {
    refreshing: false
  }

  stopRefreshing = () => this.setState({ refreshing: false })

  handleRefresh = () => {
    this.setState({ refreshing: true })
    this.props.handleRefresh(this.stopRefreshing)
  }

  render() {
    const { refreshable, sectionList, refreshProps } = this.props

    return (
      <View flex={1} height={"100%"}>
        {sectionList ? (
          <SectionList
            refreshControl={
              refreshable ? (
                <RefreshControl
                  refreshing={this.props.refreshing || this.state.refreshing}
                  onRefresh={this.handleRefresh}
                  {...refreshProps}
                />
              ) : null
            }
            ref={this.props.onRef}
            {...this.props}
          />
        ) : (
          <FlatList
            refreshControl={
              refreshable ? (
                <RefreshControl
                  refreshing={this.props.refreshing || this.state.refreshing}
                  onRefresh={this.handleRefresh}
                  {...refreshProps}
                />
              ) : null
            }
            ref={this.props.onRef}
            {...this.props}
          />
        )}
      </View>
    )
  }
}

List.defaultProps = {
  refreshable: false,
  handleRefresh: cb => cb(),
  ListEmptyComponent: () => <NoData backgroundColor={colors.transparent} padding={20} />,
  sectionList: false,
  style: { height: "100%" },
  refreshProps: {
    tintColor: colors.white,
    titleColor: colors.white
  },
  onRef: () => null
}

List.propTypes = {
  refreshable: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func
}

export default List
