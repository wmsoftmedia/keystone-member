import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import foodFragments from "graphql/fragment/food/food"

export const SEARCH_BY_EXTERNAL_IDS = gql`
  query searchByExternalIds($ids: [String]!) {
    foodByExternalIds(ids: $ids, provider: FS) {
      nodes {
        ...FoodFull
      }
    }
  }
  ${foodFragments.fullFood}
`

export const searchByExternalIds = ids => ({
  query: SEARCH_BY_EXTERNAL_IDS,
  fetchPolicy: "cache-first",
  variables: { ids }
})

export default graphql(SEARCH_BY_EXTERNAL_IDS, {
  name: "foodByExternalIds",
  options: props => ({
    fetchPolicy: "cache-first",
    variables: { __offline__: true, ids: props.foodIds },
    notifyOnNetworkStatusChange: true
  })
})
