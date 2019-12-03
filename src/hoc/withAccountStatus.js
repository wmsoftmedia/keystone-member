import { branch, defaultProps, withProps } from "recompose"
import gql from "graphql-tag"
import { graphql } from "@apollo/react-hoc"
import { compose } from "recompose"
import React from "react"

import { withLoader } from "hoc"
import Splash from "components/Splash"
import _ from "lodash/fp"

const ACCOUNT_STATUS = gql`
  query AccountStatus {
    currentMember {
      id
      firstName
      accountStatus
    }
  }
`

const withData = graphql(ACCOUNT_STATUS, {
  options: ({ options }) => ({
    fetchPolicy: options.fetchPolicy,
    pollInterval: options.pollInterval,
    variables: { __offline__: true },
    notifyOnNetworkStatusChange: true
  })
})

const DEFAULT_STATUS = "ACTIVE"
const VALID_STATUSES = ["ACTIVE", "SUSPENDED"]

const withAccountStatus = compose(
  defaultProps({
    options: {
      fetchPolicy: "network-only",
      pollInterval: 0
    }
  }),
  withData,
  withProps(props => {
    const accountStatus = _.getOr(
      DEFAULT_STATUS,
      "data.currentMember.accountStatus",
      props
    )
    const isAccountActive = VALID_STATUSES.includes(accountStatus)
    return { accountStatus, isAccountActive }
  })
)

export default withAccountStatus

export const WithStatus = compose(
  defaultProps({ withLoader: true }),
  withAccountStatus,
  branch(
    p => p.withLoader,
    withLoader({
      renderLoader: () => <Splash message="Checking your account" />
    })
  )
)(props => {
  const { accountStatus: status, isAccountActive, children } = props
  return children({ isAccountActive, status })
})
