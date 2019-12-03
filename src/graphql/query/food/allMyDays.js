import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { compose, withProps } from "recompose"
import dayFragments from "graphql/fragment/food/day"
import { getOr } from "keystone"
import { dataToDay } from "keystone/food"

export const ALL_MY_DAYS_QUERY = gql`
  query AllMyDays {
    currentMember {
      id
      nutritionDaysByMemberId(orderBy: UPDATED_AT_DESC) {
        nodes {
          ...DayFull
        }
      }
    }
  }
  ${dayFragments.fullDay}
`

export const ALL_MY_DAYS_MIN_QUERY = gql`
  query AllMyDays {
    currentMember {
      id
      nutritionDaysByMemberId(orderBy: UPDATED_AT_DESC) {
        nodes {
          ...DayMin
        }
      }
    }
  }
  ${dayFragments.minDay}
`

const transformedQuery = query =>
  compose(
    query,
    withProps(props => ({
      allMyDays: getOr(
        [],
        "AllMyDays.currentMember.nutritionDaysByMemberId.nodes",
        props
      ).map(dataToDay)
    }))
  )

const AllMyDaysMinQuery = graphql(ALL_MY_DAYS_MIN_QUERY, {
  name: "AllMyDays",
  fetchPolicy: "network-only",
  variables: { __offline__: true }
})

const AllMyDaysQuery = graphql(ALL_MY_DAYS_QUERY, {
  name: "AllMyDays",
  fetchPolicy: "network-only",
  variables: { __offline__: true }
})

export const AllMyMinDaysTransformed = transformedQuery(AllMyDaysMinQuery)
export const AllMyDaysTransformed = transformedQuery(AllMyDaysQuery)

export default AllMyDaysQuery
