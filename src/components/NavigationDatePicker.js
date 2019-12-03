import { Text } from "glamorous-native"
import { branch, compose } from "recompose"
import { withNavigation } from "react-navigation"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"
import moment from "moment"

import { DATE_FORMAT } from "keystone/constants"
import { Row } from "kui/components"
import { getNavigationParam, today } from "keystone"
import TitleDatePicker from "components/TitleDatePicker"
import colors from "kui/colors"

const getDate = navigation => getNavigationParam(navigation, "date") || today()

const ArrowDownIcon = ({ tintColor: color }) => (
  <Ionicons name={"ios-arrow-down"} color={color} size={16} style={{ paddingLeft: 8 }} />
)
const NavigationDatePicker = ({
  navigation,
  date,
  pickerProps = {},
  buttonProps = {}
}) => (
  <TitleDatePicker
    date={getDate(navigation) ? date : moment().format(DATE_FORMAT)}
    onDateChange={date => navigation.setParams({ date })}
    {...pickerProps}
    renderComponent={({ title }) => (
      <Row
        width={252}
        height={40}
        backgroundColor={colors.darkBlue90}
        borderColor={colors.darkBlue70}
        borderWidth={1}
        borderRadius={8}
        paddingLeft={16}
        paddingRight={22}
        paddingVertical={12}
        //marginLeft={isAndroid ? 16 : 0}
        justifyContent="space-between"
        alignItems="center"
        {...buttonProps}
      >
        <Text fontSize={12} lineHeight={16} color={colors.darkBlue10}>
          {title}
        </Text>
        <ArrowDownIcon tintColor={colors.darkBlue10} />
      </Row>
    )}
  />
)

const enhance = compose(branch(props => !props.navigation, withNavigation))

export default enhance(NavigationDatePicker)
