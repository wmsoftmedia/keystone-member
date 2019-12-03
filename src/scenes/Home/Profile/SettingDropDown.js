import React from "react"
import styled, { View } from "glamorous-native"
import Picker from "kui/components/Input/Picker"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withSettingMutation from "graphql/mutation/profile/updateSettings"

const SettingContainer = styled(View)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
})

const InputSelectColumn = styled(View)({
  width: "50%",
  borderColor: colors.white
})

const SelectSetting = ({ data, handleChange, curVal }) => {
  return (
    <InputSelectColumn>
      <Picker
        value={curVal}
        items={data.options}
        onChange={handleChange}
        pickerHeader={data.name}
      />
    </InputSelectColumn>
  )
}

const getClassByType = type => {
  switch (type) {
    case "SELECT_SINGLE":
      return SelectSetting
    default:
      return null
  }
}

const Setting = ({ data, submitSetting, curVal }) => {
  const SettingInput = getClassByType(data.type)
  const handleChange = submitSetting(data.key)

  return (
    <SettingContainer>
      <View flex={1}>
        <Text variant="body1">{data.name}</Text>
      </View>
      <View flex={1} alignItems={"flex-end"}>
        <SettingInput data={data} handleChange={handleChange} curVal={curVal} />
      </View>
    </SettingContainer>
  )
}

export default withSettingMutation(Setting)
