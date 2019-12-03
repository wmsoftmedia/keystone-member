import { WebView } from "react-native-webview"
import React from "react"

import { H5 } from "components/Typography"
import { TOKEN_KEY } from "auth"
import { getNavigationParam } from "keystone"
import ActivityIndicator from "components/ActivityIndicator"
import { ModalScreen } from "components/Background"
import CenterView from "components/CenterView"
import { Row } from "kui/components"
import colors from "colors"
import withAuthToken from "hoc/withAuthToken"

const defaultUri = "https://app.keystone.fit/insights"

const renderLoading = () => (
  <CenterView>
    <Row centerY>
      <ActivityIndicator animating color={colors.white} />
      <H5 color={colors.white}>Connecting...</H5>
    </Row>
  </CenterView>
)

const renderError = () => (
  <CenterView>
    <H5 color={colors.white}>Unable to connect.</H5>
    <H5 color={colors.white50}>Please, try again later...</H5>
  </CenterView>
)

const ReportScreen = props => {
  const uri = getNavigationParam(props.navigation, "uri") || defaultUri

  const setAuthToken = `
    const token = localStorage.getItem("${TOKEN_KEY}");
    localStorage.setItem("${TOKEN_KEY}", "${props.authToken}");
    if (!token) {
      setTimeout(() => {
        window.location.href = "${uri}";
      }, 750);
    }`

  return (
    <ModalScreen paddingTop={20}>
      <WebView
        style={{ backgroundColor: colors.blue9 }}
        source={{ uri }}
        startInLoadingState
        javaScriptEnabled={true}
        injectedJavaScript={setAuthToken}
        renderLoading={renderLoading}
        renderError={renderError}
      />
    </ModalScreen>
  )
}

export default withAuthToken(ReportScreen)
