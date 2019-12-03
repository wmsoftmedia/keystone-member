import React from "react"
import styled, { View, Text, ScrollView } from "glamorous-native"
import KitchenPage from "../Template"
import { Control } from "react-redux-form/native"
import Row from "components/Row"
import CenterView from "components/CenterView"
import colors from "colors"
import { Input } from "../SearchBar"
import TextInput from "components/form/TextInput"

export default () => (
  <KitchenPage disableArch>
    <Row paddingHorizontal={12} paddingBottom={8}>
      <Row flex={1} justifyContent="space-evenly">
        <Text color={colors.white} fontSize={16}>
          Prep Time
        </Text>
        <View width={40}>
          <Control
            model=".prepTime"
            component={Input}
            clearButton={false}
            keyboardType="numeric"
          />
        </View>
        <Text color={colors.white50} fontSize={16}>
          min
        </Text>
      </Row>
      <Row flex={1} justifyContent="space-evenly">
        <Text color={colors.white} fontSize={16}>
          Total Time
        </Text>
        <View width={40} height={40}>
          <Control
            model=".totalTime"
            component={Input}
            clearButton={false}
            keyboardType="numeric"
          />
        </View>
        <Text color={colors.white50} fontSize={16}>
          min
        </Text>
      </Row>
    </Row>
    <CenterView flex={0} paddingBottom={8}>
      <Text color={colors.white50} fontSize={18}>
        METHOD
      </Text>
    </CenterView>
    <View flex={1} paddingHorizontal={12}>
      <Control
        model=".method"
        component={Input}
        keyboardType="default"
        multiline
        numberOfLines={10}
        backgroundColor={colors.blue9}
        height={26 * 10}
      />
    </View>
  </KitchenPage>
)
