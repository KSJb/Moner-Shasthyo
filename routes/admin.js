const express = require("express");
const router = express.Router();
const controller = require('../controllers/admin');

router.get('/login', controller.get_login);
router.post('/login', controller.post_login);
router.get('/register', controller.get_register);
router.post('/register', controller.post_register);
router.get('/logout', controller.logout);
module.exports = router;
