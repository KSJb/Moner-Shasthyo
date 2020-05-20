const { eUser } = require('../models/eUser.js')
const { gUser } = require('../models/gUser.js')
const testModel = require('../models/test.js')
const material = require('../models/material.js')

module.exports.getUsers = async(req, res) => {
    const data = await eUser.find()
    res.render('admin-dashboard', {
        data,
        user: req.user
    })
}
module.exports.approveExpert = async(req, res) => {
    await eUser.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            isVerified: true
        }
    })
    res.redirect('back')
}

module.exports.discardExpert = async(req, res) => {
    await eUser.findByIdAndDelete(req.params.id)
    res.redirect('back')
}

module.exports.createTest = async(req, res) => {
    const {
        title,
        thumbnail,
        ageRange,
        category,
        about
    } = req.body

    const questionSet = JSON.parse(req.body.questionSet)
        // console.log(questionSet)

    const newTest = new testModel({
        title,
        thumbnail,
        ageRange,
        category,
        about,
        questionSet
    })
    console.log(newTest)
    await newTest.save()
    res.send({
        status: true,
        msg: 'okke'
    })
}

exports.allTests = async(req, res) => {
    const data = await testModel.find()
    const related = await testModel.find().sort({ _id: -1 }).limit(3)
    const { device } = req.query
    if (device == 'android') {
        res.send({ data })
    }
    res.render('allTests', {
        data,
        related
    })
}

exports.singleTest = async(req, res) => {
    const { device } = req.query
    if (device == 'android') {
        const data = await testModel.findById(req.params.id)
        res.send({
            data
        })
    }
    if (!req.user) {
        req.flash('errorMessage', 'You must be logged in to take this test')
        res.redirect('back')
    }
    const data = await testModel.findById(req.params.id)
    res.render('singleTest', {
        user: req.user,
        data
    })
}


exports.addTestToProfile = async(req, res) => {
    if (req.body.device == 'android') {
        const test = {
            id: req.body.id,
            name: req.body.name,
            score: req.body.score,
            date: getDate()
        }
        await gUser.findOneAndUpdate({ _id: req.body.user_id }, {
            $push: {
                testsTaken: test
            }
        })
        return res.send({
            status: true,
            msg: 'Test appended'
        })
    } else {
        if (req.user) {
            if (req.user.userType == 'general') {
                const test = {
                    id: req.body.id,
                    name: req.body.name,
                    score: req.body.score,
                    date: getDate()
                }
                await gUser.findOneAndUpdate({ _id: req.user._id }, {
                    $push: {
                        testsTaken: test
                    }
                })
                return res.send({
                    status: true,
                    msg: 'Test appended'
                })
            }
        }
    }

}

exports.searchTests = async(req, res) => {
    // const  } = req.query.search
    console.log(req.query)
        // res.render('testSearchResults')
}

exports.getQuestion = async(req, res) => {
    const question = await testModel.findOne({ _id: req.params.id })
    res.send(question)
}

exports.getEditTest = async(req, res) => {
    const data = await testModel.findById(req.params.id)
    res.render('editTest', {
        data
    })
}

exports.postEditTest = async(req, res) => {
    const {
        id,
        title,
        thumbnail,
        ageRange,
        category,
        about
    } = req.body

    const questionSet = JSON.parse(req.body.questionSet)
    console.log(questionSet)

    await testModel.findOneAndUpdate({ _id: id }, {
        $set: {
            id: id,
            title: title,
            thumbnail: thumbnail,
            ageRange: ageRange,
            category: category,
            about: about,
            questionSet: questionSet
        }
    })
    res.send({
        status: true,
        msg: 'okke'
    })
}
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
    // material

module.exports.createMaterial = async(req, res) => {
    console.log('post', req.body);
    let title = req.body.title;
    let body = req.body.body;
    let author = req.user.name;
    let author_id = req.user._id;
    let author_username = req.user.username;
    let category = req.body.category;
    let date = getDate();
    let view = 0;
    let upvote = 0;
    let tags = JSON.parse(req.body.tags);
    let thumbnail = req.body.thumbnail;


    const newPost = new material({
        title,
        thumbnail,
        body,
        author,
        author_id,
        author_username,
        category,
        date,
        view,
        upvote,
        tags,
    });

    console.log(newPost)

    await newPost.save()
    res.send({
        status: true
    });

}