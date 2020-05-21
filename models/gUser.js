var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var gUser = mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: String,
    password: String,
    userType: {
        type: String,
        default: 'general'
    },
    // to be filled later
    age: {
        type: String,
        default: 'Not specified'
    },
    gender: {
        type: String,
        default: 'Not specified'
    },
    maritalStatus: {
        type: String,
        default: 'Not specified'
    },
    livingArea: {
        type: String,
        default: 'Not specified'
    },
    residenceType: {
        type: String,
        default: 'Not specified'
    },
    familyType: {
        type: String,
        default: 'Not specified'
    },
    educations: {
        type: String,
        default: 'Not specified'
    },
    occupation: {
        type: String,
        default: 'Not specified'
    },
    monthlyIncome: {
        type: String,
        default: 'Not specified'
    },

    // not in web 
    familyIllness: {
        type: String,
        default: 'Not specified'
    },
    complaint: {
        type: String,
        default: 'Not specified'
    },
    childhoodDeprivation: {
        type: String,
        default: 'Not specified'
    },
    relationProblem: {
        type: String,
        default: 'Not specified'
    },
    stressfullEvent: {
        type: String,
        default: 'Not specified'
    },
    subtanceAbuse: {
        type: String,
        default: 'Not specified'
    },
    diagnosedDisorder: {
        type: String,
        default: 'Not specified'
    },
    treatmentHistory: {
        type: String,
        default: 'Not specified'
    },

    // auto update
    materialsRead: [{
        id: String,
        name: String,
        score: String,
        date: String
    }],
    testsTaken: [{
        id: String,
        name: String,
        score: String,
        date: String
    }]
});

module.exports.gUser = mongoose.model('gUsers', gUser);