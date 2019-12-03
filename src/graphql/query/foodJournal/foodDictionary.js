import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import _ from "lodash/fp"

export const FOOD_DICTIONARY = gql`
  query FoodDictionary {
    allFoodJournalFood {
      totalCount
      nodes {
        id
        name
        description
        pic
        sources
      }
    }
  }
`

const query = graphql(FOOD_DICTIONARY, {
  name: "FoodDictionary",
  fetchPolicy: "cache-and-network",
  variables: { __offline__: true }
})

const foodDictionary = compose(
  query,
  withProps(props => ({
    foodDictionary: _.getOr([], "FoodDictionary.allFoodJournalFood.nodes", props)
  }))
)

export default foodDictionary
