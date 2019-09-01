const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    name:{
        type: String,
        required: True
    },

    email:{
        type: String,
        required: True
    },

    password:{
        type: String,
        required: True
    },

    date:{
        type: String,
        required: Date.now
    },
    
});

const User = mongoose.model('User', Userschema);
module.exports = User;