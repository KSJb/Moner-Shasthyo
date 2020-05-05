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

router.get('/login', controller.get_login);
router.get('/forgot_password', controller.get_forgot_password);
router.post('/forgot_password', controller.post_forgot_password);
router.get('/reset_password/:email', controller.get_reset_password);
router.post('/reset_password/', controller.post_reset_password);
router.post('/login', controller.post_login);
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

// Actual admin tasks :-(
router.get('/all-tests', controller.allTests)
router.get('/create-test', (req, res) => {
    res.render('createTest')
})
router.post('/create-test', controller.createTest)
router.get('/single-test', controller.singleTest)
router.get('/search-test', controller.searchTests)
router.get('/get-question/:id', controller.getQuestion)
module.exports = router;