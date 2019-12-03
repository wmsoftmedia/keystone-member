import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import dayFragments from "graphql/fragment/food/day"
import { compose, withProps } from "recompose"
import { getOr } from "keystone"
import { dataToDay } from "keystone/food"

export const GET_DAY_QUERY = gql`
  query GetDayById($id: Uuid!) {
    nutritionDayById(id: $id) {
      ...DayFull
    }
  }
  ${dayFragments.fullDay}
`

const query = graphql(GET_DAY_QUERY, {
  options: ({ dayId }) => ({
    fetchPolicy: "network-only",
    variables: { id: dayId }
  })
})

export const GetDayByIdQuery = id => ({
  query: GET_DAY_QUERY,
  fetchPolicy: "network-only",
  variables: { id }
})

export const GetDayByIdTransformed = compose(
  query,
  withProps(props => ({
    day: dataToDay(getOr({}, "data.nutritionDayById", props))
  }))
)
export default graphql(GET_DAY_QUERY, {
  options: ({ dayId }) => ({
    fetchPolicy: "network-only",
    variables: { id: dayId }
  })
})
