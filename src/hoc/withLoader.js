import { ActivityIndicator } from "react-native"
import React from "react"

import { H5 } from "components/Typography"
import { getOr } from "keystone"
import CenterView from "components/CenterView"
import colors from "kui/colors"

const defaultConfig = {
  color: colors.white,
  backgroundColor: "transparent",
  indicatorSize: "small",
  message: "Loading...",
  containerProps: {}
}

export const withLoader = config => Component => {
  const cfg = { ...defaultConfig, ...config }
  const {
    color,
    backgroundColor,
    indicatorSize,
    message,
    containerProps,
    renderLoader = null,
    dataKeys = ["data"],
    loaderProp = null
  } = cfg

  return (
    // eslint-disable-next-line react/display-name
    class extends React.Component {
      render() {
        const isAnyLoading = loaderProp
          ? this.props[loaderProp]
          : dataKeys.some(key => getOr(false, `${key}.loading`, this.props))
        if (isAnyLoading) {
          if (renderLoader) {
            return renderLoader()
          }

          return (
            <CenterView backgroundColor={backgroundColor} {...containerProps}>
              <ActivityIndicator animating size={indicatorSize} color={color} />
              {message && (
                <H5 color={color} paddingTop={5}>
                  {message}
                </H5>
              )}
            </CenterView>
          )
        }

        return <Component {...this.props} />
      }
    }
  )
}
