const mongoose = require('mongoose')

const test = mongoose.Schema({
    title: String,
    thumbnail: String,
    ageRange: String,
    category: String,
    about: String,
    maxScore: String,
    minScore: String,
    stages: [{
        name: String,
        score: String
    }],
    questionSet: [{
        question: String,
        scale: {
            type: String,
            default: 1
        },
        inputType: String,
        ranger: {
            min: {
                type: String,
                default: 1
            },
            max: {
                type: String,
                default: 100
            }
        },
        Options: [{
            option: String,
            scale: {
                type: String,
                default: 1
            }
        }]
    }]
})

const testModel = module.exports = mongoose.model('assessmentTests', test)