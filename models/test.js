const mongoose = require('mongoose')

const test = mongoose.Schema({
    title: String,
    thumbnail: String,
    ageRange: String,
    category: String,
    about: String,
    questionSet: [{
        question: String,
        scale: String,
        inputType: String,
        ranger: {
            min: String,
            max: String
        },
        Options: [{
            option: String,
            scale: String
        }]
    }]
})

const testModel = module.exports = mongoose.model('assessmentTests', test)