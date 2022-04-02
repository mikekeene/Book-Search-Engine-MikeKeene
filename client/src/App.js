import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import ApolloProvider to be cable to create the Apollo Provider
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//TODO: Create an Apollo Provider to make every request work with Apollo server
const httpLink = createHttpLink({
  uri: '/graphql' //establishing connection to server's /graphql endpoint
});
// only need 2nd parameter, so use '_' as placeholder 
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return{
    header: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
// set up Apollo Client
const client = new ApolloClient({
  // concat method to combine authLink & httpLink objects 
  link: authLink.concat(httpLink),
  // starts new cache object
  cache: new InMemoryCache()
});

function App() {
  return (
    // add so entire app can interact with Apollo Client
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
