const express = require("express");
const router = express.Router();
const controller = require('../controllers/post');

router.get('/', controller.get_all_posts);
router.post('/post', controller.create_post);
router.get('/verify/:token', controller.verify);
router.get('/:id', controller.view_post);
router.post('/postcomment', controller.post_comment);
router.get('/upvote/:id', controller.inc_upvote);
router.get('/comment/:id', controller.post_comment);

module.exports = router;
