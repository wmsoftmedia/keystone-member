import { ActivityIndicator } from "react-native"
import { Image, ScrollView, TouchableOpacity, View } from "glamorous-native"
import { compose, withHandlers, withProps, withState } from "recompose"
import { withNavigation } from "react-navigation"
import Fuse from "fuse.js"
import React from "react"
import numeral from "numeral"

import { CheckIcon, ChevronRightIcon } from "kui/icons"
import { HelpIcon } from "scenes/Home/Icons"
import { IconButton, PrimaryButton } from "kui/components/Button"
import { ModalScreen } from "components/Background"
import { Row } from "kui/components"
import { SOURCES } from "scenes/Home/NutritionJournal/journal"
import { TextInput } from "kui/components/Input"
import { homeRoutes } from "navigation/routes"
import { withLoader } from "hoc/withLoader"
import Text from "kui/components/Text"
import Tooltip from "kui/components/Tooltip"
import _ from "lodash/fp"
import colors from "kui/colors"
import withFoodDictionary from "graphql/query/foodJournal/foodDictionary"
import withTooltip from "hoc/withTooltip"
import { titleCase } from "keystone"

const SOURCE_TOOLTIPS = {
  PROTEIN: {
    title: "Choose a source of Protein",
    text:
      "Select a source and specify the number of portions to be added to your tracker."
  },
  FAT: {
    title: "Choose a source of Fat",
    text:
      "Select a source and specify the number of portions to be added to your tracker."
  },
  CARBS: {
    title: "Choose a source of Carbs",
    text:
      "Select a source and specify the number of portions to be added to your tracker."
  },
  VEGETABLES: {
    title: "Choose a source of Vegetables",
    text:
      "Select a source and specify the number of portions to be added to your tracker."
  }
}

