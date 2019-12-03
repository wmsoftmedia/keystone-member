import { AsyncStorage } from "react-native";
import * as Sentry from "sentry-expo";
import _ from "lodash/fp";

import { UAC_HOST } from "../env";

export const TOKEN_KEY = "auth-token";
export const MEMBER_ID = "member-id";
export const DEVICE_ID = "device-id";
export const PERMISSION_NOTIFICATION = "permission-notification";

export const authenticate = (username: string, password: string) => {
  return fetch(UAC_HOST + "/signin", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      service: "app",
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      Sentry.captureException(new Error(`Authenticate error, ${_.toString(error)}`));
      return { message: "Network error", status: "error" };
    });
};

export const forgotPassword = (username: string) => {
  return fetch(UAC_HOST + "/forgot_password", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  })
    .then((response) => response.json())
    .catch((error) => {
      Sentry.captureException(new Error(`Forgot password error, ${_.toString(error)}`));
      return { message: "Network error", status: "error" };
    });
};

export const onSignIn = (token: string, memberId: string) =>
  AsyncStorage.multiSet([[TOKEN_KEY, token], [MEMBER_ID, memberId.toString()]], (e) =>
    e ? console.error("Error setting keys", e) : null,
  );

export const onSignOut = () => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(TOKEN_KEY)
      .then(resolve)
      .catch((err) => reject(err));
  });
};

export const getMemberId = () => AsyncStorage.getItem(MEMBER_ID);

export const isSignedIn = (): Promise<boolean> => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then((res) => resolve(res !== null))
      .catch(reject);
  });
};

export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
