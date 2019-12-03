import React, { FunctionComponent } from "react";
import { getOr } from "lodash/fp";
import moment from "moment";
import { OperationDefinitionNode } from "graphql";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, Observable, FetchResult, Operation, NextLink } from "apollo-link";
import { RetryLink } from "apollo-link-retry";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";

import Constants from "expo-constants";

import { GQL_HOST } from "../env";
import { gqlDate } from "keystone";
import { getToken, onSignOut } from "./auth";

interface IProps {
  onAuthFailure: (status: number) => void;
}

let token: string | null;

export const unauth = () => {
  token = null;
};

const dataIdFromObject = (obj: any) => {
  switch (obj.__typename) {
    case "NutritionStreakInfo":
      return obj.endDate ? obj.__typename + "__" + obj.endDate : null;
    case "MemberNutritionMetric":
      return obj.date ? obj.__typename + "__" + obj.date : null;
    case "MemberWaterMetric":
      return obj.date ? obj.__typename + "__" + obj.date : null;
    case "MemberMetric":
      return obj.date && obj.key
        ? obj.__typename + "__" + gqlDate(obj.date) + "__" + obj.key
        : null;
    case "UpsertMemberNutritionMetricPayload":
      return obj.memberNutritionMetric && obj.memberNutritionMetric.date
        ? obj.__typename + "__" + gqlDate(obj.memberNutritionMetric.date)
        : null;
    case "UpdateMemberWorkoutPayload":
      return obj.memberWorkout && obj.memberWorkout.id
        ? obj.__typename + "__" + obj.memberWorkout.id
        : null;
    case "CreateMemberWorkoutPayload":
      return obj.memberWorkout && obj.memberWorkout.id
        ? obj.__typename + "__" + obj.memberWorkout.id
        : null;
    case "MemberReservation": {
      const cid = obj.classId;
      const tid = obj.timeslotId;
      const date = gqlDate(obj.date);
      const type = obj.type;
      const key = `${obj.__typename}__${cid}__${tid}__${date}__${type}`;
      return key;
    }
    default:
      if (obj.__typename && obj.id) {
        return obj.__typename + "__" + obj.id;
      }
  }
  return null;
};

// Instantiate required constructor fields
const cache = new InMemoryCache({
  dataIdFromObject,
  // freezeResults: true,
});

class CacheSyncLink extends ApolloLink {
  private static actualTimestamps: { [key: string]: number } = {};

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    const query = operation.query.definitions[0] as OperationDefinitionNode | null;
    if (query && query.operation !== "mutation") {
      return forward(operation);
    }

    CacheSyncLink.actualTimestamps[operation.operationName] = moment().valueOf();
    const ts = CacheSyncLink.actualTimestamps[operation.operationName];

    return new Observable<FetchResult>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          if (ts < CacheSyncLink.actualTimestamps[operation.operationName]) {
            observer.error(new Error(`unsync ${operation.operationName}`));
          } else {
            observer.next(result);
          }
        },
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    });
  }
}

const ApolloContainer: FunctionComponent<IProps> = ({ children, onAuthFailure }) => {
  const authLink = setContext(async (_, { headers }) => {
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    }

    const newToken = await getToken();
    token = newToken;
    const authHeaders = token ? { authorization: `Bearer ${token}` } : {};
    return {
      headers: {
        ...headers,
        ...authHeaders,
      },
    };
  });

  const logoutLink = onError((e) => {
    const code: number | null = getOr(null, "networkError.statusCode", e);
    if (code === 401 || code === 403) {
      token = null;
      onSignOut().finally(() => onAuthFailure(code));
    }
  });

  const link = ApolloLink.from([
    new CacheSyncLink(),
    authLink,
    logoutLink,
    new RetryLink(),
    new HttpLink({ uri: GQL_HOST }),
  ]);

  const client = new ApolloClient({
    // Provide required constructor fields
    cache,
    link,

    // Provide some optional constructor fields
    name: "keystone-app",
    version: Constants.manifest.version,
    // assumeImmutableResults: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloContainer;
