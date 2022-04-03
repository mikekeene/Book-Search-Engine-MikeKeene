const express = require('express');
// path required for deploying static files
const path = require('path');
// importing in mongoose/mongodb connection
const db = require('./config/connection');
//import dotenv for .env use
require('dotenv').config();
const {ApolloServer} = require('apollo-server-express');

// import schema (typeDefs + resolvers)
const {typeDefs, resolvers} = require('./schemas');
// import authentication functionality 
const {authMiddleware} = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

// creating new Apollo server and passing in schema and authenication middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
// combing apollo server with express 
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve up the files in "build" folder when in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

//once database connection is active, connect to Express/API server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});
