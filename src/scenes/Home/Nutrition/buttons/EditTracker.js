import MIcons from "react-native-vector-icons/MaterialIcons"
import React from "react"
import styled, { Text } from "glamorous-native"

import colors from "../../../../colors"

const Container = styled.touchableOpacity({
  marginRight: 4,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "flex-start"
})

const EditTracker = ({ color = colors.white, editing = false, onPress }) => {
  return (
    <Container onPress={onPress}>
      {editing ? (
        <Text color={color} fontSize={16}>
          Done
        </Text>
      ) : (
        <MIcons name="edit" size={24} color={color} />
      )}
    </Container>
  )
}

export default EditTracker