const JournalSource = ({
  term,
  setTerm,
  source,
  allFilters,
  selectedTab,
  toggleFilter,
  filteredFood,
  selectedFood,
  onNavigateToFood,
  onDonePress,
  basketMode,
  toggleSelectedFoodList,
  startTooltip
}) => {
  return (
    <ModalScreen>
      <View
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        backgroundColor={colors.darkBlue90}
        padding={20}
        elevation={15}
        shadowOpacity={0.4}
        shadowColor={colors.black}
        shadowOffset={{ width: 0, height: 0 }}
        shadowRadius={20}
      >
        <Row centerX>
          <View flex={1}>
            <TextInput
              value={term}
              placeholder="Search"
              maxLength={120}
              onChange={setTerm}
            />
          </View>
          {!!source && (
            <IconButton onPress={() => startTooltip()} paddingRight={0} paddingLeft={20}>
              <HelpIcon size={20} color={colors.darkBlue30} />
            </IconButton>
          )}
        </Row>

        {allFilters.length > 1 && (
          <Row centerX paddingTop={20}>
            {allFilters.map((filter, i) => {
              const selected = filter === selectedTab
              return (
                <TouchableOpacity
                  key={i}
                  backgroundColor={selected ? colors.darkBlue60 : colors.transparent}
                  paddingHorizontal={12}
                  paddingVertical={6}
                  borderRadius={20}
                  marginHorizontal={8}
                  onPress={() => toggleFilter(filter)}
                >
                  <Text variant="caption2" opacity={selected ? 1 : 0.5}>
                    {(
                      (source ? (i === 0 ? "only " : "with ") : "") + filter
                    ).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </Row>
        )}
      </View>
      <ScrollView>
        <Tooltip
          title={source ? SOURCE_TOOLTIPS[source.toUpperCase()].title : ""}
          text={source ? SOURCE_TOOLTIPS[source.toUpperCase()].text : ""}
          order={1}
          name="nutrition-journal-source"
        >
          <View flex={1} paddingBottom={20} paddingTop={8} paddingHorizontal={20}>
            {filteredFood.map((food, i) => {
              const isSelected = selectedFood.map(f => f.id).includes(food.id)
              const displayPortion = isSelected
                ? selectedFood.find(f => f.id === food.id).portions
                : 1

              return (
                <Row key={i} centerY spread>
                  <Row centerY>
                    <TouchableOpacity
                      paddingVertical={8}
                      paddingRight={6}
                      onPress={() =>
                        basketMode ? toggleSelectedFoodList(food) : onNavigateToFood(food)
                      }
                    >
                      <View
                        width={48}
                        height={48}
                        borderRadius={24}
                        backgroundColor={colors.white10}
                      >
                        <FoodImage food={food} />
                        {isSelected && (
                          <View
                            position="absolute"
                            width={48}
                            height={48}
                            borderRadius={24}
                            backgroundColor={colors.darkBlue70_40}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <CheckIcon />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onNavigateToFood(food)} flex={1}>
                      <Row spread centerY flex={1}>
                        <View justifyContent="center">
                          <Text variant="body2">{food.name}</Text>
                          {!source && !!food.sources && food.sources.length > 1 && (
                            <Text variant="caption2" color={colors.white50}>
                              {food.sources.map(s => titleCase(s)).join(" + ")}
                            </Text>
                          )}
                        </View>
                        <Row centerY>
                          {isSelected && (
                            <Text variant="caption1" paddingRight={4}>
                              {numeral(displayPortion).format("0.[00]")}{" "}
                              {displayPortion === 1 ? "portion" : "portions"}
                            </Text>
                          )}
                          <ChevronRightIcon size={20} color={colors.darkBlue40} />
                        </Row>
                      </Row>
                    </TouchableOpacity>
                  </Row>
                </Row>
              )
            })}
          </View>
        </Tooltip>
      </ScrollView>
      <View
        paddingHorizontal={20}
        paddingBottom={20}
        paddingTop={10}
        backgroundColor={colors.darkBlue80}
        elevation={15}
        shadowOpacity={0.4}
        shadowColor={colors.black}
        shadowOffset={{ width: 0, height: 0 }}
        shadowRadius={20}
      >
        <PrimaryButton label="DONE" onPress={onDonePress} />
      </View>
    </ModalScreen>
  )
}

const FoodImage = withState("isLoading", "setIsLoading", false)(
  ({ food, isLoading, setIsLoading }) => {
    return food.pic ? (
      <View flex={1}>
        <Image
          position="absolute"
          source={{ uri: food.pic, cache: "only-if-cached" }}
          width={48}
          height={48}
          borderRadius={24}
          onLoadEnd={() => setIsLoading(false)}
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
        />
        {isLoading && (
          <View flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator />
          </View>
        )}
      </View>
    ) : null
  }
)

const fuseOptions = {
  caseSensitive: false,
  shouldSort: true,
  threshold: 0.2,
  minMatchCharLength: 2,
  findAllMatches: true,
  keys: ["name"],
  tokenize: true
}

const searchFood = (items, term) => {
  const fuse = new Fuse(items, fuseOptions)
  return fuse.search(term)
}

const enhance = compose(
  withNavigation,
  withTooltip,
  withFoodDictionary,
  withLoader({
    message: "Loading Food...",
    dataKeys: ["FoodDictionary"]
  }),
  withState("term", "setTerm", ""),
  withState("selectedTab", "setTab", ({ source }) => (source ? source : SOURCES[0])),
  withState("selectedFilters", "setSelectedFilters", ({ source }) =>
    source ? [source.toUpperCase()] : [SOURCES[0].toUpperCase()]
  ),
  withState("selectedFood", "setSelectedFood", ({ mealFood }) => mealFood),
  withProps(({ foodDictionary }) => ({ sources: _.sortBy("name", foodDictionary) })),
  withProps(({ source, selectedFilters, sources }) => {
    if (source) {
      const onlyWithSource = sources.filter(s => s.sources.includes(source))
      const filteredFood = onlyWithSource.filter(
        s =>
          s.sources.length === selectedFilters.length &&
          _.intersection(s.sources, selectedFilters).length === selectedFilters.length
      )
      const allFilters = _.uniq(
        _.flatten([source, ...onlyWithSource.map(s => s.sources)])
      )
      return { allFilters, filteredFood }
    } else {
      return {
        allFilters: SOURCES,
        filteredFood: sources.filter(s => s.sources.includes(selectedFilters[0]))
      }
    }
  }),
  withProps(({ term, filteredFood }) => ({
    filteredFood: term ? searchFood(filteredFood, term) : filteredFood
  })),
  withHandlers({
    upsertSelectedFood: ({
      setSelectedFood,
      setMealFood,
      selectedFood,
      sources,
      navigation,
      basketMode
    }) => (id, portions) => {
      const newSelectedFood = selectedFood.map(f => f.id).includes(id)
        ? selectedFood.map(f => (f.id === id ? { ...f, portions } : f))
        : [...selectedFood, { ...sources.find(s => s.id === id), portions }]

      setSelectedFood(newSelectedFood)
      setMealFood(newSelectedFood)
      if (!basketMode) {
        navigation.goBack()
      }
    },
    toggleFilter: ({ setSelectedFilters, setTab, source }) => filter => {
      setSelectedFilters(_.uniq(source ? [source, filter] : [filter]))
      setTab(filter)
    },
    deleteFood: ({ setSelectedFood, selectedFood, setMealFood }) => id => {
      const newSelectedFood = selectedFood.filter(f => f.id !== id)
      setSelectedFood(newSelectedFood)
      setMealFood(newSelectedFood)
    }
  }),
  withHandlers({
    onNavigateToFood: ({
      navigation,
      upsertSelectedFood,
      mealTitle,
      selectedFood
    }) => food => {
      const foundFood = selectedFood.find(f => f.id === food.id)

      navigation.navigate(homeRoutes.NutritionJournalPortion, {
        food,
        portions: foundFood ? foundFood.portions : 1,
        upsertSelectedFood,
        mealTitle
      })
    },
    toggleSelectedFoodList: ({ upsertSelectedFood, selectedFood, deleteFood }) => food =>
      selectedFood.find(f => f.id === food.id)
        ? deleteFood(food.id)
        : upsertSelectedFood(food.id, 1),
    onDonePress: ({ navigation }) => () => navigation.goBack()
  })
)

export default enhance(JournalSource)
