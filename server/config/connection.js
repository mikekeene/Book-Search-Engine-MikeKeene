const mongoose = require('mongoose');
//dotenv to use .env file
require('dotenv').config();

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/book-search-engine-mikekeene',
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);

module.exports = mongoose.connection;
