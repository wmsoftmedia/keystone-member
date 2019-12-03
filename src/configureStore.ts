import { applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import reduxThunk from "redux-thunk";
import { composeWithDevTools as compose } from "redux-devtools-extension";

import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import stateReconciler from "redux-persist/lib/stateReconciler/autoMergeLevel1";
import { AsyncStorage } from "react-native";

import rootEpic from "rootEpic";
// @ts-ignore
import rootReducer from "rootReducer";

const persistConfig: PersistConfig<{}> = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler,
  blacklist: ["form", "formsRoot", "app"],
};

const dependencies: { apolloClient?: any } = {};

export function addApolloDep(apollo: any) {
  dependencies.apolloClient = apollo;
}

export default () => {
  const thunkEnhancer = applyMiddleware(reduxThunk);
  const epicRunner = createEpicMiddleware({ dependencies });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    persistedReducer,
    compose(
      thunkEnhancer,
      applyMiddleware(epicRunner),
    ),
  );

  epicRunner.run(rootEpic);

  const persistor = persistStore(store);
  return { store, persistor };
};
