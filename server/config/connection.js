const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/book-search-engine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //needed for mongoose 5
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
