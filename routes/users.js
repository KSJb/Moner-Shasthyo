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
router.get('/resources/search', controller.resourceSearch)

// Profile
router.get('/profile', controller.profile);
router.get('/update-profile', controller.getUpdateProfile)
router.post('/update-profile', controller.postUpdateProfile)
router.post('/update-profile/android', controller.postUpdateProfileAndroid)
router.post('/update-expert-profile', controller.postUpdateExpertProfile)

// Diary Records
router.post('/profile/add-record', controller.addDiaryRecord)
router.get('/profile/delete-record/:id', controller.deleteRecord)
router.get('/profile/delete-record/android/:id/:user_id', controller.deleteRecordAndroid)
router.post('/profile/add-record/android', controller.addDiaryRecordAndroid)
router.get('/profile/get-diary/:id', controller.getDiaryRecords)

// Stress Records
router.post('/profile/add-stress', controller.addStressRecord)
router.get('/profile/delete-stress/:id', controller.deleteStress)
router.get('/profile/delete-stress/android/:id/:user_id', controller.deleteStressAndroid)
router.post('/profile/add-stress/android', controller.addStressRecordAndroid)
router.get('/profile/get-stress/:id', controller.getStressRecords)


// Material
router.get('/materials', controller.allMaterials)
router.get('/single-material/:id', controller.singleMaterial)
router.get('/update-material/:id', controller.getUpdateMaterial)
router.post('/update-material', controller.postUpdateMaterial)
router.get('/add/material', controller.addMaterialToProfile)
router.get('/materials/task/:id', controller.singleTask)
router.get('/materials/getScores/:id', controller.getMaterialScores)
router.get('/delete-material/:id',  controller.deleteMaterial)

router.get('/edit-resource/:id', controller.edit_post);
router.get('/delete-resource/:id', controller.deleteResource);
router.post('/save_changes', controller.save_changes);
router.post('/uploadfile', controller.uploadfile);
router.get('/get_user', controller.get_user);

module.exports = router;