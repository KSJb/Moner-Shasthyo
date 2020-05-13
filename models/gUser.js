var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var gUser = mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: String,
    password: String
});

module.exports.gUser = mongoose.model('gUsers', gUser);