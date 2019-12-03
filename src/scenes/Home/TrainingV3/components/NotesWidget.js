import { TouchableOpacity } from "glamorous-native"
import { compose, withProps, withState, setPropTypes } from "recompose"
import React from "react"

import PropTypes from "prop-types"
import Text from "kui/components/Text"
import colors from "kui/colors"
import fonts from "kui/fonts"

const TRUNCATE_LENGTH = 100

const NotesText = p => (
  <Text variant="body1" fontSize={14} color={colors.white70} {...p} />
)

const NotesWidget = ({ notes, shouldEllipsize, showMore, setShowMore }) =>
  !!notes && (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setShowMore(!showMore)}>
      <Text variant="body2" paddingBottom={4}>
        Notes
      </Text>
      <NotesText>
        {notes}
        {shouldEllipsize && !showMore ? "..." : ""}
        {shouldEllipsize && (
          <NotesText fontFamily={fonts.montserratBold}>
            {showMore ? " Show less" : " Show more"}
          </NotesText>
        )}
      </NotesText>
    </TouchableOpacity>
  )

const enhance = compose(
  setPropTypes({
    notes: PropTypes.string.isRequired
  }),
  withState("showMore", "setShowMore", false),
  withProps(({ notes, showMore }) => {
    const _notes = notes || ""
    const shouldEllipsize = _notes.length > TRUNCATE_LENGTH
    return {
      shouldEllipsize,
      notes: shouldEllipsize && !showMore ? _notes.substring(0, TRUNCATE_LENGTH) : _notes
    }
  })
)

export default enhance(NotesWidget)
