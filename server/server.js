//TODO: Implement Apollo Server & apply it to Express server as middleware
const express = require('express');
const http = require('http');
// implement apollo server:
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
// import authMiddleware:
const { authMiddleware } = require('./utils/auth');
const path = require('path');
// import schemas
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');


const myApolloServer = async() => {
  const app = express();
  const PORT = process.env.PORT || 3001;
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  await server.start();
  // apply apollo server to express server as middleware:
  server.applyMiddleware({ app });
  console.log(`GraphQL running at http://localhost:${PORT}${server.graphqlPath}`);
  
  await new Promise(resolve => httpServer.listen({port: process.env.PORT || 3001 }, resolve));
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  // if in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  
  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })
};
myApolloServer();

