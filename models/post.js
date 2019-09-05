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
  },
  view: {
    type: Number
  },
  upvote: {
    type: Number
  },
  comment: {
    type: Number
  }
});

var Post = module.exports = mongoose.model('Post', PostSchema);