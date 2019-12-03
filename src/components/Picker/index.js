import { Modal, Picker, View as RNView } from "react-native"
import { withState } from "recompose"
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons"
import React from "react"
import styled, {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "glamorous-native"

import Row from "components/Row"
import colors from "colors"

const CheckIcon = () => <MCIcon color={colors.white} name={"check"} size={26} />
const CloseIcon = () => <MCIcon color={colors.white} name={"close"} size={26} />
const PickerContainer = styled.view({ backgroundColor: colors.white })

const ModalControlButton = styled(p => <TouchableOpacity {...p} />)({
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 5,
  height: 42
})

const ModalContent = styled.view({ flex: 1, justifyContent: "flex-end" })

const ModalControls = styled(p => <View {...p} />)({
  backgroundColor: colors.primary2,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: 42
})

const CustomPicker = props => {
  const {
    prompt,
    pickerHeader,
    items = [],
    modalVisible,
    toggleModal,
    value,
    onChange,
    onBlur,
    color = colors.textLight,
    renderButton = null,
    controlsBg = colors.primary4,
    autoclose = true,
    ...rest
  } = props
  const itemsType = typeof items[0] === "string" ? "simple" : "complex"
  const valObject =
    itemsType === "complex" ? items.find(i => i.value === value) : {}
  const valToShow =
    value && itemsType === "complex" && valObject ? valObject.label : value
  return (
    <View {...rest}>
      {renderButton ? (
        renderButton({ openPicker: () => toggleModal(true) })
      ) : (
        <TouchableOpacity onPress={() => toggleModal(true)}>
          <Row padding={2} alignItems="center" justifyContent="flex-end">
            <Text
              flex={1}
              color={color}
              fontSize={14}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {valToShow}
            </Text>
            <MCIcon name="menu-down" size={32} color={color} />
          </Row>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => toggleModal(false)}
      >
        <ModalContent>
          <TouchableWithoutFeedback onPress={() => toggleModal(false)}>
            <RNView flex={1} />
          </TouchableWithoutFeedback>
          <ModalControls backgroundColor={controlsBg}>
            <ModalControlButton
              paddingRight={20}
              onPress={() => toggleModal(false)}
            >
              <CloseIcon />
            </ModalControlButton>
            <Text color={colors.white}>{pickerHeader}</Text>
            <ModalControlButton
              paddingLeft={20}
              onPress={() => {
                if (autoclose) {
                  onBlur(value)
                  toggleModal(false)
                } else {
                  onBlur(value, () => toggleModal(false))
                }
              }}
            >
              <CheckIcon />
            </ModalControlButton>
          </ModalControls>
          <PickerContainer>
            <Picker
              prompt={prompt}
              selectedValue={value}
              onValueChange={onChange}
              itemStyle={{ color: colors.textLight, fontSize: 16 }}
            >
              {items.map(
                (item, i) =>
                  typeof item === "string" ? (
                    <Picker.Item key={i} label={item} value={item} />
                  ) : (
                    <Picker.Item
                      key={i}
                      label={item.label}
                      value={item.value}
                    />
                  )
              )}
            </Picker>
          </PickerContainer>
        </ModalContent>
      </Modal>
    </View>
  )
}

export default withState("modalVisible", "toggleModal", false)(CustomPicker)
