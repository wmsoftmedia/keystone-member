import { FlatList, View } from "glamorous-native"
import React from "react"
import _ from "lodash/fp"

import { Row } from "kui/components"
import Text from "kui/components/Text"
import colors from "kui/colors"

const source = _.sortBy(
  ["title"],
  [
    // protein
    {
      title: "Milk (fat free)",
      protein: 3.4,
      fat: 0.1,
      carbs: 5,
      sourceFor: ["protein", "carbs"]
    },
    {
      title: `Cottage cheese\n(fat free)`,
      protein: 10,
      fat: 0.3,
      carbs: 7,
      sourceFor: ["protein", "carbs"]
    },
    {
      title: "Egg whites",
      protein: 11,
      fat: 0.2,
      carbs: 0.7,
      sourceFor: ["protein"]
    },
    {
      title: "Greek yogurt (plain)",
      protein: 10,
      fat: 0.4,
      carbs: 3.6,
      sourceFor: ["protein"]
    },
    {
      title: "Turkey bacon",
      protein: 16,
      fat: 16.9,
      carbs: 1.9,
      sourceFor: ["protein"]
    },
    {
      title: "Turkey breast",
      protein: 22,
      fat: 7,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Cod",
      protein: 18,
      fat: 0.7,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Chicken sausage",
      protein: 18,
      fat: 7.8,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Shrimp",
      protein: 24,
      fat: 0.3,
      carbs: 0.2,
      sourceFor: ["protein"]
    },
    {
      title: "Tilapia",
      protein: 26,
      fat: 2.7,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Pink salmon",
      protein: 25,
      fat: 5,
      carbs: 0,
      sourceFor: ["protein", "fat"]
    },
    {
      title: "Ham",
      protein: 18,
      fat: 8,
      carbs: 2.3,
      sourceFor: ["protein"]
    },
    {
      title: "Sirloin steak",
      protein: 20,
      fat: 12,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Pork loin",
      protein: 27,
      fat: 15,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Beef 95/5",
      protein: 21.4,
      fat: 5,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Chicken breast",
      protein: 31,
      fat: 3.6,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: `Almond cheese\n(low fat)`,
      protein: 25.2,
      fat: 9.9,
      carbs: 3.9,
      sourceFor: ["protein", "fat"]
    },
    {
      title: "Tuna (canned)",
      protein: 24.8,
      fat: 2.6,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "Cheese (fat free)",
      protein: 22.6,
      fat: 0.8,
      carbs: 13.5,
      sourceFor: ["protein", "carbs"]
    },
    {
      title: "Beef jerky",
      protein: 33.5,
      fat: 4.5,
      carbs: 27.3,
      sourceFor: ["protein"]
    },
    {
      title: "Textured Vegetable Protein (TVP)",
      protein: 52.94,
      fat: 0,
      carbs: 0,
      sourceFor: ["protein"]
    },
    {
      title: "100% whey",
      protein: 77.4,
      fat: 4.8,
      carbs: 12.9,
      sourceFor: ["protein"]
    },
    // carbs
    {
      title: "Sweet potato",
      protein: 1.6,
      fat: 0.1,
      carbs: 20,
      sourceFor: ["carbs"]
    },
    {
      title: "Lentils",
      protein: 9,
      fat: 0.4,
      carbs: 20,
      sourceFor: ["carbs", "protein"]
    },
    {
      title: "Fava beans",
      protein: 8,
      fat: 0.7,
      carbs: 18,
      sourceFor: ["carbs", "protein"]
    },
    {
      title: "Potato",
      protein: 2,
      fat: 0.1,
      carbs: 17,
      sourceFor: ["carbs"]
    },
    {
      title: "Green peas",
      protein: 5,
      fat: 0.4,
      carbs: 14,
      sourceFor: ["carbs", "protein"]
    },
    {
      title: "Banana",
      protein: 1.1,
      fat: 0.3,
      carbs: 23,
      sourceFor: ["carbs"]
    },
    {
      title: "Apple",
      protein: 0.3,
      fat: 0.2,
      carbs: 14,
      sourceFor: ["carbs"]
    },
    {
      title: "Berries",
      protein: 0.7,
      fat: 0.3,
      carbs: 14,
      sourceFor: ["carbs"]
    },
    {
      title: "Quinoa (cooked)",
      protein: 4.4,
      fat: 1.9,
      carbs: 21.6,
      sourceFor: ["carbs"]
    },
    {
      title: "Oats",
      protein: 5.3,
      fat: 2.6,
      carbs: 27,
      sourceFor: ["carbs"]
    },
    {
      title: "Brown rice (cooked)",
      protein: 2.6,
      fat: 0.9,
      carbs: 23,
      sourceFor: ["carbs"]
    },
    {
      title: "Vegetables",
      protein: 2.9,
      fat: 0.2,
      carbs: 13,
      sourceFor: ["carbs"]
    },
    // fat
    {
      title: "Avocado",
      protein: 2,
      fat: 15,
      carbs: 9,
      sourceFor: ["fat"]
    },
    {
      title: "Cheese (cheddar)",
      protein: 25,
      fat: 33,
      carbs: 1.3,
      sourceFor: ["fat", "protein"]
    },
    {
      title: "Whole egg",
      protein: 13,
      fat: 10,
      carbs: 0.7,
      sourceFor: ["fat", "protein"]
    },
    {
      title: "Almonds",
      protein: 21,
      fat: 52.5,
      carbs: 21,
      sourceFor: ["fat", "carbs"]
    },
    {
      title: "Walnuts",
      protein: 15,
      fat: 65,
      carbs: 14,
      sourceFor: ["fat", "carbs"]
    },
    {
      title: "Macadamia",
      protein: 8,
      fat: 76,
      carbs: 14,
      sourceFor: ["fat", "carbs"]
    },
    {
      title: "Peanuts",
      protein: 26,
      fat: 49,
      carbs: 16,
      sourceFor: ["fat", "carbs", "protein"]
    },
    {
      title: "Hazelnuts",
      protein: 15,
      fat: 61,
      carbs: 17,
      sourceFor: ["fat", "carbs"]
    },
    {
      title: "Pumpkin seeds",
      protein: 19,
      fat: 19,
      carbs: 54,
      sourceFor: ["fat", "carbs", "protein"]
    },
    {
      title: "Chia seeds",
      protein: 17,
      fat: 31,
      carbs: 42,
      sourceFor: ["fat", "carbs", "protein"]
    },
    {
      title: "Olive oil",
      protein: 0,
      fat: 100,
      carbs: 0,
      sourceFor: ["fat"]
    },
    {
      title: "Coconut oil",
      protein: 0,
      fat: 100,
      carbs: 0,
      sourceFor: ["fat"]
    },
    {
      title: "Coconut",
      protein: 3.3,
      fat: 33,
      carbs: 14,
      sourceFor: ["fat"]
    },
    {
      title: "Full-Fat Yogurt",
      protein: 3.5,
      fat: 3.3,
      carbs: 4.7,
      sourceFor: ["fat"]
    }
  ]
)

