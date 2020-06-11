const express = require("express");
const router = express.Router();
const controller = require('../controllers/post');

router.get('/', controller.loadHomepage)

router.get('/create', controller.create_blog);
router.get('/blogs', controller.get_all_posts);
router.post('/post', controller.create_post);
router.get('/verify/:token', controller.verify);
router.get('/view/:id', controller.view_post);
router.post('/postcomment', controller.post_comment);
router.get('/upvote/:id/:title/:author_id/:author_username', controller.inc_upvote);
router.get('/comment/:id', controller.post_comment);
router.post('/full_post', controller.full_post);
router.get('/save_post/:id', controller.save_post);
router.get('/get_saved_posts', controller.get_saved_posts);
router.get('/getAllusers', controller.getAllusers);
router.get('/get_notifs', controller.get_notifs);

// Profile
router.get('/profile', controller.profile);
router.get('/update-profile', controller.getUpdateProfile)
router.post('/update-profile', controller.postUpdateProfile)
router.post('/update-profile/android', controller.postUpdateProfileAndroid)
router.post('/update-expert-profile', controller.postUpdateExpertProfile)
router.post('/profile/add-record', controller.addDiaryRecord)
router.get('/profile/delete-record/:id', controller.deleteRecord)
router.get('/profile/delete-record/android/:id/:user_id', controller.deleteRecordAndroid)
router.post('/profile/add-record/android', controller.addDiaryRecordAndroid)

// Material
router.get('/materials', controller.allMaterials)
router.get('/single-material/:id', controller.singleMaterial)
router.get('/update-material/:id', controller.getUpdateMaterial)
router.post('/update-material', controller.postUpdateMaterial)
router.get('/add/material', controller.addMaterialToProfile)

router.get('/edit_post/:id', controller.edit_post);
router.get('/delete_post/:id', controller.delete_post);
router.post('/save_changes', controller.save_changes);
router.post('/uploadfile', controller.uploadfile);
router.get('/get_user', controller.get_user);

module.exports = router;