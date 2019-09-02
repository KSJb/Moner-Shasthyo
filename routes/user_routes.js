const express = require('express');
const router = express.Router();

let User = require('./user');

router.get('/register', (req, res) => {
    res.sendFile('register.html');
})