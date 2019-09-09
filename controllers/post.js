const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
// Load User model
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
  console.log('Successfully connected to MongoDB.');
});
const Schema = mongoose.Schema;

const getDate = () => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth()); //January is 0!
  var yyyy = today.getFullYear();
  let thisDate = monthNames[mm] + " " + dd + ", " + yyyy
  return thisDate;
  // console.log("Date: "+thisDate);
}

module.exports.get_all_posts = (req, res) => {
  if (!req.isAuthenticated()) res.redirect('/admin/login');
  console.log('/ entered');
	const currentuser = req.user;
	let posts = [];
	Post.find().sort({_id:-1}) .then(posts => {
			return res.render("index", {
					posts: posts,
					user: currentuser
			});
	})
	.catch(err => returnError({ msg: "Getting Error In Getting Data" }))
}

module.exports.create_post = (req, res) => {
  console.log(req.body);
  const title = req.body.title_name;
  const body = req.body.body_name;
  const author = req.user.name;
  const author_id = req.user._id;
  const author_username = req.user.username;
  const date = getDate();
  const view = 0;
  const upvote = 0;
  const comment = 0;
  let errors = [];
  console.log("title, body, date: " + title + ", " + body + ", " + date);
  if (!title || !body) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('index', {
      errors,
      title,
      body,
      author,
      author_id,
      author_username,
      date,
      view,
      upvote,
      comment
    });
  }
  else {
    console.log('new post');
    const newPost = new Post({
      title,
      body,
      author,
      author_id,
      author_username,
      date,
      view,
      upvote,
      comment
    });

    newPost.save().then((err, dbPost) => {
      console.log("Post created : " + dbPost);
      res.redirect('/');
    })

  }
}

//Verify page
module.exports.verify = (req, res) => {
  const token = req.params.token;
  console.log(' given : ', token);
  User.findOne({ secretToken: token }, (err, foundUser) => {
    if (err) { res.json(err); }
    else {
      console.log(foundUser);
      foundUser.emailVerified = true,
        // foundUser.secretToken = ''
        foundUser.save().then((err, dbPost) => {
          console.log("verified : " + dbPost);
          res.redirect('/');
        })
    }

  })
}

module.exports.view_post = (req, res) => {
  const id = req.params.id;
  console.log("in");

  Post.findOne({ _id: id }, function (err, foundPost) {
    console.log("clicked post : ", foundPost);
    if (err) res.json(err);
    else {
      Comment.find({ myPostID: id }, function (err, foundComments) {
        console.log(err, foundComments);
        if (err) res.json(err);
        else {
          Post.findOneAndUpdate({ _id: id }, { $inc: { view: 1 } }, function (err, data) {
            if (err) {
              console.log(err);
            }
            else {
              res.render('readmore', {
                posts: foundPost,
                views: foundPost.view,
                comments: foundComments
              });
            }
          })
        }

      });
    }
  });
}

module.exports.post_comment = async (req, res) => {
  const body = req.body.commentBody;
  const myPostID = req.body.postID;
  const commentedBy = req.user._id;
  const commentedBy_Username = req.user.username;
  console.log(body, myPostID);

  const date = getDate();
  let errors = [];
  console.log("body : " + body);
  if (!body) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    return res.render('index', {
      errors,
      commentedBy,
      commentedBy_Username,
      body,
      date
    });
  }
  console.log('new comment');
  const newComment = new Comment({
    myPostID,
    body,
    commentedBy,
    commentedBy_Username,
    date
  });
  console.log("new comment", newComment);
  const dbSavedComment = await newComment.save();
  console.log("inside the db function");
  console.log(dbSavedComment);
  console.log("THE END");
  res.redirect('back');

}

module.exports.inc_upvote = async (req, res) => {
  const id = req.params.id;
  const data = await Post.findOneAndUpdate({ _id: id }, { $inc: { upvote: 1 } });
  res.redirect('back');
}

module.exports.inc_comment = async (req, res) => {
  console.log("comment inc");
  const id = req.params.id;
  const data = await Post.findOneAndUpdate({ _id: id }, { $inc: { comment: 1 } });
  res.redirect('back');
}