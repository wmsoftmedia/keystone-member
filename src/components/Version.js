import { View } from "glamorous-native"
import React from "react"

import PropTypes from "prop-types"

import { P } from "./Typography"
import { version } from "../../package.json"
import colors from "../colors"

const Version = ({ color, ...rest }) => {
  return (
    <View
      alignItems={"center"}
      justifyContent={"center"}
      paddingVertical={10}
      {...rest}
    >
      {version && (
        <P color={color} fontWeight={"700"}>
          v{version}
        </P>
      )}
    </View>
  )
}

Version.defaultProps = {
  color: colors.primary2
}

Version.propTypes = {
  color: PropTypes.string.isRequired
}

export default Version
