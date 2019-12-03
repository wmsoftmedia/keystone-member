import React from "react"
import * as Sentry from "sentry-expo"

import { H5, P } from "../components/Typography"
import { getMemberId } from "../auth"
import CenterView from "../components/CenterView"
import Link from "../components/Button/Link"
import colors from "../colors"
import { compose, withProps, lifecycle, branch, renderComponent } from "recompose"
import { getOr } from "keystone"

export const logErrorWithMemberId = cb => {
  getMemberId()
    .then(memberId => {
      cb(memberId)
    })
    .catch(() => {
      cb("")
    })
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    const { error, errorInfo } = this.state
    if (errorInfo) {
      logErrorWithMemberId(memberId => {
        console.error(`MId:{${memberId}}, ${error}`)
        Sentry.captureException(
          new Error(`MId:{${memberId}}, ErrorInfo:${errorInfo}, Error:${error}`)
        )
      })

      return (
        <CenterView {...this.props}>
          <H5 color={colors.white} paddingBottom={5}>
            Something went wrong.
          </H5>
          <P color={colors.white}>Please restart the app.</P>
        </CenterView>
      )
    }

    return this.props.children
  }
}

const withErrorHandler = Component => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    render() {
      const { data } = this.props

      if (data && data.error) {
        logErrorWithMemberId(memberId => {
          const errorMessage = `MId:{${memberId}}, ${data.error}`
          console.error(errorMessage)
          Sentry.captureException(new Error(errorMessage))
        })

        return (
          <CenterView backgroundColor="transparent">
            <H5 color={colors.white}>
              We{"'"}re unable to process your request at the moment.
            </H5>
            <Link padding={10} onPress={() => data.refetch()} label="Try Again" />
          </CenterView>
        )
      }

      return (
        <ErrorBoundary>
          <Component {...this.props} />
        </ErrorBoundary>
      )
    }
  }
}

export const withErrorScene = ({ renderScene }) => Component => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    render() {
      const { data } = this.props

      if (data && data.error) {
        logErrorWithMemberId(memberId => {
          const errorMessage = `MId:{${memberId}}, ${data.error}`
          console.error(errorMessage)
          Sentry.captureException(new Error(errorMessage))
        })

        if (renderScene) {
          return renderScene()
        }

        return (
          <CenterView backgroundColor={colors.primary1}>
            <H5 color={colors.white}>
              We{"'"}re unable to process your request at the moment.
            </H5>
            <Link padding={10} onPress={() => data.refetch()} label="Try Again" />
          </CenterView>
        )
      }

      return (
        <ErrorBoundary>
          <Component {...this.props} />
        </ErrorBoundary>
      )
    }
  }
}

export const withErrorBoundary = Component => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    render() {
      return (
        <ErrorBoundary>
          <Component {...this.props} />
        </ErrorBoundary>
      )
    }
  }
}

const ErrorMessage = props => (
  <CenterView backgroundColor={props.backgroundColor}>
    <H5 color={props.textColor}>
      We{"'"}re unable to process your request at the moment.
    </H5>
    <Link
      color={props.textColor}
      padding={10}
      onPress={() => props.retryHandler(props)}
      label="Try Again"
    />
  </CenterView>
)

export const withExtendedErrorHandler = ({
  dataKeys = ["data"],
  errorProp = null,
  retryHandler = null,
  backgroundColor = "transparent",
  textColor = "black"
}) =>
  compose(
    withProps(props => ({
      isFailed: errorProp
        ? !!props[errorProp]
        : dataKeys.some(key => getOr(false, `${key}.error`, props)),
      failedKey: errorProp
        ? null
        : dataKeys.find(key => getOr(false, `${key}.error`, props))
    })),
    branch(
      props => props.isFailed,
      renderComponent(
        compose(
          withProps({
            retryHandler: errorProp
              ? retryHandler
              : retryHandler || (props => props[props.failedKey].refetch()),
            backgroundColor,
            textColor
          }),
          lifecycle({
            componentDidMount() {
              logErrorWithMemberId(memberId => {
                const errorMessage = `MId:{${memberId}}, ${
                  errorProp
                    ? this.props[errorProp]
                    : this.props[this.props.failedKey].error
                }`
                console.error(errorMessage)
                Sentry.captureException(new Error(errorMessage), sendErr => {
                  if (sendErr) {
                    console.error("Failed to send captured exception to Sentry")
                  }
                })
              })
            }
          })
        )(ErrorMessage)
      )
    ),
    withErrorBoundary
  )

export default withErrorHandler

export { ErrorBoundary }
