import { TouchableWithoutFeedback } from "react-native"
import { View } from "glamorous-native"
import { compose, defaultProps, setPropTypes, withHandlers } from "recompose"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import React from "react"
import moment from "moment"

import { ModalScreen } from "components/Background"
import MonthPicker from "kui/components/MonthPicker"
import PropTypes from "prop-types"
import colors from "kui/colors"

const TitleMonthPicker = props => {
  const { onSelect, onBackdropClick, date } = props
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
          <MonthPicker selectedDate={date} onSelect={onSelect} />
        </ModalScreen>
      </View>
    </View>
  )
}

const enhance = compose(
  defaultProps({
    date: moment()
  }),
  withMappedNavigationParams(),
  setPropTypes({
    onMonthSelect: PropTypes.func.isRequired
  }),
  withHandlers({
    onBackdropClick: ({ navigation }) => () => navigation.goBack(),
    onSelect: ({ navigation, onMonthSelect }) => date => {
      onMonthSelect(date)
      navigation.goBack()
    }
  })
)

export default enhance(TitleMonthPicker)
