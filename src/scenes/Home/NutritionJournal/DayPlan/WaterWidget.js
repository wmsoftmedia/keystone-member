import { TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps } from "recompose"
import React from "react"
import * as Sentry from "sentry-expo"
import _ from "lodash/fp"

import { AddIcon, RaindropIcon } from "kui/icons"
import { Row } from "kui/components"
import { logErrorWithMemberId } from "hoc/withErrorHandler"
import { withLoader } from "hoc/withLoader"
import Text from "kui/components/Text"
import colors from "kui/colors"
import withUpdateWater from "graphql/mutation/foodJournal/saveWater"
import withWaterVolume from "graphql/query/foodJournal/waterVolume"

const GLASS_VOLUME = 250

const WaterWidget = ({
  target = 0,
  consumed = 0,
  onPress,
  fullColor = colors.blue50,
  emptyColor = colors.darkBlue80
}) => {
  const consumedGlasses = Math.round(consumed / GLASS_VOLUME)
  const targetGlasses = Math.round(target / GLASS_VOLUME)

  return (
    <View>
      <Row spread centerY paddingHorizontal={20}>
        <Text variant="caption1" color={colors.blue10}>
          {targetGlasses ? `Target: ${targetGlasses} glasses` : "No target"}
        </Text>
        <Text variant="caption2" color={colors.blue10} lineHeight={12} opacity={0.6}>
          {consumedGlasses} x {GLASS_VOLUME} ml ={" "}
          {consumed < 1000 ? consumed + " ml" : consumed / 1000 + " L"}
        </Text>
      </Row>
      <Row flexWrap="wrap" paddingHorizontal={12}>
        {_.range(
          0,
          targetGlasses > consumedGlasses ? targetGlasses : consumedGlasses + 1
        ).map(i => (
          <TouchableOpacity
            key={i}
            width="12.5%"
            alignItems="center"
            onPress={() =>
              consumedGlasses === i + 1
                ? onPress(i * GLASS_VOLUME)
                : onPress((i + 1) * GLASS_VOLUME)
            }
            paddingTop={16}
            paddingBottom={4}
          >
            <RaindropIcon color={i < consumedGlasses ? fullColor : emptyColor} />
            {i === consumedGlasses && (
              <View position="absolute" bottom={6}>
                <AddIcon color={colors.darkBlue30} size={24} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </Row>
    </View>
  )
}

const enhance = compose(
  withWaterVolume,
  withUpdateWater,
  withLoader({ message: "Loading Water...", dataKeys: ["WaterVolume"] }),
  withProps(({ waterVolume }) => ({ consumed: waterVolume })),
  withHandlers({
    onPress: ({ saveJournalWaterVolume, date }) => volume =>
      saveJournalWaterVolume({ date, volume }).catch(e =>
        logErrorWithMemberId(memberId =>
          Sentry.captureException(
            new Error(
              `MId:{${memberId}}, Scope:{NutritionJournal.DayPlan.WaterWidget.saveJournalWaterVolume}, Data:{${{
                date,
                volume
              }}}, Error:{${_.toString(e)}}`
            )
          )
        )
      )
  })
)

export default enhance(WaterWidget)
