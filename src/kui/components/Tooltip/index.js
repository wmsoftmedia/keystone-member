import { ScrollView, View } from "react-native"
import { setPropTypes } from "recompose"
import { walkthroughable, CopilotStep } from "react-native-copilot"
import React from "react"

import { PrimaryButton, TextButton } from "kui/components/Button"
import { Row } from "kui/components"
import PropTypes from "prop-types"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const CopilotView = walkthroughable(View)

const Tooltip = setPropTypes({
  text: PropTypes.string,
  order: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onStop: PropTypes.func,
  onFinish: PropTypes.func,
  scrollProps: PropTypes.object,
  children: PropTypes.element.isRequired,
  renderContent: PropTypes.func,
  active: PropTypes.bool
})(
  ({
    text,
    order,
    name,
    title,
    onNext,
    onPrev,
    onStop,
    onFinish,
    scrollProps,
    children,
    renderContent,
    active,
    ...rest
  }) => {
    return (
      <CopilotStep
        text={text}
        order={order}
        name={name}
        title={title}
        onNext={onNext}
        onPrev={onPrev}
        onStop={onStop}
        onFinish={onFinish}
        scrollProps={scrollProps}
        renderContent={renderContent}
        active={active}
      >
        <CopilotView {...rest}>{children}</CopilotView>
      </CopilotStep>
    )
  }
)

export const Message = setPropTypes({
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool,
  handleNext: PropTypes.func,
  handlePrev: PropTypes.func,
  handleStop: PropTypes.func,
  currentStep: PropTypes.object
})(props => {
  const { isFirstStep, isLastStep, currentStep } = props
  const { handlePrev, handleNext, handleStop } = props
  const title = _.getOr(null, "target.props.title", currentStep)
  const renderContent = _.getOr(null, "target.props.renderContent", currentStep)
  const onNext = _.getOr(() => null, "target.props.onNext", currentStep)
  const onPrev = _.getOr(() => null, "target.props.onPrev", currentStep)
  const onStop = _.getOr(() => null, "target.props.onStop", currentStep)
  const onFinish = _.getOr(() => null, "target.props.onFinish", currentStep)
  const scrollProps = _.getOr({}, "target.props.scrollProps", currentStep)
  return (
    <View paddingBottom={10}>
      <ScrollView maxHeight={110} {...scrollProps}>
        <View flex={1}>
          <Text variant="h2" color={colors.darkBlue90}>
            {title}
          </Text>
          {renderContent ? (
            renderContent()
          ) : (
            <Text variant="caption1" color={colors.darkBlue90}>
              {currentStep.text}
            </Text>
          )}
        </View>
      </ScrollView>
      <Row
        centerY
        justifyContent={isLastStep ? "flex-end" : "space-between"}
        paddingTop={10}
        flexWrap="wrap"
      >
        {!isLastStep && (
          <TextButton
            marginLeft={-10}
            label="SKIP"
            labelProps={{ color: colors.darkBlue60 }}
            onPress={() => {
              onStop()
              handleStop()
            }}
          />
        )}
        <Row centerY>
          {!isFirstStep && (
            <TextButton
              marginLeft={-10}
              marginRight={10}
              label="PREVIOUS"
              labelProps={{ color: colors.darkBlue60 }}
              onPress={() => {
                onPrev()
                handlePrev()
              }}
            />
          )}
          {!isLastStep ? (
            <PrimaryButton
              minWidth={80}
              height={40}
              label="NEXT"
              onPress={() => {
                onNext()
                handleNext()
              }}
            />
          ) : (
            <PrimaryButton
              minWidth={80}
              height={40}
              label="FINISH!"
              onPress={() => {
                handleStop()
                onFinish()
              }}
            />
          )}
        </Row>
      </Row>
    </View>
  )
})

export default Tooltip
