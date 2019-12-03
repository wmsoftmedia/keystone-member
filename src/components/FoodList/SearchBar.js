import { View } from "glamorous-native"
import { compose, setPropTypes } from "recompose"
import React from "react"

import { Row } from "kui/components"
import { TextInput } from "kui/components/Input"
import PropTypes from "prop-types"

export const SearchInput = p => <TextInput compact autoCorrect maxLength={120} {...p} />

const SearchBar = props => {
  const { ActionButton, setTerm, term, placeholder } = props
  const { inputProps, actionProps } = props
  return (
    <Row paddingVertical={8} paddingHorizontal={20} {...props}>
      <View flex={1}>
        <SearchInput
          placeholder={placeholder}
          value={term}
          onChange={setTerm}
          {...inputProps}
        />
      </View>
      {ActionButton && (
        <View
          minWidth={40}
          minHeight={40}
          justifyContent="center"
          alignItems="center"
          marginLeft={10}
        >
          <ActionButton {...actionProps} />
        </View>
      )}
    </Row>
  )
}

const enhance = compose(
  setPropTypes({
    term: PropTypes.string,
    setTerm: PropTypes.func,
    placeholder: PropTypes.string,
    iconProps: PropTypes.object,
    inputProps: PropTypes.object,
    actionProps: PropTypes.object,
    ActionButton: PropTypes.func
  })
)

export default enhance(SearchBar)
