const express = require('express');
const express_layout = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

//Database
const db = require('./config/keys').MongoURI;

//Mongo connection
mongoose.connect(db, {useNewUrlParser: treu})
    .then(() => console.log("Mongo connected"))
    .catch(err => console.log(err));

//EJS
app.use(express_layout);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({ extended: false }));

//Routes
app.use('/', require('./routers/index'));
app.use('/users', require('./routers/users'));

const PORT = process.env.PORT || 5005;
app.listen(PORT, console.log(`Server at ${PORT}`));