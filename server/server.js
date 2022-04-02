//TODO: Implement Apollo Server & apply it to Express server as middleware
const express = require('express');
// implement apollo server:
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
// import schemas
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const mikeServer = new ApolloServer({
  typeDefs,
  resolvers
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
