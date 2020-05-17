const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
// Load User model
const { gUser } = require('../models/gUser');
const { eUser } = require('../models/eUser')
const material = require('../models/material.js')
const Post = require('../models/post');
const testModel = require('../models/test')
const Comment = require('../models/comment');
const Notif = require('../models/notifs');
var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function(callback) {
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

module.exports.loadHomepage = async(req, res) => {
    const materials = await material.find().sort({ _id: -1 }).limit(3)
    const tests = await testModel.find().sort({ _id: -1 }).limit(3)
    const resources = await Post.find().sort({ _id: -1 }).limit(3)

    res.render('homepage', {
        user: req.user,
        materials,
        tests,
        resources
    })
}

module.exports.profile = (req, res) => {
    if (req.user) {
        if (req.user.userType == 'general') {
            res.render('profile', {
                user: req.user
            })
        } else if (req.user.userType == 'expert') {
            res.render('expert-profile', {
                user: req.user
            })
        }
    } else {
        req.flash('errorMessage', 'Log in to continue')
        res.redirect('back')
    }
}
module.exports.getUpdateProfile = async(req, res) => {
    if (req.user) {
        if (req.user.userType == 'general') {
            res.render('updateProfile', {
                user: req.user
            })
        } else if (req.user.userType == 'expert') {
            res.render('update-expert-profile', {
                user: req.user
            })
        }
    } else {
        req.flash('errorMessage', 'Log in to continue')
        res.redirect('back')
    }
}

module.exports.postUpdateProfile = async(req, res) => {
    if (req.user) {
        await gUser.findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                maritalStatus: req.body.maritalStatus,
                gender: req.body.gender,
                livingArea: req.body.livingArea,
                residenceType: req.body.residenceType,
                familyType: req.body.familyType,
                education: req.body.education,
                occupation: req.body.education,
                monthlyIncome: req.body.monthlyIncome
            }
        })
        res.send({
            status: true,
            msg: 'Updated'
        })
    } else {
        res.send({
            status: false,
            msg: 'Log in to continue'
        })
    }
}

module.exports.postUpdateExpertProfile = async(req, res) => {
    if (req.user) {
        await eUser.findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                designation: req.body.designation,
                organization: req.body.organization,
                license: req.body.license,
                education: {
                    institute: req.body.institute,
                    hDegree: req.body.hDegree,
                    field: req.body.field
                },
                residence: {
                    city: req.body.city,
                    country: req.body.country
                }
            }
        })
        res.send({
            status: true,
            msg: 'Updated'
        })
    }
    res.send({
        status: false,
        msg: 'Log in to continue'
    })
}

module.exports.get_saved_posts = (req, res) => {
    const savedPostsArray = req.user.savePosts;
    const currentuser = req.user;
    console.log('get_saved_posts()');
    Post.find({ "_id": { "$in": savedPostsArray } }).then(posts => {
        console.log('Posts: ', posts);
        res.render('profile', {
            posts: posts,
            currentuser: currentuser,
            owner: 'others'
        })
    })
}

module.exports.get_all_posts = async(req, res) => {
    const { device } = req.query
    if (device == 'android') {
        const data = await Post.find().sort({ _id: -1 })
        res.send({
            data,
            user: req.user
        })
    }
    const data = await Post.find().sort({ _id: -1 })
    const trending = await Post.find().sort({ view: 1 }).limit(5)
    let welcome = 'false'
    if (req.session.prev == 'login') {
        welcome = 'true'
        console.log('backend: true')
    }
    res.render('allBlogs', {
        welcome,
        user: req.user,
        data,
        trending
    })
}

exports.allMaterials = async(req, res) => {
    const { device, category } = req.query
    if (category) {
        const data = await material.find({ category: category })
        if (device == 'android') {
            res.send({
                status: true,
                data,
                msg: 'okke'
            })
        } else {
            res.render('materialSearchResults', {
                data
            })
        }
    }
    const data = await material.find()
    if (device == 'android') {
        res.send({
            status: true,
            data,
            msg: 'okke'
        })
    }
    res.render('all-materials', {
        data
    })
}

