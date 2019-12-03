import { CalendarList } from "react-native-calendars"
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native"
import { View } from "glamorous-native"
import MDCIcon from "react-native-vector-icons/MaterialCommunityIcons"
import React from "react"
import moment from "moment"

import { isAndroid } from "native"
import { isToday } from "keystone"
import Text from "kui/components/Text"
import { Row } from "kui/components"
import { ChevronDownIcon } from "kui/icons"
import colors from "kui/colors"
import fonts from "kui/fonts"

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.black,
    flex: 1,
    opacity: 0.7
  },
  modalContent: {
    flex: 1,
    justifyContent: "flex-end"
  },
  controls: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center"
  }
})

const CheckIcon = () => <MDCIcon color={colors.white} name={"check"} size={26} />
const CloseIcon = () => <MDCIcon color={colors.white} name={"close"} size={26} />

class DatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state.date = moment(props.date)
    this.state.displayDate = moment(props.date)
  }

  state = {
    modalVisible: false,
    date: moment(),
    displayDate: moment(),
    close: "cancel"
  }

  handleDateChange = date => {
    this.setState({ date: moment(date.dateString) })
  }

  handleDateChangeCancel = () => {
    this.toggleModal("cancel")
  }

  handleDateChangeConfirm = () => {
    this.toggleModal("confirm")
    this.setState({ displayDate: this.state.date })
    if (isAndroid) {
      this.props.onDateChange(moment(this.state.date))
    }
  }

  toggleModal = (close = "cancel") => {
    this.setState({ close }, () => {
      this.setState({ modalVisible: !this.state.modalVisible })
    })
  }

  render() {
    const { displayDate, date } = this.state
    const title = isToday(displayDate)
      ? "Today"
      : moment(displayDate).format("DD MMM YYYY")
    const { allowFutureDates, renderComponent, labelProps } = this.props
    const maxDate = allowFutureDates ? null : moment().toDate()
    return (
      <View>
        <TouchableOpacity onPress={this.toggleModal}>
          {renderComponent ? (
            renderComponent({ title })
          ) : (
            <Row centerY>
              <Text variant="body2" marginRight={2}>
                {title}
              </Text>
              <ChevronDownIcon size={20} color={colors.darkBlue40} />
            </Row>
          )}
        </TouchableOpacity>
        <View>
          <Modal
            animationType={"none"}
            onDismiss={() => {
              if (this.state.close === "confirm") {
                this.props.onDateChange(moment(date))
              }
            }}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setState({ modalVisible: false, close: "cancel" })}
          >
            <View style={styles.modalContent}>
              <TouchableWithoutFeedback onPress={this.handleDateChangeCancel}>
                <View style={styles.backdrop} />
              </TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: colors.darkBlue80
                }}
              >
                <CalendarList
                  current={moment(date).format("YYYY-MM-DD")}
                  scrollEnabled
                  calendarHeight={316}
                  horizontal
                  hideArrows={false}
                  hideExtraDays={false}
                  pagingEnabled
                  onDayPress={this.handleDateChange}
                  firstDay={1}
                  maxDate={maxDate}
                  futureScrollRange={3}
                  markedDates={{
                    [moment().format("YYYY-MM-DD")]: { marked: true },
                    [moment(date).format("YYYY-MM-DD")]: {
                      selected: true
                    }
                  }}
                  theme={{
                    calendarBackground: colors.darkBlue80,
                    dayTextColor: colors.darkBlue20,
                    textDisabledColor: colors.white50,
                    textDayFontFamily: fonts.montserrat,
                    textDayFontSize: 12,
                    textMonthFontSize: 18,
                    textMonthFontFamily: fonts.montserratSemiBold,
                    textDayHeaderFontSize: 10,
                    textDayHeaderFontFamily: fonts.montserrat,
                    monthTextColor: colors.white,
                    selectedDayBackgroundColor: colors.darkBlue50,
                    arrowColor: colors.white,
                    "stylesheet.calendar.header": {
                      header: {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        marginBottom: 4,
                        marginTop: 8,
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderColor: colors.darkBlue70
                      }
                    },
                    "stylesheet.day.basic": {
                      selected: {
                        backgroundColor: colors.darkBlue50,
                        paddingTop: 0,
                        borderRadius: 32
                      },
                      text: {
                        marginTop: 8,
                        fontFamily: fonts.montserrat,
                        fontSize: 12,
                        lineHeight: 16,
                        color: colors.darkBlue20
                      },
                      dot: {
                        width: 0,
                        height: 0,
                        marginTop: 0,
                        borderRadius: 0,
                        opacity: 1
                      },
                      visibleDot: {
                        opacity: 1,
                        backgroundColor: colors.blue2
                      }
                    }
                  }}
                />
                <View
                  maxWidth={"100%"}
                  marginHorizontal={20}
                  height={1}
                  backgroundColor={colors.darkBlue70}
                />
                <View paddingVertical={12} style={styles.controls}>
                  <TouchableOpacity
                    onPress={this.handleDateChangeCancel}
                    style={styles.controlButton}
                  >
                    <CloseIcon />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this.setState({ date: moment() }, () =>
                        this.handleDateChangeConfirm()
                      )
                    }}
                    style={styles.todayButton}
                  >
                    <Text color={colors.white}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.handleDateChangeConfirm}
                    style={styles.controlButton}
                  >
                    <CheckIcon />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    )
  }
}

DatePicker.defaultProps = {
  allowFutureDates: false
}

export default DatePicker
