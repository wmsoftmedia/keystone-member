import { StatusBar, UIManager } from "react-native";
import moment from "moment-timezone";

import { ScreenOrientation } from "expo";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";

import { isAndroid } from "native";

const SCREEN_ORIENTATION = ScreenOrientation.Orientation.PORTRAIT_UP;
const SENTRY_DSN = "https://f48fd1c9bff544ffa7d24c6e2f868bc2@sentry.io/272195";

// const analytics = new Analytics("UA-118083645-1")

// @ts-ignore
export const trackEvent = (category: any, action: any, label: any, value: any) => null;
// analytics.event(new Event(category, action, label, value)).catch(e => null)

const setupAndroid = () => {
  if (isAndroid) {
    console.log("---> Setting up Android...");
    try {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(false);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const setTimezone = () => {
  const tz = moment.tz.guess() || "Australia/Melbourne";
  console.log("---> Using timezone: ", tz);
  moment.tz.setDefault(tz);
  console.log("---> Timezone set: ", moment().format());
};

const configSentry = () => {
  console.log("---> Configuring Sentry...");
  Sentry.init({ dsn: SENTRY_DSN });
  if (Constants.manifest.revisionId) {
    Sentry.setRelease(Constants.manifest.revisionId);
  }
};

const setScreenOrientation = () => {
  ScreenOrientation.lockAsync(SCREEN_ORIENTATION);
  console.log("---> Screen orientation set:", SCREEN_ORIENTATION);
};

export const initializeApplication = () => {
  console.log("===> Initializing...");
  setTimezone();
  setScreenOrientation();
  configSentry();
  setupAndroid();
  StatusBar.setBarStyle("light-content");
  console.log("===> Done!");
};
