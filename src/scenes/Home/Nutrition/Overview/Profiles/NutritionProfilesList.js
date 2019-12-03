import Ionicon from "react-native-vector-icons/Ionicons"
import React from "react"
import styled, { View } from "glamorous-native"

import PropTypes from "prop-types"
import colors from "colors"

import { H2 } from "../../../../../components/Typography"
import { ListItemLight } from "../../../../../components/ListItem"
import { ListItemSeparatorLight } from "../../../../../components/List/ListItemSeparator"
import { daysToNumbers, hasToday } from "../../../../../../lib/keystone"
import Days from "../../components/Days"
import List from "../../../../../components/List"
import Popup from "../../../../../components/Popup"
import ProfilePreview from "../../components/ProfilePreview"

const InfoIcon = styled(Ionicon)({
  color: colors.primary2,
  fontSize: 20,
  paddingRight: 10
})

class ProfileTitle extends React.Component {
  render() {
    const { title } = this.props
    return (
      <View flexDirection={"row"} alignItems="center">
        <InfoIcon name="ios-information-circle-outline" />
        <H2
          maxWidth={"95%"}
          titleCase
          color={colors.textLight}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </H2>
      </View>
    )
  }
}

class NutritionProfilesList extends React.Component {
  state = { previewOpen: false, profile: null }

  renderSeparator = () => {
    return <ListItemSeparatorLight height={2} color={"rgba(0,0,0,0.06)"} />
  }

  handleListItemPress = item => {
    this.setState({ profile: item, previewOpen: true })
  }

  renderHeader = () => this.renderSeparator()
  renderFooter = () => this.renderSeparator()

  renderListItem = ({ item }) => {
    const days = daysToNumbers(item.days)
    const today = hasToday(days)
    return (
      <ListItemLight
        heroItem={today}
        rows={2}
        contentTop={<ProfileTitle title={item.label} />}
        contentBottom={<Days dark days={days} />}
        styleOverrides={{
          content: { opacity: today ? 1 : 0.5 }
        }}
        disableHighlight
        onPress={() => this.handleListItemPress(item)}
        arrowIconName={null}
      />
    )
  }

  render() {
    const { profiles, refreshProfiles } = this.props
    return (
      <View height={"100%"} flex={1}>
        <Popup
          visible={this.state.previewOpen}
          onRequestClose={() => this.setState({ previewOpen: false })}
          content={
            <ProfilePreview
              profile={this.state.profile}
              onPress={() => this.setState({ previewOpen: false })}
            />
          }
        />
        <List
          refreshable
          handleRefresh={refreshProfiles}
          style={{ backgroundColor: colors.primary2, height: "100%" }}
          data={profiles}
          keyExtractor={item => item.id}
          renderItem={this.renderListItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          backgroundColor={colors.white}
          refreshProps={{ tintColor: colors.nutrition }}
        />
      </View>
    )
  }
}

NutritionProfilesList.propTypes = {
  profiles: PropTypes.array.isRequired
}

export default NutritionProfilesList
