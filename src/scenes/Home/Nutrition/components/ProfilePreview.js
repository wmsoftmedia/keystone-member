import { ScrollView } from "react-native"
import React from "react"
import styled, { View } from "glamorous-native"

import { ModalScreen } from "components/Background"
import { Row } from "kui/components"
import { cals, daysToNumbers, formatCals, titleCase } from "keystone"
import Days from "scenes/Home/Nutrition/components/Days"
import Text from "kui/components/Text"
import colors from "kui/colors"
import fonts from "kui/fonts"

const Section = styled(p => <View {...p} />)({
  paddingHorizontal: 20
})

const SectionHeader = p => <Text variant="button1" color={colors.darkBlue20} {...p} />

const SectionText = p => <Text variant="body2" {...p} />

const Preview = ({ profile }) => {
  const days = daysToNumbers(profile.days)
  return (
    <ModalScreen grabby>
      <View paddingHorizontal={20}>
        <Text variant="h2" textAlign="center">
          {titleCase(profile.label)}
        </Text>
        <Days days={days} paddingTop={20} />
      </View>
      <View flex={1} paddingTop={28}>
        <ScrollView>
          <Row justifyContent={"space-between"}>
            <Section flex={1}>
              <SectionHeader>INTAKE GOAL</SectionHeader>
              <Text variant="h1" paddingTop={12}>
                {formatCals(cals(profile.macros))}
              </Text>
            </Section>
            <Section flex={1}>
              <SectionHeader>MACRO GOALS</SectionHeader>
              <Row paddingTop={24}>
                <SectionText fontFamily={fonts.montserrat}>Protein: </SectionText>
                <SectionText>{profile.macros.protein} g</SectionText>
              </Row>
              <Row paddingTop={8}>
                <SectionText fontFamily={fonts.montserrat}>Fat: </SectionText>
                <SectionText>{profile.macros.fat} g</SectionText>
              </Row>
              <Row paddingTop={8}>
                <SectionText fontFamily={fonts.montserrat}>Carbs: </SectionText>
                <SectionText>{profile.macros.carbs} g</SectionText>
              </Row>
            </Section>
          </Row>
          <View flex={1} paddingTop={20} paddingHorizontal={20}>
            <SectionHeader>NOTES</SectionHeader>
            <View flex={1} paddingTop={12}>
              <Text variant="body1">{profile.notes || "--"}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ModalScreen>
  )
}

export default Preview
