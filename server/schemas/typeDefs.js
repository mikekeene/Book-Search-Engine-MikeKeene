//TODO: typeDefs.js: Define necessary Query & Mutation types
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Book type: bookId, authors, description, title, image, link, 
    type Book {
        authors: [String]
        description: String
        bookId: String!
        image: String
        link: String
        title: String!
    }
    # User type: _id, username, email, bookCount, savedBooks(array of the Book type)
    type User {
        _id: ID
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    # Auth type: token, user (references the User type)
    type Auth {
        token: ID!
        user: User
    }
    # Query type: me - which returns a User type
    type Query {
        me: User
    }
    # saveBookInput for easier mutation readability 
    input SavedBookInput {
        authors: [String]
        title: String
        description: String
        bookId: String
        image: String
        link: String
    }
    # ================== mutations ===================
    # mutation type
    type Mutation {
        # login: Accepts an email & password as parameters; returns an Auth type.
        login(email: String!, password: String!): Auth
        # Accepts a username, email, & password as parameters; returns an Auth type
        addUser(username: String!, email: String!, password: String!): Auth
        # saveBook: returns a User type.
        saveBook(input: SavedBookInput): User
        # removeBook: Accepts a book's bookId as a parameter; returns a User type.
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;
