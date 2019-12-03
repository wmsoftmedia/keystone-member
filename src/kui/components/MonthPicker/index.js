import { View } from "glamorous-native"
import { compose, setPropTypes, withHandlers, withState } from "recompose"
import MonthSelectorCalendar from "react-native-month-selector"
import React from "react"
import moment from "moment"

import { ChevronLeftIcon, ChevronRightIcon } from "kui/icons"
import { TextButton } from "kui/components/Button"
import Line from "kui/components/Line"
import PropTypes from "prop-types"
import colors from "kui/colors"
import fonts from "kui/fonts"

const baseTextStyle = {
  fontFamily: fonts.montserrat,
  color: colors.white,
  fontSize: 12
}

const MonthPicker = props => {
  const { month, onMonthClick, onSelectClick } = props
  return (
    <View flex={1} justifyContent="flex-end" backgroundColor={colors.darkBlue80}>
      <MonthSelectorCalendar
        selectedDate={month}
        onMonthTapped={onMonthClick}
        swipable={false}
        prevIcon={
          <View padding={10}>
            <ChevronLeftIcon size={20} />
          </View>
        }
        nextIcon={
          <View padding={10}>
            <ChevronRightIcon size={20} />
          </View>
        }
        seperatorHeight={1}
        seperatorColor={colors.darkBlue70}
        selectedBackgroundColor={colors.darkBlue60}
        yearTextStyle={{ ...baseTextStyle }}
        monthTextStyle={{ ...baseTextStyle, fontSize: 14 }}
        monthDisabledStyle={{ ...baseTextStyle, color: colors.white30 }}
        selectedMonthTextStyle={{
          ...baseTextStyle
        }}
        currentMonthTextStyle={{
          fontFamily: fonts.montserratSemiBold
        }}
        containerStyle={{
          backgroundColor: colors.transparent
        }}
      />
      <Line />
      <View paddingVertical={12}>
        <TextButton label="SELECT" onPress={onSelectClick} />
      </View>
    </View>
  )
}

const enhance = compose(
  setPropTypes({
    onSelect: PropTypes.func.isRequired
  }),
  withState("month", "setMonth", ({ selectedDate }) => {
    return moment(selectedDate)
  }),
  withHandlers({
    onMonthClick: ({ setMonth }) => setMonth,
    onSelectClick: ({ month, onSelect }) => () => {
      onSelect(month)
    }
  })
)

export default enhance(MonthPicker)
