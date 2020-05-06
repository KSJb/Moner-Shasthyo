const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
// Load User model
const { gUser } = require('../models/gUser');
const { eUser } = require('../models/eUser')
const testModel = require('../models/test')
const Post = require('../models/post');
const Comment = require('../models/comment');
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function(callback) {
    console.log('Successfully connected to MongoDB.');
});
const Schema = mongoose.Schema;

// Get login page
module.exports.get_login = (req, res) => {
    res.render('login');
};
// Post login page
module.exports.post_login = (req, res, next) => {
    req.flash('login', 'home page reached');
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
}

// Get register page 
module.exports.get_register = (req, res) => { res.render('register') }
    // Post register page
module.exports.postRegGen = async(req, res, next) => {
    const {
        name,
        username,
        email,
        password
    } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const userObj = {
        name,
        username,
        email,
        password: hashed
    }
    const newGenUser = new gUser(userObj)
        // console.log(newGenUser)
    await newGenUser.save()
    console.log('general saved')
    res.send({
        status: true,
        msg: 'okke'
    })
}

module.exports.googleRegGen = async(req, res) => {
    const GoogleStrategy = require('passport-google-oauth20').Strategy
    console.log('in')
    passport.use(new GoogleStrategy({
            clientID: '887125122883-jsba3nm3r7pei13lttvh9bvoifu4vbot.apps.googleusercontent.com',
            clientSecret: 'EuXF134L9w84RETN3Eo3yYlJ',
            callbackURL: '/auth/google/redirect'
        },
        async(accessToken, refreshToken, profile, cb) => {
            console.log(profile);
        }
    ));
}

module.exports.postRegExp = async(req, res, next) => {
    const {
        name,
        username,
        email,
        organization,
        designation,
        password
    } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const userObj = {
        name,
        username,
        email,
        organization,
        designation,
        password: hashed
    }
    const newExpUser = new eUser(userObj)
        // console.log(newExpUser)
    await newExpUser.save()
    console.log('expert saved')
    res.send({
        status: true,
        msg: 'okke'
    })
}

// Logout
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admin/login');
}

//Forgot password page
module.exports.get_forgot_password = (req, res) => {
    res.render('forgot_password');
};

module.exports.post_forgot_password = async(req, res) => {
    const userEmail = req.body.emailN;
    console.log('email: ', userEmail);
    const user = await User.findOne({ email: userEmail }).select("email").lean();
    if (user) {
        console.log('user found');
        sendResetLink(userEmail);
    } else {
        console.log('not found');
    }
    req.flash('mail_sent', '  ');
    res.redirect('back');
}

function sendResetLink(email) {
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "safwan.du16@gmail.com",
            pass: "home761049997"
        }
    });
    var rand, mailOptions, host, link;
    let sender = 'admin@badblogger.com';
    let port = 4003;
    mailOptions = {
        from: sender,
        to: email,
        subject: "badBlogger : Password Reset",
        html: `Seems like you just forgot your password :-( , it happens :-)<br>Click on the link to reset your password.<br><a href="http://localhost:${port}/admin/reset_password/${email}"><b>Reset Page</b></a> <br> Nice day!`
    }
    console.log(mailOptions);

    Transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent");
        }
    });
}

module.exports.get_reset_password = async(req, res) => {
    const email = req.params.email;
    console.log('get_reset_password - ', email);
    req.flash('okay');
    res.render('reset_password', {
        Email: email
    });
}

module.exports.post_reset_password = async(req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const email = req.body.email;

    if (password == confirmPassword) {
        console.log('matched , ', password, " + ", confirmPassword);
        resetPassword(req, res, email, password);
    } else {
        req.flash('notmatched', ' ');
        res.redirect('back');
    }
}

function resetPassword(req, res, Email, Password) {
    User.updateOne({ email: Email }, { $set: { password: Password } }, function(err, docs) {
        console.log(docs);
        req.flash('reset_success');
        res.redirect('/admin/login');
    })
}

// actual admin tasks :-( 

module.exports.createTest = async(req, res) => {
    const {
        title,
        thumbnail,
        ageRange,
        category,
        about
    } = req.body

    const questionSet = JSON.parse(req.body.questionSet)
        // console.log(questionSet)

    const newTest = new testModel({
        title,
        thumbnail,
        ageRange,
        category,
        about,
        questionSet
    })
    console.log(newTest)
    await newTest.save()
    res.send({
        status: true,
        msg: 'okke'
    })
}

exports.allTests = async(req, res) => {
    res.render('allTests')
}

exports.singleTest = async(req, res) => {
    const data = await testModel.findById('5eb1847453de6f0b630ba182')
    res.render('singleTest', {
        data
    })
}

exports.searchTests = async(req, res) => {
    // const  } = req.query.search
    console.log(req.query)
        // res.render('testSearchResults')
}

exports.getQuestion = async(req, res) => {
    const question = await testModel.findOne({ _id: req.params.id })
    res.send(question)
}

exports.getEditTest = async(req, res) => {
    const data = await testModel.findById(req.params.id)
    res.render('editTest', {
        data
    })
}

exports.postEditTest = async(req, res) => {
    const {
        id,
        title,
        thumbnail,
        ageRange,
        category,
        about
    } = req.body

    const questionSet = JSON.parse(req.body.questionSet)
    console.log(questionSet)

    await testModel.findOneAndUpdate({ _id: id }, {
        $set: {
            id: id,
            title: title,
            thumbnail: thumbnail,
            ageRange: ageRange,
            category: category,
            about: about,
            questionSet: questionSet
        }
    })
    res.send({
        status: true,
        msg: 'okke'
    })
}