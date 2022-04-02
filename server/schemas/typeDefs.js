//TODO: typeDefs.js: Define necessary Query & Mutation types
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Query type: me - which returns a User type
    type Query {
        me: User
    }
    # mutation type
    type Mutation {
        # login: Accepts an email and password as parameters; returns an Auth type.
        login(
            email: String!
            password: String!
        ): Auth
        # Accepts a username, email, and password as parameters; returns an Auth type
        addUser(
            username: String!
            email: String!
            password: String!
        ): Auth
        # saveBook: Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type.
        saveBook(
            authors: [String]
            description: String
            title: String
            bookId: String!
            image: String
            link: String
        ): User
        # removeBook: Accepts a book's bookId as a parameter; returns a User type.
        removeBook(
            bookId: String! 
        ): User
    }
    # User type: _id, username, email, bookCount, savedBooks(array of the Book type)
    type User {
        _id: ID!
        username: String!
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    # Book type: bookId, authors, description, title, image, link, 
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }
    # Auth type: token, user (references the User type)
    type Auth {
        token: ID!
        user: User
    }
`;

module.exports = typeDefs;
