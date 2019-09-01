var mongoose = require('mongoose');

// Comment Schema
var CommentSchema = mongoose.Schema({
  body: {
    type: String
  },
  date: {
    type: String
  }
});

var Comment = module.exports = mongoose.model('Comment', CommentSchema);