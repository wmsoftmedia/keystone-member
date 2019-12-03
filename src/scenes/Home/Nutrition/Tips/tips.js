import { Image, View } from "glamorous-native"
import React from "react"

import Line from "kui/components/Line"
import Text from "kui/components/Text"
import fonts from "kui/fonts"
import food from "scenes/Home/Nutrition/Tips/images/food.png"
import liquids from "scenes/Home/Nutrition/Tips/images/liquids.png"
import mind from "scenes/Home/Nutrition/Tips/images/mind.png"
import movement from "scenes/Home/Nutrition/Tips/images/movement.png"

const B = p => <Text fontFamily={fonts.montserratSemiBold} {...p} />
const I = p => <Text fontFamily={fonts.montserratItalic} {...p} />

export const generalTips = [
  {
    title: "Tip 1: Borrowing & Saving Macros",
    summaryText:
      "You can manipulate your daily macros to accomodate inevitable hurdles during a dieting phase, like plannig highler calorie meals...",
    fullContent: () => (
      <View>
        <Text variant="body1">
          You can manipulate your daily macros to accomodate inevitable hurdles during a
          dieting phase, like planning higher calorie meals for a celebration or
          experiencing left of appetite when sick.
        </Text>
        <I paddingTop={12}>Avoid borrowing and saving protein macros.</I>
        <Text variant="body2" paddingTop={24}>
          Borrowing
        </Text>
        <Text variant="body1" paddingTop={12}>
          If you find yourself over on carbs or fat on a certain day, you can borrow those
          carbs from the following day to compensate.
        </Text>
        <Text variant="body2" paddingTop={24}>
          Saving
        </Text>
        <Text variant="body1" paddingTop={12}>
          If you don&apos;t finish your macros, leftover carbs and fat can be rolled over
          to the following day to even out your intake.
        </Text>
        <Line marginVertical={24} />
        <Text variant="body1">
          <I>
            Consistency and hitting an accurate weekly total will determine your rate of
            progress, so make sure you use this tool sparingly.
          </I>
        </Text>
      </View>
    )
  },
  {
    title: "Tip 2: How to track alcohol?",
    summaryText:
      "While alcohol should be consumed moderately and within balance, it's perfectly fine to consume an alcoholic beverage from time to time...",
    fullContent: () => (
      <View>
        <Text variant="body1">
          While alcohol should be consumed moderately and within balance, it&apos;s
          perfectly fine to consume an alcoholic beverage from time to time.
        </Text>
        <Text variant="body1" paddingTop={12}>
          Since alcohol isn&apos;t listed on nutrition labels, the macronutritents (Fat,
          Carbs & Protein) don&apos;t seem to add up to the calories listed. So in order
          to track alcoholic drinks accurately into our macros, we have to do some math.
        </Text>
        <Text variant="body2" paddingTop={24}>
          Calculate as Carbohydrate
        </Text>
        <Text variant="body1" paddingTop={12}>
          Take the total calories of the drink & divide by 4.
        </Text>
        <I>Example: 180/4 = 45g carbs</I>
        <Text paddingVertical={12} textAlign="center">
          <B>OR</B>
        </Text>
        <Text variant="body2" paddingTop={12}>
          Calculate as Fat
        </Text>
        <Text variant="body1" paddingTop={12}>
          Take the total calories of the drink & divide by 9.
        </Text>
        <I>Example: 180/9 = 20g fat</I>
      </View>
    )
  }
]

export const hungerManagement = [
  {
    title: "Food",
    summaryText: "Swap some calorie-dense carbs for vegatables for more volume.",
    summaryContent: () => (
      <View>
        <Text variant="body2">Food</Text>
        <Text variant="caption1" paddingTop={12}>
          Swap some calorie-dense carbs for <B>vegatables</B> for more volume.
        </Text>
        <Text variant="caption1" paddingTop={12}>
          Switch high calorie condiments for <B>lower-calorie condiment equivalent</B>{" "}
          (like low-fat dressing and reduced sugar ketchup).
        </Text>
        <Text variant="caption1" paddingTop={12}>
          Use <B>zero calorie seasonings</B> to add variation and flavor to dishes.
        </Text>
      </View>
    ),
    fullContent: null,
    backgroundImage: () => (
      <Image
        source={food}
        width={139}
        position="absolute"
        bottom={0}
        borderRadius={12}
        opacity={0.6}
      />
    )
  },
  {
    title: "Movement",
    summaryText: "Busy yourself, boredom is often mistaken for hunger.",
    summaryContent: () => (
      <View>
        <Text variant="body2">Movement</Text>
        <Text variant="caption1" paddingTop={12}>
          <B>Busy yourself</B>, boredom is often mistaken for hunger.
        </Text>
      </View>
    ),
    fullContent: null,
    backgroundImage: () => (
      <Image source={movement} width={165} position="absolute" top={20} opacity={0.6} />
    )
  },
  {
    title: "Mind",
    summaryText: "Eat on smaller plates so food appears to be a larger portion",
    summaryContent: () => (
      <View>
        <Text variant="body2">Mind</Text>
        <Text variant="caption1" paddingTop={12}>
          Eat on <B>smaller plates</B> so food appears to be a larger portion.
        </Text>
        <Text variant="caption1" paddingTop={12}>
          <B>Be mindful</B> of social pressures and events in advance.
        </Text>
        <Text variant="caption1" paddingTop={12}>
          Enjoy your <B>favourite foods in moderation</B> to make your diet sustainable.
        </Text>
      </View>
    ),
    fullContent: null,
    backgroundImage: () => (
      <Image source={mind} width={135} position="absolute" top={33} opacity={0.6} />
    )
  },
  {
    title: "Liquids",
    summaryText: "Try to drink malnly water",
    summaryContent: () => (
      <View>
        <Text variant="body2">Liquids</Text>
        <Text variant="caption1" paddingTop={12}>
          Try to drink <B>mainly water</B>.
        </Text>
        <Text variant="caption1" paddingTop={12}>
          Utilize <B>zero calorie drinks</B> to curb cravings (diet soda, seltzers,
          crystal light, coffee, tea).
        </Text>
        <Text variant="caption1" paddingTop={12}>
          Consume <B>soups and broths</B>.
        </Text>
      </View>
    ),
    fullContent: null,
    backgroundImage: () => (
      <Image source={liquids} width={102} position="absolute" left={11} opacity={0.6} />
    )
  }
]
