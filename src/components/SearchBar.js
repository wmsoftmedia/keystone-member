import { defaultProps } from "recompose"
import React from "react"
import styled, { View, TouchableOpacity } from "glamorous-native"

import { SearchIcon, AddIcon } from "scenes/Home/Icons"
import Row from "components/Row"
import TextInput from "components/form/TextInput"
import colors from "colors"

export const Input = styled(p => (
  <TextInput
    placeholderTextColor={colors.white50}
    maxLength={120}
    autoCorrect
    borderBottomColor={"transparent"}
    borderBottomWidth={0}
    fontWeight={"400"}
    {...p}
  />
))({ color: colors.white, fontSize: 18, flex: 1 })

const SearchBar = props => {
  const { term, onInputChange, showPlus, onPress, placeholder, ...rest } = props
  return (
    <Row alignItems="stretch" {...rest}>
      <View
        justifyContent="center"
        paddingHorizontal={8}
        paddingVertical={8}
        backgroundColor={colors.textInputBgDark}
      >
        <View paddingTop={2}>
          <SearchIcon color={colors.white30} size={24} />
        </View>
      </View>
      <View flex={1}>
        <Input
          value={term}
          onChange={onInputChange}
          placeholder={placeholder}
        />
      </View>
      {showPlus && (
        <View justifyContent="center">
          <TouchableOpacity
            justifyContent="center"
            flex={1}
            onPress={onPress}
            paddingHorizontal={8}
          >
            <AddIcon color={colors.white} size={24} />
          </TouchableOpacity>
        </View>
      )}
    </Row>
  )
}

export default defaultProps({ showPlus: false, placeholder: "" })(SearchBar)
