import { defaultProps, compose } from "recompose"
import React from "react"
import styled, { View } from "glamorous-native"

import { TextButtonBackward, TextButtonForward } from "kui/components/Button"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const NavigationButton = styled.touchableOpacity(({ disabled }) => ({
  marginRight: 4,
  opacity: disabled ? 0.5 : 1,
  paddingHorizontal: 8,
  flexDirection: "row",
  alignItems: "center"
}))

const ButtonCaption = p => (
  <Text
    color={colors.white}
    opacity={0.5}
    position="absolute"
    variant="caption1"
    fontSize={10}
    bottom={0}
    {...p}
  />
)

const FooterNavigation = props => {
  const { movePrev, moveNext } = props
  const { prevLabel, nextLabel, title, titleComponent } = props
  const isLastStage = _.trim(nextLabel.toLowerCase()) === "finish"
  return (
    <View>
      <View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={10}
        paddingHorizontal={12}
        backgroundColor={colors.darkBlue80}
      >
        <View flex={1} alignItems="flex-start">
          {movePrev && (
            <React.Fragment>
              <ButtonCaption left={20}>{prevLabel}</ButtonCaption>
              <TextButtonBackward
                marginLeft={-10}
                label="PREV STAGE"
                onPress={movePrev}
              />
            </React.Fragment>
          )}
        </View>
        <View>
          {titleComponent}
          {title && (
            <View paddingHorizontal={8}>
              <Text variant="body2">{title}</Text>
            </View>
          )}
        </View>
        <View flex={1} alignItems="flex-end">
          <ButtonCaption right={20}>{isLastStage ? "REVIEW" : nextLabel}</ButtonCaption>
          {moveNext && (
            <TextButtonForward
              marginRight={-10}
              labelProps={{ color: isLastStage ? colors.green50 : colors.white }}
              label={isLastStage ? "FINISH" : "NEXT STAGE"}
              onPress={moveNext}
            />
          )}
        </View>
      </View>
    </View>
  )
}

const enhanced = compose(
  defaultProps({
    title: undefined,
    prevLabel: "PREV",
    nextLabel: "NEXT",
    disablePrev: false,
    disableNext: false
  })
)

export default enhanced(FooterNavigation)
