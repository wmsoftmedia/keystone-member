import React, { Component } from "react";
import { SafeAreaView, SafeAreaViewProps } from "react-navigation";
import { Subject } from "rxjs";
import { Text, TextInput } from "glamorous-native";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { AppLoading } from "expo";
import * as Font from "expo-font";
import * as Sentry from "sentry-expo";
import { Ionicons } from "@expo/vector-icons";

import kui from "kui";
import fonts from "kui/fonts";
import { gradients } from "kui/colors";

import configureStore from "configureStore";
import { getMemberId, isSignedIn } from "auth";
import { initializeApplication } from "init";
import ApolloContainer from "ApolloContainer";
// @ts-ignore
import AppNavigator from "navigation/AppNavigator";

type IState = typeof initialState;

initializeApplication();

const safeAreaConfig: SafeAreaViewProps = {
  style: { flex: 1, backgroundColor: gradients.bg1[1] },
  forceInset: { top: "never", bottom: "never" },
};

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      ...Ionicons.font,
      ...kui.loadFonts(),
    }),
  ]);
  Text.defaultProps = {
    allowFontScaling: false,
    fontFamily: fonts.montserrat,
  };
  TextInput.defaultProps = {
    allowFontScaling: false,
    fontFamily: fonts.montserrat,
  };
}

function handleLoadingError(error: Error) {
  console.warn(error);
  Sentry.captureException(new Error(`Loading error. ${error}`));
}

const initialState = Object.freeze({
  isLoggedIn: false,
  loaded: false,
  fontLoaded: false,
});

export default class extends Component<{}, IState, any> {
  readonly state = initialState;
  private authFailurePublisher: Subject<number> | null = null;
  private store: any = null;

  constructor(props: {}) {
    super(props);

    this.store = configureStore();

    isSignedIn()
      .then((result) => {
        this.authFailurePublisher = new Subject();
        this.setState({ loaded: true, isLoggedIn: result });
        getMemberId().then((userId) => {
          if (userId) {
            Sentry.configureScope((scope) => {
              scope.setUser({ id: userId });
            });
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });

    loadResourcesAsync()
      .then(() => this.setState({ fontLoaded: true }))
      .catch((e) => {
        console.error(e);
      });
  }

  render() {
    const { fontLoaded, loaded, isLoggedIn } = this.state;

    if (!loaded || !fontLoaded) {
      return <AppLoading onError={handleLoadingError} />;
    }

    return (
      <ReduxProvider store={this.store.store}>
        <PersistGate loading={null} persistor={this.store.persistor}>
          <ApolloContainer onAuthFailure={this.onAuthFailure}>
            <SafeAreaView {...safeAreaConfig}>
              <AppNavigator
                authFailurePublisher={this.authFailurePublisher}
                isSignedIn={isLoggedIn}
              />
            </SafeAreaView>
          </ApolloContainer>
        </PersistGate>
      </ReduxProvider>
    );
  }

  private onAuthFailure = (status: number) => {
    if (this.authFailurePublisher) {
      this.authFailurePublisher.next(status);
    }
  };
}
