const express = require('express'); 
const router = express.Router();

//Login
router.get('/login', (req, res) => res.render('login'));

//Register
router.get('/register', (req, res) => res.render('register'));

//Register handle
router.post('/register', (req, res) => {
    console.log(req.body);
    res.send('From res send');
})
 module.exports = router;