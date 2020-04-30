const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const { gUser } = require('../models/gUser');
const { eUser } = require('../models/eUser')

module.exports.googleStrategy = (passport) => {
    passport.use(new GoogleStrategy({
            clientID: '887125122883-jsba3nm3r7pei13lttvh9bvoifu4vbot.apps.googleusercontent.com',
            clientSecret: 'EuXF134L9w84RETN3Eo3yYlJ',
            callbackURL: '/auth/google/redirect'
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log(profile);
            return cb();
        }
    ));
}

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, async(req, email, password, done) => {
            // Match user
            // console.log(req.body)
            const guser = await gUser.findOne({ email: req.body.email })
            if (guser) {
                const gmatch = await bcrypt.compare(req.body.password, guser.password)
                if (gmatch) {
                    return done(null, guser)
                } else {
                    req.flash('errorMessage', 'Incorrect Password')
                    return done(null, false)
                }
            } else {
                const euser = await eUser.findOne({ email: req.body.email })
                    // console.log(euser)
                if (euser) {
                    const ematch = await bcrypt.compare(req.body.password, euser.password)
                    if (ematch) {
                        return done(null, euser)
                    } else {
                        req.flash('errorMessage', 'Incorrect Password')
                        return done(null, false)
                    }
                } else {
                    req.flash('errorMessage', 'Email not found')
                    return done(null, false)
                }
            }
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        gUser.findById(id, (err, user) => {
            if (user) {
                return done(null, user)
            } else {
                eUser.findById(id, (err, user) => {
                    if (user) {
                        return done(null, user)
                    } else {
                        return done(err)
                    }
                })
            }
        })
    });
};