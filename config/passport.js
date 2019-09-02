const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use('local',
    new LocalStrategy({ usernameField: 'emailN' }, (email, password, done) => {
      // Match user
      console.log("HEEEELLLLOOO");
      console.log("Email : "+email);
      console.log("password", password);

      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          console.log("Email not registered");
          return done(null, false, { message: 'That email is not registered' });
        }
        console.log(user);
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            console.log("Incorrect password");
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
