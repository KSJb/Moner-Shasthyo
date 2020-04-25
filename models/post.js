var mongoose = require('mongoose');

// Post Schema
var PostSchema = mongoose.Schema({
    title: {
        type: String
    },
    thumbnail: {
        type: String
    },
    body: {
        type: String
    },
    type: {
        type: String
    },
    author: {
        type: String
    },
    author_id: {
        type: String
    },
    author_username: {
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
    },
    tags: [{
        type: String
    }]
});

var Post = module.exports = mongoose.model('Post', PostSchema);