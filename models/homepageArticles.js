const mongoose = require('mongoose')
const hpArticles =  mongoose.Schema({
  materials: [String],
  resources: [String],
  tests: [String]
})

module.exports.hpArticles = mongoose.model('hp-articles', hpArticles)