const express = require("express");
const router = express.Router();
const controller = require('../controllers/admin');

router.get('/login', controller.get_login);
router.get('/forgot_password', controller.get_forgot_password);
router.post('/forgot_password', controller.post_forgot_password);
router.get('/reset_password/:email', controller.get_reset_password);
router.post('/reset_password/', controller.post_reset_password);
router.post('/login', controller.post_login);
router.get('/register', controller.get_register);
router.post('/register', controller.post_register);
router.get('/logout', controller.logout);
module.exports = router;
