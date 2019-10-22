const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
// Load User model
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
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
module.exports.post_register = async (req, res, next) => {
  const email = req.body.emailN;
  const password = req.body.passwordN;
  const name = req.body.nameN;
  const username = req.body.usernameN;
  let errors = [];
  console.log("Email, password, name, username : " + email + ", " + password + ", " + name + ", " + username);
  if (!email || !password || !name || !username) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  const secretToken = randomString.generate();
  console.log('token : ', secretToken);
  const emailVerified = false;
  const unreadNotif = 0;
  console.log('unread notif: ', unreadNotif);

  if (errors.length > 0) {
    res.render('register', {
      errors,
      email,
      password,
      name,
      username,
      emailVerified,
      secretToken
    });
  }
  else {
    console.log('new user');
    const newUser = new User({
      name,
      unreadNotif,
      username,
      email,
      password,
      emailVerified,
      secretToken
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        newUser
          .save()
          .then(async (user) => {
            req.flash(
              'success_msg',
              'You are now registered and can log in'
            );
            console.log("Registered");

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
              subject: "Email confirmation request",
              html: `Hey <strong>${name}</strong>, <br>Click on the link to verify your email.<br><a href="http://localhost:${port}/users/verify/${secretToken}"><b>Verify</b></a> <br> Nice day!`
            }
            console.log(mailOptions);

            Transport.sendMail(mailOptions, function (error, response) {
              if (error) {
                console.log(error);
                res.end("error");
              } else {
                console.log("Message sent: " + response.response);
                req.flash('success', 'An email has been sent to the email provided. Login to continue');
                res.redirect('/admin/login');
              }
            });
          })
          .catch(err => console.log(err));
      });
    });
  }
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

module.exports.post_forgot_password = async (req, res) => {
  const userEmail = req.body.emailN;
  console.log('email: ', userEmail);
  const user = await User.findOne({ email: userEmail }).select("email").lean();
  if (user) {
    console.log('user found');
    sendResetLink(userEmail);
  }
  else {
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

  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent");
    }
  });
}

module.exports.get_reset_password = async (req, res) => {
  const email = req.params.email;
  console.log('get_reset_password - ', email);
  req.flash('okay');
  res.render('reset_password', {
    Email : email
  });
}

module.exports.post_reset_password = async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;

  if (password == confirmPassword){
    console.log('matched , ', password, " + ", confirmPassword);
    resetPassword(req, res, email, password);
  }
  else{
    req.flash('notmatched', ' ');
    res.redirect('back');
  }
}

function resetPassword(req, res, Email, Password) {
  User.updateOne({email: Email}, { $set: { password: Password }}, function(err, docs){
    console.log(docs);
    req.flash('reset_success');
    res.redirect('/admin/login');
  })
}