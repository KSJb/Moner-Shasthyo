var mongoose = require('mongoose');

// Comment Schema
var CommentSchema = mongoose.Schema({
  myPostID: {
    type: String
  },
  commentedBy: {
    type: String
  },
  commentedBy_Username: {
    type: String
  },
  body: {
    type: String
  },
  date: {
    type: String
  },
  mentionedUsers: [{
    type: String
  }]
});

var Comment = module.exports = mongoose.model('Comment', CommentSchema);