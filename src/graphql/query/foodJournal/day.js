import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import _ from "lodash/fp"

export const FOOD_JOURNAL_DAY = gql`
  query FoodJournalDay($date: NaiveDate!) {
    foodJournalDayByDate(date: $date) {
      date
      target {
        id
        protein
        fat
        carbs
        vegetables
        water
      }
      journal {
        id
        date
        water
        meals {
          totalCount
          nodes {
            id
            name
            orderIndex
            food {
              totalCount
              nodes {
                portions
                food {
                  id
                  name
                  description
                  pic
                  sources
                }
              }
            }
            images {
              totalCount
              nodes {
                id
                previewLink
                originalLink
                localPath
              }
            }
          }
        }
      }
    }
  }
`

const query = graphql(FOOD_JOURNAL_DAY, {
  options: ({ date }) => ({
    name: "FoodJournalDay",
    fetchPolicy: "cache-and-network",
    variables: { __offline__: true, date }
  })
})

const initialDay = {
  target: {
    protein: 0,
    fat: 0,
    carbs: 0,
    vegetables: 0,
    water: 1000
  },
  day: {
    water: 0
  },
  meals: [
    {
      name: "Breakfast",
      orderIndex: 0,
      images: [],
      food: []
    },
    {
      name: "Lunch",
      orderIndex: 1,
      images: [],
      food: []
    },
    {
      name: "Dinner",
      orderIndex: 2,
      images: [],
      food: []
    },
    {
      name: "Snack",
      orderIndex: 3,
      images: [],
      food: []
    }
  ]
}

const foodJournalDay = compose(
  query,
  withProps(props => {
    const dayData = _.getOr({}, "data.foodJournalDayByDate", props)

    const meals = _.getOr([], "journal.meals.nodes", dayData).map(m => ({
      ...m,
      images: m.images ? m.images.nodes : [],
      food: m.food.nodes.map(f => ({ portions: f.portions, ...f.food }))
    }))

    const target = _.getOr(initialDay.target, "target", dayData) || initialDay.target

    const day = {
      target: {
        protein: target.protein || initialDay.target.protein,
        fat: target.fat || initialDay.target.fat,
        carbs: target.carbs || initialDay.target.carbs,
        vegetables: target.vegetables || initialDay.target.vegetables,
        water: target.water || initialDay.target.water
      },
      meals: _.sortBy(["orderIndex"])(_.unionBy("orderIndex")(meals)(initialDay.meals)),
      day: { water: dayData.data ? dayData.data.water : initialDay.day.water }
    }
    return { day }
  })
)

export default foodJournalDay
