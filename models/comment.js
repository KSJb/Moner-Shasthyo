var mongoose = require('mongoose');

// Comment Schema
var CommentSchema = mongoose.Schema({
  myPostID: {
    type: String
  },
  body: {
    type: String
  },
  date: {
    type: String
  }
});

var Comment = module.exports = mongoose.model('Comment', CommentSchema);