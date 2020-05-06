const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// router.get('/',  (req, res) => {res.render('index')});

router.get('/', async(req, res) => {
    const data = await Post.find().sort({ _id: -1 })
    const trending = await Post.find().sort({ view: 1 }).limit(5)
        // console.log(trending)
    res.render('index', {
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