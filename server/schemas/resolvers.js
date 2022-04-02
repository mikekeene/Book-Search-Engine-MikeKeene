//TODO: Define query & mutation functionality to work with Mongoose models
// import mongoose models
const { User, Book } = require('../models');
// user auth
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    //Query: executes "me"
    Query: {
        me: async(parent, args, context) => {
            //context.user exists only if user logged in
            if(context.user){
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')//don't show users' passwords
                return userData;
            }
            //if user not logged in, throw error
            throw new AuthenticationError('NOT Logged In!');
        }
    },

    //Mutations: loginUser, createUser, saveBook, deleteBook (fxs API.js & user-controller.js)
    Mutation: {
        // fx for adding user 
        addUser: async( parent, args) => {
            // mongoose User model creates a new user w/ what is passed in args
            const user = await User.create(args);
            // token
            const token = signToken(user);
            //return obj combining token with user's data
            return { token, user };
        },
        //login resolver for user entering wrong username/password
        login: async( parent, { email, password }) => {
            const user = await User.findOne({ email });
            //if no user...
            if (!user) {
                throw new AuthenticationError('Incorrect credentials')
            }
            // password
            const correctPw = await user.isCorrectPassword(password);
            // wrong password
            if (!correctPw) {
                throw new AuthenticationError(
                    'Incorrect credentials'
                );
            }
            // token assigned
            const token = signToken(user);
            //return obj combining token with user's data
            return { token, user };
        },
        //fx to save book (bookData from API.js)
        saveBook: async( parent, bookData, context) => {
            if (context.user) {
                // updatedUser fx from user-controller.js
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData }},
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
        },
        //removeBook & bookId via typeDefs
        removeBook: async( parent, { bookId }, context) => {
            if(context.user) {
                // deleteBook fx from user-controllers.js
                const deleteBook = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $pull: { savedBooks: { bookId }}},
                    { new: true, runValidators: true }
                );
                delete deleteBook;
                return deleteBook;
            }
        }
    }
};

module.exports = resolvers;