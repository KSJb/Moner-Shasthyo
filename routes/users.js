const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomString = require('randomstring');
const mailer = ('../misc/mailer');
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

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page


//Read more page
// router.get('/readmore', (req, res) => { res.render('readmore')});

// Register
router.route('/register')
.get((req, res) => { res.render('register') })
.post(async (req, res, next) => {
  const email = req.body.emailN;
  const password = req.body.passwordN;
  const name = req.body.nameN;
  const username = req.body.usernameN;
  let errors = [];
  console.log("Email, password, name, username : " + email + ", " + password + name + username);
  if (!email || !password || !name || !username) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  const secretToken = randomString.generate();
  console.log('token : ', secretToken);
  const emailVerified = false;

  if (errors.length > 0) {
    res.render('register', {
      errors,
      email,
      password,
      name,
      username,
      emailVerified,
      secretToken
    });
  }
  else {
    console.log('new user');
    const newUser = new User({
      email,
      password,
      username,
      name,
      emailVerified,
      secretToken
    });

    bcrypt.genSalt(10,  (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;        

        newUser
          .save()
          .then(user => {
            req.flash(
              'success_msg',
              'You are now registered and can log in'
            );
            console.log("Registered");

            const html = `<p>Your verification code is <strong> ${secretToken} </strong> </p>`;
            await mailer.sendEmail('admin@badblogger.com', email, 'Email Verification Request', html);

            res.redirect('/users/login');
          })
          .catch(err => console.log(err));
      });
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

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

router.post('/post', (req, res) => {
  console.log(req.body);
  const title = req.body.title_name;
  const body = req.body.body_name;
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
});

//Verify page
router.get('/verify', (req, res) => {
  res.render('verify');
})

router.post('/verify_post', (req, res) => {
  const token = req.body.token;
  const userToken = req.user.secretToken;
  console.log(' given : ', token);
  User.findOne({secretToken : token}, (err, foundUser) => {
    if(err){res.json(err);}  
    else{console.log(foundUser);
      foundUser.emailVerified = true,
      // foundUser.secretToken = ''
      foundUser.save().then((err, dbPost) => {
      console.log("verified : " + dbPost);
      res.redirect('/');
      })}

  })
})

router.get('/:id', function (req, res) {
  const id = req.params.id;
  console.log("in");

  Post.findOne({ _id: id }, function (err, foundPost) {
    console.log("clicked post : ", foundPost);
    console.log("Views : " + foundPost.view);
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
});

router.post('/postcomment', (req, res) => {
  const body = req.body.commentBody;
  const myPostID = req.body.postID;
  console.log(body, myPostID);

  const date = getDate();
  let errors = [];
  console.log("body : " + body);
  if (!body) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('index', {
      errors,
      body,
      date
    });
  }
  else {
    console.log('new comment');
    const newComment = new Comment({
      myPostID,
      body,
      date
    });
    console.log("new comment", newComment);
    newComment.save().then((dbSavedComment, err) => {
      console.log("inside the db function");
      console.log(dbSavedComment);
      console.log("THE END");
      res.redirect('back');
    })

  }
});

router.get('/upvote/:id', (req, res) => {
  const id = req.params.id;
  Post.findOneAndUpdate({ _id: id }, { $inc: { upvote: 1 } }, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('upvoted');
      res.redirect('back');
    }
  })
})

router.get('/comment/:id', (req, res) => {
  console.log("comment inc");
  const id = req.params.id;
  Post.findOneAndUpdate({ _id: id }, { $inc: { comment: 1 } }, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('upvoted');
      res.redirect('back');
    }
  })
})

router.get('logout', (res, req) => {
  res.render('login');
})
module.exports = router;


