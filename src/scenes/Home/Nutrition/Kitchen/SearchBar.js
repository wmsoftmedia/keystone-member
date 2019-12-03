import { defaultProps } from "recompose"
import React from "react"
import styled, { View, TouchableOpacity } from "glamorous-native"

import { AddIcon } from "kui/icons"
import { TextInput } from "kui/components/Input"
import Row from "components/Row"
import colors from "colors"

const BAR_HEIGHT = 52

export const Input = p => <TextInput compact maxLength={120} autoCorrect {...p} />

const NewBar = props => (
  <Row alignItems="stretch" height={BAR_HEIGHT} {...props}>
    <View flex={1} paddingVertical={8}>
      <Input value={props.term} onChange={props.setTerm} />
    </View>
    {props.showPlus && (
      <View justifyContent="center">
        <TouchableOpacity
          justifyContent="center"
          flex={1}
          onPress={props.onPress}
          paddingHorizontal={8}
        >
          <AddIcon color={colors.white} size={24} />
        </TouchableOpacity>
      </View>
    )}
  </Row>
)

export default defaultProps({ showPlus: true })(NewBar)
