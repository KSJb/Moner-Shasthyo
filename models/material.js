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
    activities: {
        type: [{
            title: String,
            body: String
        }],
        default: []
    },
    category: {
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
    tags: [{
        type: String
    }]
});

var material = module.exports = mongoose.model('material', PostSchema);