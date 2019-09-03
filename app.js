const express = require ('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
const flash = require('connect-flash');
var Post = require('./models/post')
const app = express();

//Routes
const routes = require('./routes/index');
const users = require('./routes/users');

require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(expressLayouts);
app.set('view engine', 'ejs');

const path = require('path');

// const db = require('./db');
const collection = 'todo';

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true}, (err)=>{
    console.log("db connected");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.get('/users', require('./routes/users.js'));
app.get('/', require('./routes/index.js'));

// app.put('/:id', (req, res)=>{
//     const todoID = req.params.id;
//     const userInput = req.body;

//     db.get_db().collection(collection).findOneAndUpdate({_id : db.getprimaryKey(todoID)}, {$set : {todo : userInput.todo}}, {returnOriginal : false}, (err, result)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.json(result);
//         }
//     }); 
// });

// app.post('/login', function(req, res) {

//     console.log("hey");
//     res.sendFile('register.html');
  
//   });

// app.post('/', (req, res) => {
//     const userInput = req.body;
//     console.log('/');
//     db.get_db().collection(collection).insertOne(userInput, (err, result) => {
//         if (err){
//             console.log(err);
//         }
//         else{
//             res.json({result : result, document : result.ops[0]});
//         }
//     })
// })

// app.post('/comment', (req, res) => {
//     const userInput = req.body;
//     console.log('/comment'); console.log(req);

//     db.get_db().collection('comments').insertOne(userInput, (err, result) => {
//         if (err){
//             console.log(err);
//         }
//         else{
//             res.json({result : result, document : result.ops[0]});
//         }
//     })
// })

// app.delete('/:id', (req, res) => {
//     const todoID = req.params.id;
//     db.get_db().collection(collection).findOneAndDelete({_id : db.getprimaryKey(todoID)}, (err, result) => {
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.json(result);
//         }
//     });
// });  

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
  // Routes
  app.use('/', require('./routes/index.js'));
  app.use('/users', require('./routes/users.js'));

app.listen(3005, () => console.log('Server running'));