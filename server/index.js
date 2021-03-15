const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const { readFileSync } = require("fs");
const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

async function start() {
  var app = express();

  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
  console.log("url :>> ", url);
  const client = await MongoClient.connect(url, { useNewUrlParser: true });

  const db = client.db();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      console.log("githubToken :>> ", githubToken);
      const currentUser = await db.collection("users").findOne({ githubToken });
      return { db, currentUser };
    },
  });

  server.applyMiddleware({ app });

  app.get("/", (req, res) => {
    let url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user`;
    res.end(`<a href="${url}">Sign In with Github</a>`);
  });
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
  app.listen({ port: 4000 }, () =>
    console.log(
      `GraphQL Server running at
    http://localhost:4000${server.graphqlPath}`
    )
  );
}

start();
