var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var eUser = mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    organization: String,
    designation: String,
    password: String,
    license: String,
    residence: {
        city: String,
        country: String
    },
    education: {
        hDegree: String,
        institute: String,
        field: String
    }
});

module.exports.eUser = mongoose.model('eUsers', eUser);