exports.singleMaterial = async(req, res) => {
    const { device } = req.query
    if (!req.user) {
        if (device == 'android') {
            res.send({
                status: false,
                data: null,
                msg: 'You must be logged in to view this material'
            })
        } else {
            req.flash('errorMessage', 'You must be logged in to view this material')
            res.redirect('back')
        }
    }
    const data = await material.findOne({ _id: req.params.id })
    const relatedPosts = await material.find().sort({ _id: -1 }).limit(3)
    if (device == 'android') {
        res.send({
            status: true,
            data,
            msg: 'Okke'
        })
    }
    res.render('single-material', {
        posts: data,
        relatedPosts
    })
}

exports.getUpdateMaterial = async(req, res) => {
    const post = await material.find({ _id: req.params.id })
    let tagString = ''
    for (let i = 0; i < post[0].tags.length; i++) {
        tagString += post[0].tags[i]
        tagString += ', '
    }
    console.log(tagString)
    res.render('updateMaterial', {
        post: post[0],
        tagString
    })
}

exports.postUpdateMaterial = async(req, res) => {
    const {
        id,
        title,
        body,
        thumbnail
    } = req.body
    const tags = JSON.parse(req.body.tags)
    await material.findOneAndUpdate({ _id: id }, {
        $set: {
            title: title,
            body: body,
            thumbnail: thumbnail,
            tags: tags
        }
    })
    res.send({
        staus: true,
        id: id
    })
}

exports.addMaterialToProfile = async(req, res) => {
    const mat = {
        id: req.query.id,
        name: req.query.name,
        score: req.query.score,
        date: getDate(),
    }
    if (req.user.userType == 'general') {
        await gUser.findOneAndUpdate({ _id: req.user._id }, {
            $push: {
                materialsRead: mat
            }
        })
        res.redirect('/users/profile')

    } else {
        res.redirect('back')
    }
}

module.exports.get_notifs = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('login_prompt', 'log in');
        res.redirect('/');
    } else {
        console.log('homepage + notifs entered');
        const currentuser = req.user;
        Post.find().sort({ _id: -1 }).then(posts => {
            Notif.find({ receiver_id: req.user._id }).then(notifs_array => {
                return res.render("index", {
                    notifs: true,
                    notifs_array: notifs_array,
                    posts: posts,
                    user: currentuser
                })
            });
        })
    }

}

module.exports.create_post = (req, res) => {
    console.log(req.body);
    const title = req.body.title_name;
    const body = req.body.body_name;
    const type = 'simple';
    const author = req.user.name;
    const author_id = req.user._id;
    const author_username = req.user.username;
    const date = getDate();
    const view = 0;
    const upvote = 0;
    const comment = 0;
    const tags = 'none';
    const code = 'none';
    const code2 = 'none';
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
            type,
            author,
            author_id,
            author_username,
            date,
            view,
            upvote,
            comment,
            tags,
            code,
            code2
        });
    } else {
        console.log('new post');
        const newPost = new Post({
            title,
            body,
            type,
            author,
            author_id,
            author_username,
            date,
            view,
            upvote,
            comment,
            tags,
            fileName: code,
            fileLink: code2
        });

        newPost.save().then((err, dbPost) => {
            console.log("Post created : " + dbPost);
            req.flash('quick_post', 'quick post');
            res.redirect('/');
        })

    }
}

module.exports.full_post = async(req, res) => {
    console.log('post', req.body);
    let title = req.body.title;
    let body = req.body.body;
    let type = 'complex';
    let author = req.user.name;
    let author_id = req.user._id;
    let author_username = req.user.username;
    let date = getDate();
    let view = 0;
    let comment = 0;
    let upvote = 0;
    let tags = JSON.parse(req.body.tags);
    let code = req.body.code;
    let thumbnail = req.body.thumbnail;


    const newPost = new Post({
        title,
        thumbnail,
        body,
        type,
        author,
        author_id,
        author_username,
        date,
        view,
        upvote,
        comment,
        tags,
    });

    await newPost.save()
    res.send({
        status: true
    });

}


module.exports.create_blog = (req, res) => {
    if (!req.user) {
        req.flash('errorMessage', 'Please sign in to continue')
        res.redirect('/')
    } else if (req.user.userType == 'general') {
        req.flash('errorMessage', 'This feature is not available for general users')
        res.redirect('/')
    } else {
        res.render('create_blog')
    }
}