const NUTRITION_FACTS = ["protein", "fat", "carbs"]
const SOURCES = {
  protein: source.filter(s => s.sourceFor.includes("protein")),
  fat: source.filter(s => s.sourceFor.includes("fat")),
  carbs: source.filter(s => s.sourceFor.includes("carbs"))
}

const Source = ({ nutritionFact }) => {
  return (
    <View flex={1}>
      <Row height={40} centerY backgroundColor={colors.darkBlue40}>
        <Text variant="button1" width={164} paddingLeft={20}>
          FOOD ITEMS/100G
        </Text>
        <Row flex={1}>
          <TableHeader isHightlighted={nutritionFact === NUTRITION_FACTS[0]}>
            {NUTRITION_FACTS[0].toUpperCase()}
          </TableHeader>
          <TableHeader isHightlighted={nutritionFact === NUTRITION_FACTS[1]}>
            {NUTRITION_FACTS[1].toUpperCase()}
          </TableHeader>
          <TableHeader isHightlighted={nutritionFact === NUTRITION_FACTS[2]}>
            {NUTRITION_FACTS[2].toUpperCase()}
          </TableHeader>
        </Row>
      </Row>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={SOURCES[nutritionFact]}
        renderItem={({ item }) => (
          <TableRow
            title={item.title}
            protein={item[NUTRITION_FACTS[0]]}
            fat={item[NUTRITION_FACTS[1]]}
            carbs={item[NUTRITION_FACTS[2]]}
            nutritionFact={nutritionFact}
          />
        )}
      />
    </View>
  )
}

const TableRow = ({ title, protein, fat, carbs, nutritionFact }) => {
  return (
    <Row minHeight={40}>
      <Row
        centerY
        backgroundColor={colors.darkBlue70_40}
        width={164}
        paddingLeft={20}
        paddingRight={20}
      >
        <Text variant="caption1" paddingVertical={10}>
          {title}
        </Text>
      </Row>
      <Row flex={1}>
        <TableCell isHightlighted={nutritionFact === "protein"}>{protein}</TableCell>
        <TableCell isHightlighted={nutritionFact === "fat"}>{fat}</TableCell>
        <TableCell isHightlighted={nutritionFact === "carbs"}>{carbs}</TableCell>
      </Row>
    </Row>
  )
}

const TableCell = ({ children, isHightlighted = false }) => {
  return (
    <Row
      centerXY
      backgroundColor={colors.darkBlue80_40}
      flex={0.34}
      opacity={isHightlighted ? 1 : 0.4}
    >
      <Text variant="body2">{children}</Text>
    </Row>
  )
}

const TableHeader = ({ children, isHightlighted = false }) => {
  return isHightlighted ? (
    <Row centerXY backgroundColor={colors.darkBlue80_40} flex={0.34} height={40}>
      <Text variant="button1">{children}</Text>
    </Row>
  ) : (
    <Row centerXY flex={0.33}>
      <Text variant="button1">{children}</Text>
    </Row>
  )
}

export default Source
