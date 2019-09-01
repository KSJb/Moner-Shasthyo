const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// router.get('/',  (req, res) => {res.render('index')});
router.get('/', function(req, res){
	Post.find({}, function(err, posts){
		if(err) res.json(err);
		else    res.render('index', {posts: posts});
	});
});

router.get('/index',  (req, res) =>
  res.render('index', {
    user: req.user
  })
);

module.exports = router;