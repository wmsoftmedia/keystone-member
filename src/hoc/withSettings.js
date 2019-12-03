import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { withProps, branch, renderNothing, compose } from "recompose"

import {
  getWeightUnit,
  convertWeight,
  getHeightUnit,
  convertHeight,
  getTemperatureUnit,
  convertTemperature
} from "keystone"

const MEMBER_SETTINGS = gql`
  query MemberSettings {
    currentMember {
      id
      settings {
        nodes {
          value
          setting: settingBySettingId {
            key
          }
        }
      }
    }
  }
`

const withData = graphql(MEMBER_SETTINGS, {
  name: "memberData",
  options: () => ({
    fetchPolicy: "cache-only",
    notifyOnNetworkStatusChange: true
  })
})

const defaultOptions = {
  left: renderNothing
}

export const withSettings = (options = defaultOptions) =>
  compose(
    withData,
    branch(props => !props.memberData.currentMember, options.left),
    withProps(props => {
      const { currentMember } = props.memberData
      const weightUnit = getWeightUnit(currentMember)
      const weightConverter = convertWeight("kg", weightUnit, true)
      const reverseWeightConverter = convertWeight(weightUnit, "kg", false)

      const heightUnit = getHeightUnit(currentMember)
      const heightConverter = convertHeight("cm", heightUnit, false)
      const reverseHeightConverter = convertHeight(heightUnit, "cm", true)

      const temperatureUnit = getTemperatureUnit(currentMember)
      const temperatureConverter = convertTemperature("celsius", temperatureUnit, false)
      const reverseTemperatureConverter = convertTemperature(
        temperatureUnit,
        "celsius",
        true
      )

      return {
        weightUnit,
        weightConverter,
        reverseWeightConverter,
        heightUnit,
        heightConverter,
        reverseHeightConverter,
        temperatureUnit,
        temperatureConverter,
        reverseTemperatureConverter
      }
    })
  )

export default withSettings()
