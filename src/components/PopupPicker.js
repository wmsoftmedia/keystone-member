import { TouchableWithoutFeedback } from "react-native"
import { FlatList, View, TouchableOpacity } from "glamorous-native"
import { compose, defaultProps, setPropTypes, withHandlers } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"
import _ from "lodash/fp"

import { ModalScreen } from "components/Background"
import Text from "kui/components/Text"
import Line from "kui/components/Line"
import { CheckIcon } from "kui/icons"
import { Row } from "kui/components"
import PropTypes from "prop-types"
import colors from "kui/colors"

const PopupPicker = props => {
  const { onItemSelect, onBackdropClick, title, value, items } = props
  return (
    <View flex={1} justifyContent="flex-end">
      <TouchableWithoutFeedback onPress={onBackdropClick}>
        <View flex={1} />
      </TouchableWithoutFeedback>
      <View height={380}>
        <ModalScreen
          flex={1}
          justifyContent="flex-end"
          grabby
          gradient={false}
          backgroundColor={colors.darkBlue80}
        >
          {!!title && (
            <View>
              <Row centerX>
                <Text variant="h2">{title}</Text>
              </Row>
              <Line marginTop={16} />
            </View>
          )}

          <FlatList
            flex={1}
            data={items}
            keyExtractor={(item, i) => String(i)}
            stickySectionHeadersEnabled={false}
            renderItem={({ item }) => {
              const selected = props.valueExtractor(value) === props.valueExtractor(item)
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => onItemSelect(item)}
                  marginHorizontal={20}
                  marginVertical={16}
                >
                  <Row centerY>
                    <View width={28}>
                      {selected && <CheckIcon size={20} color={colors.darkBlue50} />}
                    </View>
                    <Text variant="h2" opacity={selected ? 1 : 0.4}>
                      {props.labelExtractor(item)}
                    </Text>
                  </Row>
                </TouchableOpacity>
              )
            }}
            ItemSeparatorComponent={() => <Line />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </ModalScreen>
      </View>
    </View>
  )
}

const enhance = compose(
  withMappedNavigationParams(),
  defaultProps({
    title: "",
    value: "",
    valueExtractor: item => {
      return _.isObject(item) ? item.value : item
    },
    labelExtractor: item => {
      return _.isObject(item) ? item.label : item
    }
  }),
  setPropTypes({
    items: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
  }),
  withHandlers({
    onBackdropClick: ({ navigation }) => () => navigation.goBack(),
    onItemSelect: ({ navigation, onSelect }) => item => {
      onSelect(item)
      navigation.goBack()
    }
  })
)

export default enhance(PopupPicker)
