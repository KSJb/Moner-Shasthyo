const mongoose = require('mongoose')
const diaryModel = new mongoose.Schema({
  owner_id: String,
  owner_name: String,
  records:[{
    situation: String,
    emotions: String,
    thoughts: String,
    reactions: String,
    behaiviour: String,
    displayDate: String,
    date: {
      type: Date,
      default: new Date()
    }
  }]
})

exports.diaryModel = mongoose.model('diary', diaryModel)