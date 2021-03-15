import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import { persistCache } from "apollo-cache-persist";
import {
  InMemoryCache,
  HttpLink,
  ApolloLink,
  ApolloClient,
  split,
} from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const cache = new InMemoryCache();
persistCache({
  cache,
  storage: localStorage,
});

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true },
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((context) => ({
    headers: {
      ...context.headers,
      authorization: localStorage.getItem("token"),
    },
  }));
  return forward(operation);
});

const httpAuthLink = authLink.concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpAuthLink
);

if (localStorage["apollo-cache-persist"]) {
  let cacheData = JSON.parse(localStorage["apollo-cache-persist"]);
  cache.restore(cacheData);
  console.log(cacheData);
}

const client = new ApolloClient({ cache, link });

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
