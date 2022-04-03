//TODO: Define query & mutation functionality to work with Mongoose models
// import mongoose models
const { User } = require('../models');
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

    //Mutations: loginUser, createUser, saveBook, deleteBook (functions API.js & user-controller.js)
    Mutation: {
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
        // fx for adding user 
        addUser: async( parent, args) => {
            // mongoose User model creates a new user w/ what is passed in args
            const user = await User.create(args);
            // token
            const token = signToken(user);
            //return obj combining token with user's data
            return { token, user };
        },
        //function to save book (bookData from API.js)
        saveBook: async( parent, { body }, context) => {
            if (context.user) {
                // updatedUser fx from user-controller.js
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: body }},
                    { new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to login in first!");
        },
        //removeBook & bookId via typeDefs
        removeBook: async( parent, { bookId }, context) => {
            if(context.user) {
                // deleteBook fx from user-controllers.js
                const deleteBook = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $pull: { savedBooks: { bookId: bookId }}},
                    { new: true }
                );
                // Book is part of User model
                return updatedUser;
            }
        }
    }
};

module.exports = resolvers;