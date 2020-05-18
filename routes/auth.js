const express = require("express");
const router = express.Router();
const controller = require('../controllers/admin');
const passport = require('passport')

router.get('/getUser', (req, res) => {
    if (req.user) {
        res.send(req.user)
    } else {
        res.send(null)
    }
})

router.get('/app-login', (req, res) => {
    if (!req.user) {
        return res.send({
            user: null,
            msg: req.session.loginMsg
        })
    } else {
        return res.send({
            user: req.user,
            msg: 'Logged in'
        })
    }
})

router.get('/login', controller.get_login);
router.get('/forgot_password', controller.get_forgot_password);
router.post('/forgot_password', controller.post_forgot_password);
router.get('/reset_password/', controller.get_reset_password);
router.post('/reset_password/', controller.post_reset_password);
router.post('/login', controller.post_login);
router.post('/login/android', controller.AndroidLogin)
router.get('/register/general/google', passport.authenticate('googleStrategy', {
    scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email']
}), controller.googleRegGen)
router.get('/register/general', (req, res) => {
    res.render('register_gen')
});
router.get('/register/expert', (req, res) => {
    res.render('register_exp')
});
router.post('/register/expert', controller.postRegExp);
router.post('/register/general', controller.postRegGen)
router.get('/logout', controller.logout);

router.post('/login/android', controller.androidLogin)

module.exports = router;

// http://bad-blogger.herokuapp.com/admin/reset_password