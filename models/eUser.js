var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var eUser = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    organization: String,
    designation: String,
    password: String
});

module.exports.eUser = mongoose.model('eUsers', eUser);