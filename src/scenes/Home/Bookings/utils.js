import moment from "moment"

import { gqlDate, isLastWeek, isNextWeek, isThisWeek } from "keystone"
import _ from "lodash/fp"
import colors from "kui/colors"
import { PendingIcon, CheckmarkIcon } from "kui/icons"

export const RESERVATION_EXPIRED = "EXPIRED"
export const RESERVATION_PENDING = "PENDING"
export const RESERVATION_APPROVED = "APPROVED"

export const statusColor = {
  PENDING: colors.orange50,
  EXPIRED: colors.white30,
  APPROVED: colors.green50
}

export const statusIcon = {
  PENDING: PendingIcon,
  APPROVED: CheckmarkIcon
}

export const RESERVATION_TYPE_PERM = "PERMANENT"
export const RESERVATION_TYPE_TEMP = "TEMPORARY"

const WEEKS_AHEAD = 3

const mkWeek = (bookings, i) =>
  bookings.map(b => ({ ...b, date: moment(b.date).add(i, "w") }))

const bookingDateFromDay = (day, date = moment()) =>
  moment(date)
    .startOf("week")
    .add(day, "d")

const isFutureRequest = r => r.type === RESERVATION_TYPE_TEMP && !isLastWeek(r.date)

const isBooking = r => r.type === RESERVATION_TYPE_PERM

const bookingWithDate = b => ({
  ...b,
  date: bookingDateFromDay(b.day)
})

export const mkSchedule = rs => {
  const requests = rs.filter(isFutureRequest)
  const bookings = rs.filter(isBooking).map(bookingWithDate)
  const futureBookings = _.flatten(_.times(i => mkWeek(bookings, i), WEEKS_AHEAD))
  const schedule = [...futureBookings, ...requests]
  const byWeek = _.groupBy(
    n =>
      moment(n.date)
        .startOf("week")
        .format("YYYY-MM-DD"),
    schedule
  )
  return byWeek
}

const mkSection = (startDate, data) => {
  const endDate = moment(startDate).endOf("week")
  const isSameYear = moment(startDate).isSame(endDate, "year")
  const fmt = isSameYear ? "DD/MM" : "DD/MM 'YY"
  const m1 = moment(startDate).format(fmt)
  const m2 = moment(endDate).format(fmt)
  const title = isThisWeek(startDate)
    ? "This Week"
    : isNextWeek(startDate)
    ? "Next Week"
    : `${m1} - ${m2}`
  const items = _(data)
    .map(x => ({ ...x, date: gqlDate(x.date) }))
    .orderBy(["date"], ["asc"], data)
    .value()
  const allocs = _(items)
    .groupBy(x => `${x.classId}_${x.date}`)
    .value()
  const resolved = _(allocs)
    .keys()
    .map(k => {
      const chain = _.orderBy(["updatedAt"], ["asc"], allocs[k])
      const r = chain.reduce((acc, e) => {
        const isPending = e.status === RESERVATION_PENDING
        const meta = isPending
          ? {
              reqTime: e.time,
              status: RESERVATION_PENDING,
              requestId: e.requestId
            }
          : { time: e.time, timeslotId: e.timeslotId }
        return {
          ...acc,
          ...meta,
          type: e.type
        }
      }, chain[0])
      return { ...r, chain }
    })
    .flatten()
    .value()
  return { title, data: resolved }
}

export const mkSections = schedule => {
  const weeks = _.keys(schedule).sort()
  const sections = weeks.map(key => mkSection(key, schedule[key]))
  return sections
}
