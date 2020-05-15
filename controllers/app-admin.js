const { eUser } = require('../models/eUser.js')
const testModel = require('../models/test.js')
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
    const { device } = req.query
    if (device == 'android') {
        res.send({ data })
    }
    res.render('allTests', {
        data
    })
}

exports.singleTest = async(req, res) => {
    const data = await testModel.findById(req.params.id)
    const { device } = req.query
    if (device == 'android') {
        res.send(data)
    }
    res.render('singleTest', {
        data
    })
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