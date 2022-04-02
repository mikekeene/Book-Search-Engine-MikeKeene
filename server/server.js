//TODO: Implement Apollo Server & apply it to Express server as middleware
const express = require('express');
// implement apollo server:
const { ApolloServer } = require('apollo-server-express');
// import authMiddleware:
const { authMiddleware } = require('./utils/auth');
const path = require('path');
// import schemas
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const myApolloServer = async() => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // make sure each request is authenticated
    context: authMiddleware,
  });
  await server.start();
  // apply apollo server to express server as middleware:
  server.applyMiddleware({ app });
  console.log(`GraphQL running at http://localhost:${PORT}${server.graphqlPath}`);
};
myApolloServer();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/public')));
}

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
})

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Express server on localhost:${PORT}`); 
  });
});
