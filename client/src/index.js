import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { persistCache } from "apollo-cache-persist";

const cache = new InMemoryCache();
persistCache({
  cache,
  storage: localStorage,
});

const client = new ApolloClient({
  cache,
  uri: "http://localhost:4000/graphql",
  request: (operation) => {
    operation.setContext((context) => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem("token"),
      },
    }));
  },
});

if (localStorage["apollo-cache-persist"]) {
  let cacheData = JSON.parse(localStorage["apollo-cache-persist"]);
  cache.restore(cacheData);
  console.log(cacheData);
}

// const query = gql`
//   {
//     totalUsers
//     totalPhotos
//   }
// `;

// client
//   .query({ query })
//   .then(({ data }) => console.log("data", data))
//   .catch(console.error);

// client.extract();
// console.log("cache", client.extract());

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
