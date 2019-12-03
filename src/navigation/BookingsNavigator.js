import { createStackNavigator } from "react-navigation-stack"
import moment from "moment"

import { getNavigationParam } from "keystone"
import { modalNavigationOptions } from "navigation/utils"
import Bookings from "scenes/Home/Bookings/Bookings"
import Reservation from "scenes/Home/Bookings/Reservation"

export const bookingRoutes = {
  BookingsScreen: {
    screen: Bookings,
    path: "/bookings",
    navigationOptions: () => ({
      title: "My Schedule"
    })
  },
  ReservationScreen: {
    screen: Reservation,
    path: "/bookings/reservation",
    navigationOptions: ({ navigation }) => {
      const date = getNavigationParam(navigation, "date")
      const title = date ? moment(date).format("ddd, DD MMM") : null
      return {
        ...modalNavigationOptions,
        title: title || "Reservation"
      }
    }
  }
}

const BookingsNavigator = createStackNavigator(bookingRoutes, {
  initialRouteName: "BookingsScreen",
  headerMode: "screen"
})

export default BookingsNavigator
