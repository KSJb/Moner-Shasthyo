const express = require("express");
const router = express.Router();
const controller = require('../controllers/app-admin.js');
const { adminAccess } = require('../middlewares/auth.js')

router.get('/dashboard', adminAccess, controller.getUsers)
router.get('/approve-user/:id', adminAccess, controller.approveExpert)
router.get('/discard-user/:id', adminAccess, controller.discardExpert)

// Actual admin tasks :-(
router.get('/all-tests', controller.allTests)
router.get('/create-test', adminAccess, (req, res) => {
    res.render('createTest')
})
router.post('/create-test', adminAccess, controller.createTest)
router.get('/single-test/:id', controller.singleTest)
router.get('/search-test', controller.searchTests)
router.get('/get-question/:id', controller.getQuestion)
router.get('/edit-test/:id', adminAccess, controller.getEditTest)
router.post('/edit-test', adminAccess, controller.postEditTest)
router.post('/test/new', controller.addTestToProfile)
router.get('/tests/getScores/:id', controller.getTestScores)

// materials
router.get('/create-material', adminAccess, (req, res) => {
    res.render('createMaterial')
})
router.post('/material/new', adminAccess, controller.createMaterial)
module.exports = router;

// http://bad-blogger.herokuapp.com/admin/reset_password
