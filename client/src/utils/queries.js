// TODO: queries.js: This will hold the query GET_ME, which will execute the me query set up using Apollo Server.

//import graphQL
import gql from 'graphql-tag';

//query GET_ME (query parameters from typeDefs.js):
export const GET_ME = gql` 
    {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;