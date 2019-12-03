import { View } from "glamorous-native"
import React from "react"

import { CircleGauge } from "kui/components/Gauge"
import { Row } from "kui/components"
import { formatCals } from "keystone"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import colors from "kui/colors"

const FACTS = {
  fibre: { name: "Fibre", measure: "g" },
  alcohol: { name: "Alcohol", measure: "g" },
  sugar: { name: "Sugar", measure: "g" },
  saturatedFat: { name: "Saturated Fat", measure: "g" },
  polyunsaturatedFat: { name: "Polyunsaturated Fat", measure: "g" },
  monounsaturatedFat: { name: "Monounsaturated Fat", measure: "g" },
  transFat: { name: "Trans Fat", measure: "g" },
  cholesterol: { name: "Cholesterol", measure: "mg" },
  sodium: { name: "Sodium", measure: "mg" },
  potassium: { name: "Potassium", measure: "mg" },
  vitaminA: { name: "Vitamin A", measure: "mg" },
  vitaminC: { name: "Vitamin C", measure: "mg" },
  calcium: { name: "Calcium", measure: "mg" },
  iron: { name: "Iron", measure: "mg" }
}

const NutritionFacts = ({ facts }) => {
  const cals = facts.cals || facts.calories || 0
  return (
    <View>
      <Line marginVertical={28} />
      <Row spread paddingHorizontal={20}>
        <Text variant="h1" width={88} fontSize={22}>
          {formatCals(cals, " Cals")}
        </Text>
        <CircleGauge
          value={facts.protein || "0"}
          valueSuffix={"g"}
          max={cals / 4}
          labelBelow={"PROTEIN (G)"}
          color={colors.green50}
          showValueWithin
          hideTarget
        />
        <CircleGauge
          value={facts.fat || "0"}
          valueSuffix={"g"}
          max={cals / 9}
          labelBelow={"FAT (G)"}
          showValueWithin
          hideTarget
        />
        <CircleGauge
          value={facts.carbs || "0"}
          valueSuffix={"g"}
          max={cals / 4}
          labelBelow={"CARBS (G)"}
          color={colors.turquoise50}
          showValueWithin
          hideTarget
        />
      </Row>

      <Line marginVertical={28} />
      <Text variant="h2" paddingHorizontal={20} paddingBottom={8}>
        Nutrition Facts
      </Text>
      {Object.keys(FACTS).map((key, index) => (
        <View key={key}>
          {index !== 0 && <Line />}
          <Row centerY spread paddingHorizontal={20} paddingVertical={12}>
            <Text variant="body1">{FACTS[key].name}</Text>
            <Text variant="caption1" color={colors.darkBlue30}>
              {facts[key] !== null && facts[key] !== undefined
                ? facts[key] + " " + FACTS[key].measure
                : "--"}
            </Text>
          </Row>
        </View>
      ))}
    </View>
  )
}

export default NutritionFacts
