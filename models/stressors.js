const mongoose = require('mongoose')
const stressModel = new mongoose.Schema({
  owner_id: String,
  owner_name: String,
  records:[{
    situation: String,
    level: String,
    response: String,
    postResponse: String,
    displayDate: String,

    date: {
      type: Date,
      default: new Date()
    }
  }]
})

exports.stressModel = mongoose.model('stressors', stressModel)