const express = require('express');
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

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(expressLayouts);
app.set('view engine', 'ejs');
// 

/*
In case edited..
mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true}, (err)=>{
    console.log("db connected");
});
*/

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true}, (err)=>{
    console.log("db connected");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret_KEY',
  saveUninitialized: true,
  resave: true
}));

// Connect flash
app.use(flash());

require('./config/passport')(passport);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.get('/users', require('./routes/users.js'));
app.get('/', require('./routes/index.js'));


// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
const PORT = 4003;
app.listen(PORT, () => console.log(`Server running at - ${PORT}`));