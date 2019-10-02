var mongoose = require('mongoose');

// Notifications Schema
var NotifSchema = mongoose.Schema({
  post_id: {
    type: String
  },
  post_title: {
    type: String
  },
  sender_id: {
    type: String
  },
  sender_username: {
    type: String
  },
  receiver_id: {
    type: String
  },
  type: {
    type: String
  },
  date: {
    type: String
  }
});

var Notification = module.exports = mongoose.model('Notification', NotifSchema);