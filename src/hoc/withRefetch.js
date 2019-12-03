import { RefreshControl, ScrollView, StyleSheet } from "react-native"
import React from "react"

import colors from "../colors"

const defaultConfig = {
  color: colors.white,
  title: "",
  titleColor: colors.black
}

const styles = StyleSheet.create({
  contentContainer: { flex: 1 }
})

const withRefetch = ({ color, title, titleColor }) => Component => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    state = { refreshing: false }

    handlerRefresh() {
      this.setState({ refreshing: true })
      this.props.data
        .refetch()
        .finally(() => this.setState({ refreshing: false }))
    }

    render() {
      if (this.props.data && this.props.data.loading) {
        return <Component {...this.props} />
      } else if (!this.props.data) {
        return <Component {...this.props} />
      }

      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              tintColor={color}
              title={title}
              titleColor={titleColor}
              onRefresh={() => this.handlerRefresh()}
            />
          }
        >
          <Component {...this.props} />
        </ScrollView>
      )
    }
  }
}

export default withRefetch(defaultConfig)