//Verify page
module.exports.verify = (req, res) => {
    const token = req.params.token;
    User.findOne({ secretToken: token }, (err, foundUser) => {
        if (err) { res.json(err); } else {
            foundUser.emailVerified = true,
                // foundUser.secretToken = ''
                foundUser.save().then((err, dbPost) => {
                    res.redirect('/');
                })
        }

    })
}

module.exports.view_post = async(req, res) => {
    const { device } = req.query

    const id = req.params.id;
    const posts = await Post.findOne({ _id: id })
    const relatedPosts = await Post.find().sort({ _id: -1 }).limit(4)
    if (device == 'android') {
        res.send({
            data: posts,
            user: req.user
        })
    }
    res.render('readmore', {
        posts,
        relatedPosts
    })
}

module.exports.save_post = async(req, res) => {
    const post_id = req.params.id;
    const update = await User.findOneAndUpdate({ _id: req.user._id }, { $push: { savePosts: post_id } });
    res.redirect('back');
}

module.exports.getAllusers = async(req, res) => {
    return res.json(await User.find());
}

module.exports.post_comment = async(req, res) => {
    let body = req.body.commentBody;
    const myPostID = req.body.postID;
    const myPostTitle = req.body.postTitle;
    const commentedBy = req.user._id;
    const commentedBy_Username = req.user.username;
    const receiver_id = req.body.receiver_id;
    const mentionedUsers = 'none';

    if (commentedBy != receiver_id) {
        send_notif(myPostID, myPostTitle, commentedBy, commentedBy_Username, receiver_id, 'comment');
    }

    const date = getDate();
    if (!body) {
        body = "body";
    }

    const newComment = new Comment({
        myPostID,
        body,
        commentedBy,
        commentedBy_Username,
        date,
        mentionedUsers
    });
    const dbSavedComment = await newComment.save();
    res.redirect('back');

}

async function send_notif(post_id, post_title, sender_id, sender_username, receiver_id, type) {
    const date = getDate();

    const newNotif = new Notif({
        post_id,
        post_title,
        sender_id,
        sender_username,
        receiver_id,
        type,
        date
    });
    const dbSavedNotif = await newNotif.save();
}

module.exports.inc_upvote = async(req, res) => {
    const id = req.params.id;
    const title = req.params.title;
    const author_id = req.params.author_id;
    const author_username = req.params.author_username;
    if (req.user._id != author_id) {
        send_notif(id, title, req.user._id, req.user.username, author_id, 'upvote');
    }
    const data = await Post.findOneAndUpdate({ _id: id }, { $inc: { upvote: 1 } });
    res.redirect('back');
}

module.exports.inc_comment = async(req, res) => {
    const id = req.params.id;
    const data = await Post.findOneAndUpdate({ _id: id }, { $inc: { comment: 1 } });
    res.redirect('back');
}

module.exports.edit_post = async(req, res) => {
    const post = await Post.find({ _id: req.params.id })
    let tagString = ''
    for (let i = 0; i < post[0].tags.length; i++) {
        tagString += post[0].tags[i]
        tagString += ', '
    }
    console.log(tagString)
    res.render('editPost', {
        post: post[0],
        tagString
    })
}

module.exports.save_changes = async(req, res) => {
    const {
        id,
        title,
        body,
        thumbnail
    } = req.body
    const tags = JSON.parse(req.body.tags)
    await Post.findOneAndUpdate({ _id: id }, {
        $set: {
            title: title,
            body: body,
            thumbnail: thumbnail,
            tags: tags
        }
    })
    res.send({
        staus: true,
        id: id
    })
}

module.exports.delete_post = async(req, res) => {
    const id = req.params.id;
    console.log('id : ', id);
    Post.findOneAndRemove({ _id: id }, function(err) { console.log(err) });
    res.redirect('back');
}

module.exports.uploadfile = async(req, res) => {
    console.log('upload file');
    res.redirect('back');
}

module.exports.get_user = async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({
            user: false
        })
    } else {
        return res.json({
            user: true
        })
    }
}

// http://bad-blogger.herokuapp.com/users/blogs?device=android
// http://bad-blogger.herokuapp.com/users/view/:id?device=android
// http://bad-blogger.herokuapp.com/admin/register/general
// http://bad-blogger.herokuapp.com/admin/register/expert