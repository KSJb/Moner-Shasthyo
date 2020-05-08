const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// router.get('/',  (req, res) => {res.render('index')});

router.get('/', async(req, res) => {
    const data = await Post.find().sort({ _id: -1 })
    const trending = await Post.find().sort({ view: 1 }).limit(5)
    let welcome = 'false'
    if (req.session.prev == 'login') {
        welcome = 'true'
        console.log('backend: true')
    }
    res.render('index', {
        welcome,
        user: req.user,
        data,
        trending
    })
});

router.get('/index', (req, res) =>
    res.render('index', {
        user: req.user
    })
);

module.exports = router;