import React from "react"
import PropTypes from "prop-types"
import { Linking } from "react-native"
import styled, { Text, TouchableOpacity } from "glamorous-native"

import colors from "colors"

const LinkText = styled(Text)({
  paddingTop: 8,
  color: colors.white
})

const Link = props => (
  <TouchableOpacity
    activeOpacity={0.5}
    onPress={() => Linking.openURL(props.link)}
  >
    <LinkText numberOfLines={1}>
      { props.text || props.link }
    </LinkText>
  </TouchableOpacity>
)

Link.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string
}

export default Link
