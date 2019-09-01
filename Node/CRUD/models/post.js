var mongoose = require('mongoose');

// Post Schema
var PostSchema = mongoose.Schema({
  title: {
    type: String
  },
  body: {
    type: String
  },
  date: {
    type: String
  }
});

var Post = module.exports = mongoose.model('Post', PostSchema);