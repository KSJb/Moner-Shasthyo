const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const { gUser } = require('../models/gUser.js');
const { eUser } = require('../models/eUser.js')
const admin = {
    id: 'admin_id',
    name: 'Admin',
    email: 'admin@app',
    password: 'admin123',
    userType: 'admin'
}
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, async(req, email, password, done) => {
            if (req.body.email == admin.email) {
                if (req.body.password == admin.password) {
                    return done(null, admin)
                } else {
                    req.flash('errorMessage', 'Incorrect password')
                    req.session.loginMsg = 'Incorrect password'
                    return done(null, false)
                }
            }
            const guser = await gUser.findOne({ email: req.body.email })
            if (guser) {
                const gmatch = await bcrypt.compare(req.body.password, guser.password)
                if (gmatch) {

                    return done(null, guser)
                } else {
                    req.flash('errorMessage', 'Incorrect password')
                    req.session.loginMsg = 'Incorrect password'
                    return done(null, false)
                }
            } else {
                const euser = await eUser.findOne({ email: req.body.email })
                if (euser) {
                    const ematch = await bcrypt.compare(req.body.password, euser.password)
                    console.log(euser.isVerified)
                    if (!ematch ) {
                        req.flash('errorMessage', 'Incorrect password')
                        req.session.loginMsg = 'Incorrect password'
                        return done(null, false)
                    } else if (!euser.isVerified) {
                        console.log('here')
                        req.flash('errorMessage', 'Your request is under consideration')
                        req.session.loginMsg = 'Incorrect password'
                        return done(null, false)
                    } else {
                        return done(null, euser)
                    }
                } else {
                    req.flash('errorMessage', 'Email not found')
                    req.session.loginMsg = 'Email not found'
                    return done(null, false)
                }
            }

        })
    );

    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        if (id == admin.id) {
            return done(null, admin)
        } else {
            gUser.findById(id, (err, guser) => {
                if (guser) {
                    return done(err, guser)
                } else {
                    eUser.findById(id, (err, euser) => {
                        if (euser) {
                            return done(err, euser)
                        } else {
                            return done(err)
                        }
                    })
                }
            })
        }
    });
};