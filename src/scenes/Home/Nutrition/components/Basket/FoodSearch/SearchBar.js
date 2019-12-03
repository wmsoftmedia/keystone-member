import { Alert } from "react-native"
import { compose, withHandlers, withProps } from "recompose"
import { withNavigation } from "react-navigation"

import { getOr } from "keystone"
import { isIOS } from "native"
import { trackEvent } from "init"
import ScannerButton from "scenes/Home/Nutrition/components/Button/ScannerButton"
import SearchBar from "components/FoodList/SearchBar"
import withFeatures from "graphql/query/member/features"

const onNetworkError = onPress =>
  Alert.alert(
    "Oh, Snap... \uD83D\uDD27",
    `Food search is currently unavailable. Please, try again later.`,
    [{ text: "Ok", onPress }],
    { cancelable: true, onDismiss: onPress }
  )

const onFoodNotFound = (
  goBack,
  onPressMacros,
  onPressCancel,
  onPressBarcodeSubmit,
  barcode,
  hasBarcodeSubmitFeature
) => {
  const options = [
    { text: "Search Food", onPress: goBack },
    { text: "Create Food", onPress: onPressMacros }
  ]

  const extendedOptions = hasBarcodeSubmitFeature
    ? options.concat({
        text: "Add To Keystone",
        onPress: onPressBarcodeSubmit
      })
    : options

  const iOSOptions = [{ text: "Try Again", onPress: onPressCancel }]

  const androidOptions = []

  Alert.alert(
    "Food Not Found \uD83D\uDE48",
    `We're unable to find food matching this barcode: '${barcode}'.`,
    extendedOptions.concat(isIOS ? iOSOptions : androidOptions),
    { cancelable: false }
  )
}

const enhanceSearchBar = compose(
  withFeatures,
  withNavigation,
  withHandlers({
    openFoodScanner: props => () => {
      const { navigation } = props
      const hasBarcodeSubmitFeature =
        getOr([], "data.member.features.nodes", props).filter(
          f => f.name === "member_app_barcode_submit"
        ).length > 0
      const onSubmit = props.addFood
      const goBack = () => navigation.pop()
      navigation.navigate({
        routeName: "FoodScanner",
        key: "FoodScanner",
        params: {
          // !!! WARNING: Callback hell. Call done() to let barcode scanner know that we're
          // ready to scan again. This will probably be solved with streams or redux middleware
          // in future (once we have the architecture in place). Sorry future us.
          onSearchComplete: () => entry => {
            compose(
              goBack,
              onSubmit
            )(entry)
          },
          onSearchError: (done, barcode) => e => {
            const isNetworkError = e.message.toLowerCase().indexOf("network error") >= 0
            if (isNetworkError) {
              onNetworkError(isIOS ? done : goBack)
            } else {
              const goToMacrosEntry = () => {
                goBack()
                navigation.navigate({
                  routeName: "KitchenFood",
                  key: "KitchenFood"
                })
              }
              const goToBarcodeSubmit = () => {
                goBack()
                navigation.navigate({
                  routeName: "BarcodeNotFound",
                  key: "BarcodeNotFound",
                  params: { barcode }
                })
              }
              onFoodNotFound(
                goBack,
                goToMacrosEntry,
                done,
                goToBarcodeSubmit,
                barcode,
                hasBarcodeSubmitFeature
              )
            }
          }
        }
      })
      trackEvent("navigation", "open", "FoodScanner")
    }
  }),
  withProps(props => ({
    placeholder: "Search food...",
    ActionButton: ScannerButton,
    actionProps: {
      onPress: props.openFoodScanner
    }
  }))
)

export default enhanceSearchBar(SearchBar)
