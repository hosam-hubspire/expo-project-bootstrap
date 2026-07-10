import type { Operation } from "@apollo/client";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { persistCache } from "apollo3-cache-persist";
import * as SecureStore from "expo-secure-store";
import type { FragmentDefinitionNode, OperationDefinitionNode } from "graphql";
import { createClient } from "graphql-ws";

import { SESSION_STORAGE_KEY } from "@/constants/session";
import {
  APOLLO_CACHE_PERSIST_KEY,
  apolloCacheStorage,
} from "@/services/graphql/apollo-cache-storage";
import { prefetchQueries } from "@/services/graphql/prefetchQueries";

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

/** Set EXPO_PUBLIC_GRAPHQL_URL to your project GraphQL HTTP endpoint. */
export const GRAPHQL_URI = process.env.EXPO_PUBLIC_GRAPHQL_URL?.trim() ?? "";

const subscriptionsEnabled = process.env.EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED === "true";

const wsUri =
  process.env.EXPO_PUBLIC_GRAPHQL_WS_URL?.trim() ??
  (GRAPHQL_URI
    ? GRAPHQL_URI.replace(/^http:/, "ws:").replace(/^https:/, "wss:")
    : "");

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const { message } of error.errors) {
      console.log(`GraphQL error: ${message}`);
    }
    return;
  }

  console.log(`Network error: ${error.message}`);
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 1000,
    jitter: true,
  },
  attempts: {
    max: 2,
  },
});

/** Reads the session token from SecureStore — independent of React SessionProvider. */
const authLink = new SetContextLink(async (prevContext) => {
  const token = await SecureStore.getItemAsync(SESSION_STORAGE_KEY);
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

let resolvedClient: ApolloClient | null = null;
let initPromise: Promise<ApolloClient> | null = null;

async function getAuthConnectionParams() {
  const token = await SecureStore.getItemAsync(SESSION_STORAGE_KEY);
  return token ? { authorization: `Bearer ${token}` } : {};
}

function createHttpLink() {
  if (!GRAPHQL_URI) {
    throw new Error(
      "EXPO_PUBLIC_GRAPHQL_URL is not set — configure your project GraphQL endpoint.",
    );
  }

  return new HttpLink({
    uri: GRAPHQL_URI,
  });
}

function createSubscriptionLink() {
  if (!wsUri) {
    throw new Error(
      "GraphQL subscriptions require EXPO_PUBLIC_GRAPHQL_URL or EXPO_PUBLIC_GRAPHQL_WS_URL.",
    );
  }

  return new GraphQLWsLink(
    createClient({
      url: wsUri,
      connectionParams: getAuthConnectionParams,
      retryAttempts: 5,
    }),
  );
}

function createTransportLink() {
  const httpLink = createHttpLink();
  const opsLink = ApolloLink.from([authLink, errorLink, retryLink, httpLink]);

  if (!subscriptionsEnabled) {
    return opsLink;
  }

  return ApolloLink.split(
    ({ query }: Operation) => {
      const mainDefinition: OperationDefinitionNode | FragmentDefinitionNode =
        getMainDefinition(query);
      return (
        mainDefinition.kind === "OperationDefinition" && mainDefinition.operation === "subscription"
      );
    },
    createSubscriptionLink(),
    opsLink,
  );
}

async function createApolloClient(): Promise<ApolloClient> {
  const cache = new InMemoryCache();

  await persistCache({
    cache,
    storage: apolloCacheStorage,
    key: APOLLO_CACHE_PERSIST_KEY,
    debounce: 1000,
    trigger: "write",
  });

  const client = new ApolloClient({
    link: createTransportLink(),
    cache,
  });

  prefetchQueries(client);

  return client;
}

/**
 * Returns a singleton Apollo Client after restoring persisted cache from MMKV.
 * Safe to call from multiple places; initialization runs once.
 */
export async function ensureApolloClient(): Promise<ApolloClient> {
  if (resolvedClient) {
    return resolvedClient;
  }

  if (!initPromise) {
    initPromise = createApolloClient().then((client) => {
      resolvedClient = client;
      return client;
    });
  }

  return initPromise;
}

export default ensureApolloClient;
