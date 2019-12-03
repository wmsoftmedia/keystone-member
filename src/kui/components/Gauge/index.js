import { ProgressCircle } from "react-native-svg-charts"
import { View } from "glamorous-native"
import { compose, defaultProps, withProps } from "recompose"
import React from "react"
import numeral from "numeral"

import Row from "components/Row"
import Text from "kui/components/Text"
import colors from "kui/colors"

const ValueLabel = p => <Text variant="caption1" {...p} />

const GaugeBase = props => {
  const { value, valueSuffix, max, hideTarget, disableWarning, color } = props
  const { size, labelBelow, renderInside, showValueWithin, progressCircleProps } = props
  const progress = value / (max ? max : 1)
  const delta = max - value
  const inWarningZone = max && max > 0 && delta < 0

  return (
    <View alignItems="center">
      <View>
        <ProgressCircle
          style={{ height: size, width: size }}
          progress={progress}
          {...progressCircleProps}
          progressColor={
            !disableWarning && inWarningZone
              ? colors.warningRed
              : color || progressCircleProps.progressColor
          }
        />
        {showValueWithin && (
          <Row
            height="100%"
            position="absolute"
            alignSelf="center"
            justifyContent="center"
          >
            {renderInside ? (
              renderInside(value, delta)
            ) : (
              <React.Fragment>
                <ValueLabel>{value ? value : "--"}</ValueLabel>
                {!hideTarget && !!max && (
                  <ValueLabel color={colors.darkBlue50}>/{max}</ValueLabel>
                )}
                {valueSuffix && <ValueLabel>{valueSuffix}</ValueLabel>}
              </React.Fragment>
            )}
          </Row>
        )}
      </View>
      {labelBelow && (
        <View paddingTop={8}>
          <Text color={colors.blue20} fontSize={10}>
            {labelBelow.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  )
}

const enhance = compose(
  //pure,
  withProps(props => ({
    max: 1,
    size: 60,
    labelBelow: null,
    showValueWithin: false,
    renderInside: undefined,
    warningThreshold: null,
    disableWarning: false,
    hideTarget: false,
    color: undefined,
    ...props,
    progressCircleProps: {
      animate: false,
      animationDuration: 250,
      strokeWidth: 6,
      cornerRadius: 20,
      progressColor: colors.blue40,
      backgroundColor: colors.darkBlue80,
      ...props.progressCircleProps
    }
  }))
)

export const CircleGauge = enhance(GaugeBase)

const formatValue = (value, limit = 9999) =>
  numeral(value).format(value > limit ? "0.[0]a" : "0,0")

export const GaugeWithTarget = compose(
  defaultProps({ disableWarning: false }),
  withProps(() => ({}))
)(props => {
  const { value, target, hasTarget, showValueWithin, renderInside } = props
  const { valueTextProps, targetTextProps } = props
  const { progressCircleProps, targetColor = colors.white50 } = props
  const { disableWarning } = props
  const { label, measure, renderSuffix } = props
  const shouldWarn = !disableWarning && hasTarget && value > target
  const textColor = shouldWarn ? colors.warningRed : colors.white
  return (
    <Row>
      <View paddingRight={16}>
        <CircleGauge
          size={80}
          value={value}
          max={target}
          disableWarning={disableWarning}
          progressCircleProps={progressCircleProps}
          renderInside={renderInside}
          showValueWithin={showValueWithin}
        />
      </View>
      <View flex={1}>
        <Row>
          <Text variant={"h1"} color={textColor} {...valueTextProps}>
            {formatValue(value)}
            {hasTarget ? "" : " " + measure}
          </Text>
          {hasTarget && target && (
            <Text variant={"h1"} color={targetColor} {...targetTextProps}>
              /{formatValue(target)} {measure}
            </Text>
          )}
          {renderSuffix && renderSuffix()}
        </Row>
        <Text color={colors.blue20} fontSize={10}>
          {label}
        </Text>
      </View>
    </Row>
  )
})
