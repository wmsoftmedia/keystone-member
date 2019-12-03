import { compose, defaultProps, setPropTypes } from "recompose"
import React from "react"

import InfoMessage from "components/InfoMessage"
import PropTypes from "prop-types"

const NoData = ({ message, text }) => <InfoMessage title={message} subtitle={text} />

const enhanced = compose(
  setPropTypes({ message: PropTypes.string, text: PropTypes.string }),
  defaultProps({ message: "No data", text: null })
)

export default enhanced(NoData)
