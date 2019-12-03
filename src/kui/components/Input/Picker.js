import { Modal, Picker as RNPicker, View as RNView } from "react-native"
import { compose, withProps, withState } from "recompose"
import { isIOS } from "native"
import styled, {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "glamorous-native"
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons"
import React from "react"

import { ChevronDownIcon } from "kui/icons"
import { Row } from "kui/components"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import colors from "kui/colors"
import fonts from "kui/fonts"

const CheckIcon = () => <MCIcon color={colors.white} name={"check"} size={26} />
const CloseIcon = () => <MCIcon color={colors.white} name={"close"} size={26} />
const PickerContainer = styled.view({ backgroundColor: colors.darkBlue80 })

const ModalControlButton = styled(p => <TouchableOpacity {...p} />)({
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 20,
  height: 42
})

const ModalContent = styled.view({ flex: 1, justifyContent: "flex-end" })

const ModalControls = styled(p => <View {...p} />)({
  backgroundColor: colors.darkBlue80,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: 42
})

const boxStyle = ({ focused = false }) => ({
  borderWidth: 1,
  minWidth: 60,
  textAlignVertical: "center",
  borderRadius: 8,
  backgroundColor: focused ? colors.darkBlue80 : colors.darkBlue90,
  borderColor: focused ? colors.darkBlue40 : colors.darkBlue70,
  justifyContent: "center",
  alignItems: "space-between"
})

const Picker = props => {
  const {
    prompt, // android only (doesn't work for now)
    pickerHeader, // ios only
    items = [],
    modalVisible,
    toggleModal,
    value,
    onChange,
    onBlur = () => null, // on android - called with onChange
    renderButton = null,
    autoclose = true, // ios; on android - always true
    box = false,
    focused = false,
    label,
    valueProps,
    ...rest
  } = props
  const itemsType = typeof items[0] === "string" ? "simple" : "complex"
  const valObject = itemsType === "complex" ? items.find(i => i.value === value) : {}
  const valToShow =
    value && itemsType === "complex" && valObject ? valObject.label : value
  const style = box ? boxStyle({ focused }) : {}
  return (
    <React.Fragment>
      {label && (
        <Text
          paddingBottom={8}
          color={colors.darkBlue10}
          opacity={0.5}
          fontSize={12}
          lineHeight={16}
        >
          {label}
        </Text>
      )}
      <View {...style} {...rest}>
        {renderButton ? (
          renderButton({
            openPicker: () => {
              if (isIOS) {
                toggleModal(true)
              }
            }
          })
        ) : (
          <TouchableOpacity
            paddingVertical={10}
            paddingHorizontal={10}
            width="100%"
            onPress={() => {
              if (isIOS) {
                toggleModal(true)
              }
            }}
          >
            <Row justifyContent={box ? "space-between" : "flex-end"} centerY>
              <Text
                variant="caption1"
                paddingRight={4}
                numberOfLines={1}
                ellipsizeMode="tail"
                {...valueProps}
              >
                {valToShow}
              </Text>
              <ChevronDownIcon size={20} color={colors.darkBlue30} />
            </Row>
          </TouchableOpacity>
        )}

        {isIOS ? (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => toggleModal(false)}
          >
            <ModalContent>
              <TouchableWithoutFeedback onPress={() => toggleModal(false)}>
                <RNView
                  flex={1}
                  style={{ backgroundColor: colors.black, opacity: 0.3 }}
                />
              </TouchableWithoutFeedback>
              <ModalControls>
                <ModalControlButton onPress={() => toggleModal(false)}>
                  <CloseIcon />
                </ModalControlButton>
                <Text variant="caption1">{pickerHeader}</Text>
                <ModalControlButton
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
                <Line />
                <RNPicker
                  selectedValue={value}
                  onValueChange={onChange}
                  itemStyle={{
                    color: colors.white,
                    fontSize: 14,
                    fontFamily: fonts.montserrat
                  }}
                >
                  {items.map((item, i) =>
                    typeof item === "string" ? (
                      <RNPicker.Item key={i} label={item} value={item} />
                    ) : (
                      <RNPicker.Item key={i} label={item.label} value={item.value} />
                    )
                  )}
                </RNPicker>
              </PickerContainer>
            </ModalContent>
          </Modal>
        ) : (
          <View width="100%" position="absolute">
            <RNPicker
              prompt={prompt}
              selectedValue={value}
              onValueChange={(v, i) => {
                onChange(v, i)
                onBlur(v, () => null)
              }}
              style={{
                marginLeft: 16,
                width: "100%",
                height: 40,
                color: colors.transparent,
                backgroundColor: colors.transparent
              }}
            >
              {items.map((item, i) =>
                typeof item === "string" ? (
                  <RNPicker.Item key={i} label={item} value={item} />
                ) : (
                  <RNPicker.Item key={i} label={item.label} value={item.value} />
                )
              )}
            </RNPicker>
          </View>
        )}
      </View>
    </React.Fragment>
  )
}

const enhance = compose(
  withProps(props => ({
    value: props.modelValue || props.value
  })),
  withState("modalVisible", "toggleModal", false)
)

export default enhance(Picker)
