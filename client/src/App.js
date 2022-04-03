import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ApolloProvider to be cable to create the Apollo Provider
import {
  ApolloClient, InMemoryCache, ApolloProvider, HttpLink} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//TODO: Create an Apollo Provider to make every request work with Apollo server
const httpLink = HttpLink({
  uri: "http://localhost:3001/graphql" || "/graphql",
  fetch: fetch
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    // add so entire app can interact with Apollo Client
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={SearchBooks} />
            <Route path='/saved' element={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
        </>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
