import { Image, TextInput, View } from "glamorous-native"
import { compose, withState, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import { Dimensions } from "react-native"
import React from "react"
import numeral from "numeral"
import _ from "lodash/fp"

import { PrimaryButton } from "kui/components/Button"
import { Row } from "kui/components"
import { Screen } from "components/Background"
import IncrementalInput from "components/inputs/IncrementalInput"
import Text from "kui/components/Text"
import colors from "kui/colors"
import fonts from "kui/fonts"
import { SourceInfo } from "scenes/Home/NutritionJournal/common"

const Portion = ({
  food,
  value,
  onChange,
  upsertSelectedFood,
  mealTitle,
  navigation
}) => {
  const sourceInfo = SourceInfo[_.getOr(null, "sources[0]", food)]
  const sourceLabel = value === "1" ? sourceInfo.label : sourceInfo.label + "s"
  const portionImage = sourceInfo && sourceInfo.image
  const imageWidht = Dimensions.get("window").width - 40
  const imageHeight = (196 * imageWidht) / 372
  return (
    <Screen>
      <View
        flex={1}
        paddingBottom={40}
        paddingHorizontal={20}
        justifyContent="space-between"
      >
        <View>
          <View
            borderRadius={12}
            backgroundColor={colors.darkBlue90}
            paddingVertical={20}
            paddingHorizontal={16}
            elevation={10}
            shadowOpacity={0.5}
            shadowColor={colors.black}
            shadowOffset={{ width: 10, height: 10 }}
            shadowRadius={30}
          >
            <Row centerY>
              <View
                width={90}
                height={90}
                borderRadius={45}
                backgroundColor={colors.white50}
              >
                {food.pic && (
                  <Image
                    source={{ uri: food.pic }}
                    width={90}
                    height={90}
                    borderRadius={45}
                  />
                )}
              </View>
              <View paddingLeft={16} flex={1}>
                <Text variant="body2">{food.name}</Text>
                <Text variant="caption1">{food.description}</Text>
              </View>
            </Row>
          </View>
        </View>
        <View flex={0.5} justifyContent="flex-end">
          <View height={80}>
            <IncrementalInput
              value={value}
              iconConfig={{ size: 52, paddingHorizontal: 10 }}
              inputProps={{ width: 80, maxWidth: 80 }}
              onChange={onChange}
              renderProps={inputField}
              onUp={v => Math.min(20, (parseFloat(v) || 0) + 1).toString()}
              onDown={v => Math.max(0, (parseFloat(v) || 0) - 1).toString()}
            />
            <View alignItems="center">
              <Text variant="caption2">{sourceLabel.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <View flex={1} justifyContent="center">
          {!!portionImage && (
            <Image
              source={portionImage}
              width={imageWidht}
              height={imageHeight}
              resizeMode={"contain"}
            />
          )}
        </View>

        <PrimaryButton
          marginTop={20}
          label={"ADD TO " + (mealTitle || "").toUpperCase()}
          onPress={() => {
            upsertSelectedFood(food.id, +value)
            navigation.goBack()
          }}
          disabled={!isValid(value)}
        />
      </View>
    </Screen>
  )
}

const inputField = ({ onChange, value }) => (
  <View flex={1} justifyContent="center">
    <TextInput
      color={colors.white}
      fontSize={38}
      fontFamily={fonts.montserrat}
      keyboardType="numeric"
      textAlign="center"
      onChangeText={onChange}
      value={value}
      fontHeight={52}
    />
  </View>
)

const normalizePortion = (value, previousValue) => {
  if (value) {
    return value
      .toString()
      .match(/^((0|[1-9]\d{0,1})|((0|[1-9]\d{0,1}|[1-9]{0,2})[.,]\d{0,2}))$/)
      ? value
      : previousValue
  }

  return value
}

const isValid = value => {
  return (
    !!value
      .toString()
      .match(/^((0|[1-9]\d{0,1})|((0|[1-9]\d{0,1}|[1-9]{0,2})[.,]\d{1,2}))$/) &&
    +value !== 0
  )
}

const enhance = compose(
  withNavigation,
  withState("value", "setValue", ({ portions }) => numeral(portions).format("0.[00]")),
  withHandlers({
    onChange: ({ setValue, value }) => v => {
      const newValue = normalizePortion(v, value)
        .toString()
        .replace(",", ".")
      setValue(+newValue > 20 ? "20" : newValue)
    }
  })
)

export default enhance(Portion)
