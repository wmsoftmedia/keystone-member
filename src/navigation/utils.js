import { ModalBackButton } from "navigation/buttons"

export const proxyNavigator = (screen, config = {}) => ({
  screen,
  navigationOptions: {
    gesturesEnabled: true,
    header: null
  },
  ...config
})

export const modalNavigationOptions = {
  gesturesEnabled: true,
  headerBackImage: ModalBackButton
}
