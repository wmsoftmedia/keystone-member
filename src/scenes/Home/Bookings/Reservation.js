import { TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import { withNavigation } from "react-navigation"
import React from "react"
import moment from "moment"

import { ModalScreen } from "components/Background"
import {
  RESERVATION_APPROVED,
  RESERVATION_EXPIRED,
  RESERVATION_PENDING,
  RESERVATION_TYPE_PERM,
  RESERVATION_TYPE_TEMP,
  statusColor,
  statusIcon
} from "scenes/Home/Bookings/utils"
import { Row } from "kui/components"
import { StopIcon20 } from "kui/icons"
import { UpdateIcon } from "scenes/Home/Icons"
import { confirm } from "native"
import { formatTime, isPastDate } from "keystone"
import { withClassByIdLoaded } from "graphql/query/class/byId"
import { withReservationRequestDeleteMutation } from "graphql/mutation/reservation/deleteRequest"
import { withReservationRequestMutation } from "graphql/mutation/reservation/createRequest"
import Picker from "kui/components/Input/Picker"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const Label = p => (
  <Text
    variant="caption2"
    color={colors.darkBlue30}
    paddingBottom={4}
    paddingTop={16}
    {...p}
  />
)

const Value = p => <Text variant="body2" {...p} />

const statusMessage = (status, type) => {
  switch (status) {
    case RESERVATION_APPROVED:
      return type === RESERVATION_TYPE_PERM ? "Reserved" : "Approved"
    case RESERVATION_EXPIRED:
      return "Expired"
    case RESERVATION_PENDING:
      return "Pending approval..."
    default:
      return ""
  }
}

const mkPickerItem = cls => ts => {
  const { time } = ts
  const timeStr = formatTime(time)
  const label = `${timeStr} - ${cls.name}`
  const value = ts.id
  return {
    label,
    value,
    time
  }
}

const forDay = day => ts => ts.day === day

const RequestButton = compose(
  withNavigation,
  withReservationRequestMutation,
  withState("selectedTimeslot", "setItem", p => p.reservation.timeslotId),
  withProps(props => {
    const { reservation } = props
    const timeslots = _.getOr([], "class.timeslots.nodes", reservation)
    const pickerItems = _(timeslots)
      .filter(forDay(reservation.day))
      .map(mkPickerItem(reservation.class))
      .orderBy(["time"], ["asc"])
      .value()
    return {
      pickerItems
    }
  }),
  withHandlers({
    onPickerChange: props => v => props.setItem(v),
    onPickerSubmit: props => (newTimeslotId, closePicker) => {
      const { navigation, reservation: r } = props
      const prevTimeslotId = r.timeslotId
      if (newTimeslotId === prevTimeslotId) {
        return
      }
      const newRequest = {
        date: r.date,
        timeslotId: newTimeslotId,
        prevTimeslotId: prevTimeslotId,
        userId: r.userId
      }
      const cb = () => {
        closePicker()
        props
          .createReservationRequest(newRequest)
          .then(() => navigation.goBack())
          .catch(e => console.warn(e))
      }
      confirm(
        cb,
        "You will join the waiting list for the selected timeslot. Once approved - you will receive a notification.",
        "Join Waiting List",
        "Submit",
        "Cancel"
      )
    }
  })
)(props => {
  const { pickerItems, selectedTimeslot, onPickerChange, onPickerSubmit } = props
  return (
    <Picker
      autoclose={false}
      items={pickerItems}
      value={selectedTimeslot}
      onChange={onPickerChange}
      onBlur={(value, close) => onPickerSubmit(selectedTimeslot, close)}
      pickerHeader={"Choose Timeslot"}
      renderButton={picker => {
        const { openPicker } = picker
        return (
          <TouchableOpacity padding={16} onPress={openPicker}>
            <Row centerXY>
              <UpdateIcon color={colors.blue40} size={20} />
              <Text variant="button1" paddingLeft={4} color={colors.blue40}>
                REQUEST TIME SHIFT
              </Text>
            </Row>
          </TouchableOpacity>
        )
      }}
      controlsBg={colors.blue6}
    />
  )
})

const WithdrawButton = compose(
  withNavigation,
  withReservationRequestDeleteMutation,
  withHandlers({
    onWithdrawClick: props => () => {
      const { navigation, reservation: r } = props
      if (!r.requestId) {
        return
      }
      const cb = () =>
        props
          .deleteReservationRequestById(r.requestId)
          .then(() => navigation.goBack())
          .catch(e => console.warn(e))
      confirm(cb, "This reservation request will be cancelled.")
    }
  })
)(props => {
  const { onWithdrawClick } = props
  return (
    <TouchableOpacity padding={16} onPress={onWithdrawClick}>
      <Row centerXY>
        <StopIcon20
          color={colors.orange50}
          size={20}
          backgroundColor={colors.transparent}
        />
        <Text variant="button1" paddingLeft={4} color={colors.orange50}>
          WITHDRAW REQUEST
        </Text>
      </Row>
    </TouchableOpacity>
  )
})

const ReservationInfo = props => {
  const { reservation: r } = props
  const { reqTime } = r

  const isPermanent = r.type === RESERVATION_TYPE_PERM
  const isTemporary = r.type === RESERVATION_TYPE_TEMP
  const isPending = r.status === RESERVATION_PENDING
  const isApproved = r.status === RESERVATION_APPROVED

  const canRequest = !isPastDate(r.date) && (isPermanent || !isPending)
  const canWithdraw = isTemporary && isPending

  const shifted = isApproved && isTemporary
  const typeStr = isPermanent ? "Permanent" : "Time Shift"
  const statusStr = statusMessage(r.status, r.type)
  const statusClr = isPermanent
    ? colors.white80
    : isPending
    ? colors.blue40
    : statusColor[r.status]
  const StatusIcon = statusIcon[r.status]

  return (
    <View>
      <Label paddingTop={0}>CLASS</Label>
      <Value>{r.className}</Value>

      <Label>DATE</Label>
      <Value>{r.dateStr}</Value>

      <Label>TIME</Label>
      <Row centerY>
        <Value>{formatTime(r.time)}</Value>
        {isPending && (
          <React.Fragment>
            <Value>{" to "}</Value>
            <Value color={colors.blue40}>{formatTime(reqTime)}</Value>
          </React.Fragment>
        )}
      </Row>

      <Label>TYPE</Label>
      <Value>{typeStr}</Value>
      {isTemporary && (
        <Text variant="body1" paddintTop={4}>
          This one-off time shift does not affect your future reservations.
        </Text>
      )}

      <Label>STATUS</Label>
      <Row centerY>
        {!isPermanent && !!StatusIcon && (
          <View paddingRight={4}>
            <StatusIcon
              size={20}
              color={statusClr}
              backgroundColor={colors.transparent}
            />
          </View>
        )}
        <Text variant="button1" color={statusClr}>
          {statusStr.toUpperCase()}
        </Text>
      </Row>

      {isPermanent && (
        <Text variant="body1" paddingTop={4}>
          You are permanently reserved into this timeslot.
        </Text>
      )}

      {canRequest && (
        <React.Fragment>
          {shifted && (
            <Text variant="body1" paddingTop={4}>
              Time shift request for this date has been approved!
            </Text>
          )}
          <View padding={8} paddingTop={12} alignItems="center">
            <RequestButton reservation={r} />
          </View>
        </React.Fragment>
      )}

      {canWithdraw && (
        <React.Fragment>
          <Text variant="body1" paddingTop={4}>
            You are in a waiting list for this timeslot. Once approved - you will receive
            a notification.
          </Text>
          <View padding={8} paddingTop={12} alignItems="center">
            <WithdrawButton reservation={r} />
          </View>
        </React.Fragment>
      )}
    </View>
  )
}

const Reservation = props => {
  const { reservation } = props
  return (
    <ModalScreen grabby>
      <View paddingHorizontal={20} paddingTop={0}>
        <ReservationInfo reservation={reservation} />
      </View>
    </ModalScreen>
  )
}

const enhance = compose(
  withProps(props => {
    const { navigation } = props
    const item = _.getOr(null, "state.params.item", navigation)
    return { item, classId: item.classId }
  }),
  withClassByIdLoaded,
  withProps(props => {
    const { item, data } = props
    const cls = _.getOr(null, "classById", data)
    const userId = data.currentMember.ksUserId
    const reservation = {
      ...item,
      userId,
      class: cls,
      dateStr: moment(item.date).format("ddd, DD MMM 'YY"),
      timeStr: formatTime(item.time)
    }
    const isPermanent = reservation.type === RESERVATION_TYPE_PERM
    return {
      reservation,
      isPermanent
    }
  })
)

export default enhance(Reservation)
